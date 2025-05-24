import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
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
  return (
    <View style={styles.wrapper}>
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
              selected === cat && styles.selectedButton,
            ]}
            onPress={() => onSelect(cat)}
          >
            <Text
              style={
                selected === cat ? styles.selectedText : styles.text
              }
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
    backgroundColor: '#eee',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.text,
  },
  selectedText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default CategorySelector;