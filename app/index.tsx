import { useEffect } from 'react';
import { router } from 'expo-router';

export default function IndexScreen() {
  useEffect(() => {
    // Redirect to home screen on app startup
    router.replace('/(drawer)/home');
  }, []);

  return null;
}
