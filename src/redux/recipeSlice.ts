// src/redux/slices/recipeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../types';

type RecipeState = {
  items: Recipe[];
};

const initialState: RecipeState = {
  items: [],
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipes(state, action: PayloadAction<Recipe[]>) {
      state.items = action.payload;
    },
    addRecipe(state, action: PayloadAction<Recipe>) {
      state.items.push(action.payload);
    },
    updateRecipe(state, action: PayloadAction<Recipe>) {
      const index = state.items.findIndex(r => r.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteRecipe(state, action: PayloadAction<string>) {
      state.items = state.items.filter(r => r.id !== action.payload);
    },
  },
});

export const { setRecipes, addRecipe, updateRecipe, deleteRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;