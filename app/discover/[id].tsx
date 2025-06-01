import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, Image, ActivityIndicator, View } from 'react-native';
import AppBar from '../components/AppBar';

const API_KEY = 'd52c3eea36cf43d8bee0b4c152e4706e';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
      );
      const json = await res.json();
      setRecipe(json);
    };

    if (id) fetchDetails();
  }, [id]);

  if (!recipe) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <AppBar title={recipe.title} showBackButton />
      <ScrollView style={{ padding: 16 }}>
        <Image source={{ uri: recipe.image }} style={{ width: '100%', height: 200 }} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 12 }}>
          {recipe.title}
        </Text>
        <Text>{recipe.summary.replace(/<[^>]+>/g, '')}</Text>
      </ScrollView>
    </View>
  );
}