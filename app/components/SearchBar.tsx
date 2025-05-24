import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing';

type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = '🔍 Пошук...',
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      style={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: SPACING.medium,
    borderRadius: 8,
    marginHorizontal: SPACING.large,
    marginBottom: SPACING.medium,
  },
});

export default SearchBar;