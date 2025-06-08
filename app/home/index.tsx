import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/redux/store';
import { setRecipes } from '../../src/redux/recipeSlice';
import AppBar from '../components/AppBar';
import { COLORS } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing';
import { Recipe } from '../../src/types';
import { useTheme } from '../../src/context/ThemeContext';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme } = useTheme();
  const recipes = useSelector((state: RootState) => state.recipes.items);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setRefreshing(true);
      const stored = await AsyncStorage.getItem('recipes');
      const parsed: Recipe[] = stored ? JSON.parse(stored) : [];
      dispatch(setRecipes(parsed));
    } catch (e) {
      console.error('Error loading recipes', e);
      Alert.alert('Помилка', 'Не вдалося завантажити рецепти');
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="🍽️ Мої рецепти" />

      <TextInput
        placeholder="Пошук..."
        value={search}
        onChangeText={setSearch}
        style={{
          margin: SPACING.medium,
          borderWidth: 1,
          borderColor: COLORS[theme].inputBorder,
          borderRadius: 8,
          padding: SPACING.medium,
          backgroundColor: COLORS[theme].cardBackground,
          color: COLORS[theme].text,
        }}
        placeholderTextColor={COLORS[theme].textMuted}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadRecipes} />}
        contentContainerStyle={{ padding: SPACING.medium }}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS[theme].textMuted }}>
            Рецепти не знайдено
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/recipe/${item.id}`)}
            style={{
              backgroundColor: COLORS[theme].cardBackground,
              marginBottom: SPACING.medium,
              borderRadius: 8,
              overflow: 'hidden',
              elevation: 2,
            }}
          >
            {item.media && (
              <Image
                source={{ uri: item.media }}
                style={{ width: '100%', height: 180 }}
                resizeMode="cover"
              />
            )}
            <Text style={{ padding: SPACING.medium, fontWeight: 'bold', color: COLORS[theme].text }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}