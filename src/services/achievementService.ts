// src/services/achievementService.ts
import { supabase } from '@/lib/supabase'
import { submissionService } from './submissionService'

export const achievementService = {
  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })

    if (error) throw error
    return data
  },

  async checkAndAwardAchievements(userId: string) {
    // This would typically be called after a submission
    // Complex logic can be moved to Supabase Edge Functions
    const { data: stats } = await submissionService.getSubmissionStats(userId)
    const { data: userAchievements } = await this.getUserAchievements(userId)
    const earnedAchievementIds = userAchievements.map(ua => ua.achievement_id)

    const { data: availableAchievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .not('id', 'in', `(${earnedAchievementIds.join(',')})`)

    const newAchievements = []

    for (const achievement of availableAchievements) {
      let earned = false

      switch (achievement.category) {
        case 'problems':
          earned = stats.solved >= achievement.requirement_value
          break
        case 'streak':
          // Check current streak from user table
          const { data: user } = await supabase
            .from('users')
            .select('current_streak')
            .eq('id', userId)
            .single()
          earned = user?.current_streak >= achievement.requirement_value
          break
        // Add more achievement logic as needed
      }

      if (earned) {
        newAchievements.push({
          user_id: userId,
          achievement_id: achievement.id
        })
      }
    }

    if (newAchievements.length > 0) {
      await supabase.from('user_achievements').insert(newAchievements)
    }

    return newAchievements
  }
}

