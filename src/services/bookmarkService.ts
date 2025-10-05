// src/services/bookmarkService.ts
import { supabase } from '@/lib/supabase'

export interface Bookmark {
  id: string
  user_id: string
  problem_id: string
  created_at: string
}

export const bookmarkService = {
  /**
   * Get all bookmarked problem IDs for a user
   */
  async getUserBookmarks(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('bookmarked_problems')
      .select('problem_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
      throw error
    }

    return data.map((bookmark) => bookmark.problem_id)
  },

  /**
   * Check if a specific problem is bookmarked
   */
  async isBookmarked(userId: string, problemId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('bookmarked_problems')
      .select('id')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .maybeSingle()

    if (error) {
      console.error('Error checking bookmark:', error)
      return false
    }

    return data !== null
  },

  /**
   * Add a bookmark (star a problem)
   */
  async addBookmark(userId: string, problemId: string): Promise<void> {
    const { error } = await supabase
      .from('bookmarked_problems')
      .insert({
        user_id: userId,
        problem_id: problemId,
      })

    if (error) {
      // Ignore unique constraint violations (already bookmarked)
      if (error.code === '23505') {
        console.log('Problem already bookmarked')
        return
      }
      console.error('Error adding bookmark:', error)
      throw error
    }

    console.log('✅ Bookmark added successfully')
  },

  /**
   * Remove a bookmark (unstar a problem)
   */
  async removeBookmark(userId: string, problemId: string): Promise<void> {
    const { error } = await supabase
      .from('bookmarked_problems')
      .delete()
      .eq('user_id', userId)
      .eq('problem_id', problemId)

    if (error) {
      console.error('Error removing bookmark:', error)
      throw error
    }

    console.log('✅ Bookmark removed successfully')
  },

  /**
   * Toggle bookmark status
   */
  async toggleBookmark(userId: string, problemId: string): Promise<boolean> {
    const isBookmarked = await this.isBookmarked(userId, problemId)

    if (isBookmarked) {
      await this.removeBookmark(userId, problemId)
      return false
    } else {
      await this.addBookmark(userId, problemId)
      return true
    }
  },

  /**
   * Get count of bookmarked problems
   */
  async getBookmarkCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('bookmarked_problems')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching bookmark count:', error)
      return 0
    }

    return count || 0
  },
}