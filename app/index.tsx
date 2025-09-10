import { useEffect } from 'react';
import { router } from 'expo-router';

export default function IndexScreen() {
  useEffect(() => {
    // Redirect to chat screen on app startup
    router.replace('/(drawer)/chat');
  }, []);

  return null;
}
