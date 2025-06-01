import { useEffect } from 'react';
import { router } from 'expo-router';

export default function DiscoverRedirectTab() {
  useEffect(() => {
    router.replace('/discover');
  }, []);

  return null;
}