import { useEffect } from 'react';
import { router } from 'expo-router';

export default function NewRecipeTab() {
  useEffect(() => {
    router.replace('/recipe');
  }, []);

  return null;
}