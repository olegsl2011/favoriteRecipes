import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Recipe } from '../../src/types';

const CATEGORIES = ['Сніданки', 'Обіди', 'Вечері', 'Десерти'];

export default function RecipeEditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUri, setMediaUri] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isEditing, setIsEditing] = useState(false);

  const { width } = useWindowDimensions();

  useEffect(() => {
    if (id) {
      loadRecipe(id);
      setIsEditing(true);
    }
  }, [id]);

  const loadRecipe = async (id: string) => {
    const stored = await AsyncStorage.getItem('recipes');
    const recipes: Recipe[] = stored ? JSON.parse(stored) : [];
    const recipe = recipes.find((r) => r.id === id);
    if (recipe) {
      setTitle(recipe.title);
      setIngredients(recipe.ingredients);
      setDescription(recipe.description);
      setMediaUri(recipe.media || '');
      setCategory(recipe.category);
    }
  };

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const saveRecipe = async () => {
    try {
      const stored = await AsyncStorage.getItem('recipes');
      const recipes: Recipe[] = stored ? JSON.parse(stored) : [];

      const newRecipe: Recipe = {
        id: id || Date.now().toString(),
        title,
        ingredients,
        description,
        media: mediaUri,
        category,
      };

      const updated = id
        ? recipes.map((r) => (r.id === id ? newRecipe : r))
        : [...recipes, newRecipe];

      await AsyncStorage.setItem('recipes', JSON.stringify(updated));
      router.back();
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося зберегти рецепт');
    }
  };

  const deleteRecipe = async () => {
    if (!id) return;

    try {
      const stored = await AsyncStorage.getItem('recipes');
      const recipes: Recipe[] = stored ? JSON.parse(stored) : [];

      const filtered = recipes.filter((r) => r.id !== id);
      await AsyncStorage.setItem('recipes', JSON.stringify(filtered));
      router.back();
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося видалити рецепт');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔝 AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>
          {isEditing ? 'Редагувати рецепт' : 'Новий рецепт'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: width * 0.05 },
        ]}
      >
        <TextInput
          placeholder="Назва рецепту"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Інгредієнти"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          style={styles.input}
        />
        <TextInput
          placeholder="Інструкція"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
        />

        <View style={styles.categoryWrap}>
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
        </View>

        <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
          <Text style={styles.mediaButtonText}>📷 Додати медіа</Text>
        </TouchableOpacity>

        {mediaUri ? (
          mediaUri.endsWith('.mp4') ? (
            <Text style={{ marginTop: 10 }}>
              🎥 Відео: {mediaUri.split('/').pop()}
            </Text>
          ) : (
            <Image source={{ uri: mediaUri }} style={styles.mediaPreview} />
          )
        ) : null}

        <Button
          title={isEditing ? 'Оновити рецепт' : 'Зберегти рецепт'}
          onPress={saveRecipe}
        />

        {isEditing && (
          <View style={{ marginTop: 20 }}>
            <Button title="Видалити рецепт" color="red" onPress={deleteRecipe} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ff7043',
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    padding: 6,
  },
  backText: {
    color: '#fff',
    fontSize: 20,
  },
  container: {
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 6,
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
  mediaButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  mediaButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});