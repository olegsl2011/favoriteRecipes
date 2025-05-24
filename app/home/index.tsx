import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Recipe } from '../../src/types';

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
    <View style={styles.container}>
      {/* 🔝 AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>🍳 Мої рецепти</Text>
      </View>

      {/* 🔍 Пошук */}
      <TextInput
        placeholder="🔍 Пошук рецепту..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {/* 📂 Категорії */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categorySelected,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={
                  category === cat
                    ? styles.categoryTextSelected
                    : styles.categoryText
                }
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 📃 Рецепти або порожній стан */}
      {filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>🍽️ Немає рецептів</Text>
          <Text style={styles.emptySub}>
            Натисни + щоб додати перший рецепт
          </Text>
        </View>
      ) : (
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
          columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : undefined}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.recipeCard, { width: cardWidth, marginBottom: 12 }]}
              onPress={() =>
                router.push({ pathname: '/recipe', params: { id: item.id } })
              }
            >
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.recipeText}>{item.ingredients}</Text>
              <Text style={styles.recipeCategory}>📂 {item.category}</Text>
              {item.media?.endsWith('.mp4') ? (
                <Text>🎥 Відео: {item.media.split('/').pop()}</Text>
              ) : item.media ? (
                <Image
                  source={{ uri: item.media }}
                  style={{
                    width: '100%',
                    height: 180,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                />
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}

      {/* ➕ FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/recipe')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // 🔝 AppBar
  appBar: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ff7043',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    margin: 20,
    marginBottom: 10,
  },

  categoriesWrapper: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  categories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  categorySelected: {
    backgroundColor: '#ff7043',
  },
  categoryText: {
    color: '#333',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },

  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: '#777',
  },

  recipeCard: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 8,
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  recipeText: {
    fontSize: 14,
    color: '#555',
  },
  recipeCategory: {
    fontStyle: 'italic',
    fontSize: 12,
    marginTop: 4,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#ff7043',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});