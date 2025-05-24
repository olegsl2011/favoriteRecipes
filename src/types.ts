export type Recipe = {
    id: string;
    title: string;
    ingredients: string;
    description: string;
    media?: string;
    category: string;
  };

export type RootStackParamList = {
    Welcome: undefined;
    Home: undefined;
    EditRecipe?: { recipe?: Recipe }; // параметри можуть бути undefined
  };  