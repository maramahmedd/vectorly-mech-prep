import { useAuth } from '@/contexts/AuthContext';

export type UserState = 'not_logged_in' | 'logged_in' | 'premium';

export const useUserState = () => {
  const { user, loading } = useAuth();

  const isPremium = (user as any)?.subscription_tier === 'premium';

  let userState: UserState;
  if (!user) {
    userState = 'not_logged_in';
  } else if (isPremium) {
    userState = 'premium';
  } else {
    userState = 'logged_in';
  }

  return {
    userState,
    isNotLoggedIn: userState === 'not_logged_in',
    isLoggedIn: userState === 'logged_in' || userState === 'premium',
    isPremium: userState === 'premium',
    loading,
    user,
  };
};
