import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { COLORS } from '../../constants/Colors';

type Props = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

const CategorySelector: React.FC<Props> = ({
  categories,
  selected,
  onSelect,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.wrapper]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.button,
              {
                backgroundColor:
                  selected === cat
                    ? COLORS[theme].primary
                    : COLORS[theme].cardBackground,
              },
            ]}
            onPress={() => onSelect(cat)}
          >
            <Text
              style={{
                color:
                  selected === cat
                    ? COLORS[theme].white
                    : COLORS[theme].text,
                fontWeight: selected === cat ? 'bold' : 'normal',
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
});

export default CategorySelector;