import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { COLORS } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing';
import { Recipe } from '../../src/types';
import AppBar from '../components/AppBar';

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
      <AppBar title={isEditing ? 'Редагувати рецепт' : 'Новий рецепт'} showBackButton />

      <ScrollView
        contentContainerStyle={{ padding: SPACING.large, paddingBottom: 100 }}
      >
        <TextInput
          placeholder="Назва рецепту"
          value={title}
          onChangeText={setTitle}
          style={inputStyle}
        />
        <TextInput
          placeholder="Інгредієнти"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          style={inputStyle}
        />
        <TextInput
          placeholder="Інструкція"
          value={description}
          onChangeText={setDescription}
          multiline
          style={inputStyle}
        />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.medium }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={{
                backgroundColor: category === cat ? COLORS.primary : '#eee',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 20,
                marginRight: 10,
                marginBottom: 6,
              }}
              onPress={() => setCategory(cat)}
            >
              <Text style={{ color: category === cat ? COLORS.white : COLORS.text }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={pickMedia}
          style={{
            backgroundColor: '#ccc',
            padding: SPACING.medium,
            borderRadius: 5,
            alignItems: 'center',
            marginBottom: SPACING.medium,
          }}
        >
          <Text style={{ fontWeight: 'bold', color: COLORS.text }}>
            📷 Додати медіа
          </Text>
        </TouchableOpacity>

        {mediaUri ? (
          mediaUri.endsWith('.mp4') ? (
            <Text style={{ marginBottom: SPACING.medium }}>
              🎥 Відео: {mediaUri.split('/').pop()}
            </Text>
          ) : (
            <Image
              source={{ uri: mediaUri }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 8,
                marginBottom: SPACING.medium,
              }}
            />
          )
        ) : null}

        <Button
          title={isEditing ? 'Оновити рецепт' : 'Зберегти рецепт'}
          onPress={saveRecipe}
        />

        {isEditing && (
          <View style={{ marginTop: SPACING.large }}>
            <Button
              title="Видалити рецепт"
              color={COLORS.danger}
              onPress={deleteRecipe}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: COLORS.inputBorder,
  padding: SPACING.medium,
  borderRadius: 5,
  marginBottom: SPACING.medium,
  textAlignVertical: 'top' as const,
};