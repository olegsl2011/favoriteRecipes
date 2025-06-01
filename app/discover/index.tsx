import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,  
  BackHandler,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AppBar from '../components/AppBar';

const API_KEY = 'd52c3eea36cf43d8bee0b4c152e4706e';

export default function DiscoverScreen() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const goBackSafe = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/tabs/home');
    }
  };
  useEffect(() => {
    const onBackPress = () => {
      goBackSafe();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`
        );
        const json = await res.json();
        setRecipes(json.recipes);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="🔍 Відкрий нові рецепти" showBackButton/>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/discover/${item.id}`)
            }
          >
            <View
              style={{
                marginBottom: 16,
                backgroundColor: '#fff',
                borderRadius: 8,
                overflow: 'hidden',
                elevation: 3,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: 180 }}
                resizeMode="cover"
              />
              <Text style={{ padding: 12, fontSize: 16, fontWeight: 'bold' }}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}