import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  useWindowDimensions,
} from 'react-native';

import { Recipe } from '../../src/types';
import AppBar from '../components/AppBar';
import CategorySelector from '../components/CategorySelector';
import FloatingButton from '../components/FloatingButton';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';

const CATEGORIES = ['Усі', 'Сніданки', 'Обіди', 'Вечері', 'Десерти'];

export default function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Усі');

  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const numColumns = isPortrait ? 1 : 2;
  const cardMargin = 12;
  const cardWidth = width / numColumns - cardMargin * 2;

  const loadRecipes = async () => {
    try {
      const stored = await AsyncStorage.getItem('recipes');
      const parsed: Recipe[] = stored ? JSON.parse(stored) : [];
      setRecipes(parsed);
      filterRecipes(parsed, search, category);
    } catch (e) {
      console.error('Error loading recipes', e);
    }
  };

  const filterRecipes = (all: Recipe[], searchText: string, cat: string) => {
    let result = all;
    if (cat !== 'Усі') {
      result = result.filter((r) => r.category === cat);
    }
    if (searchText) {
      result = result.filter((r) =>
        r.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFiltered(result);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadRecipes();
    }, [])
  );

  useEffect(() => {
    filterRecipes(recipes, search, category);
  }, [search, category]);

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="🍳 Мої рецепти" />
      <SearchBar value={search} onChange={setSearch} />
      <CategorySelector
        categories={CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadRecipes} />
        }
        numColumns={numColumns}
        contentContainerStyle={{
          paddingBottom: 100,
          alignItems: numColumns === 1 ? 'center' : undefined,
        }}
        columnWrapperStyle={
          numColumns > 1 ? { justifyContent: 'space-between' } : undefined
        }
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            width={cardWidth}
            onPress={() =>
              router.push({ pathname: '/recipe', params: { id: item.id } })
            }
          />
        )}
      />

      <FloatingButton onPress={() => router.push('/recipe')} />
    </View>
  );
}