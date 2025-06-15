import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing';
import { Recipe } from '../../src/types';

type Props = {
  recipe: Recipe;
  onPress: () => void;
  width: number;
};

const RecipeCard: React.FC<Props> = ({ recipe, onPress, width }) => {
  return (
    <TouchableOpacity style={[styles.card, { width }]} onPress={onPress}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.ingredients}>{recipe.ingredients}</Text>
      <Text style={styles.category}>📂 {recipe.category}</Text>

      {recipe.media?.endsWith('.mp4') ? (
        <Text>🎥 Відео: {recipe.media.split('/').pop()}</Text>
      ) : recipe.media ? (
        <Image source={{ uri: recipe.media }} style={styles.image} />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.medium,
    borderRadius: 8,
    marginBottom: SPACING.medium,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  ingredients: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  category: {
    fontStyle: 'italic',
    fontSize: 12,
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: 180,
    marginTop: SPACING.small,
    borderRadius: 8,
  },
});

export default React.memo(RecipeCard);