import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing';
import { useTheme } from '../../src/context/ThemeContext';

type AppBarProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

const AppBar: React.FC<AppBarProps> = ({ title, showBackButton = false, onBackPress }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const currentColors = COLORS[theme];
  const backgroundColor = currentColors.appBarBackground;
  const textColor = currentColors.appBarText
  const iconColor = currentColors.appBarIcon;

  return (
    <View style={[styles.appBar, { backgroundColor }]}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress || (() => {
          if (router.canGoBack?.()) {
            router.back();
          } else {
            router.replace('/tabs/home');
          }
        })}>
          <Text style={[styles.backText, { color: iconColor }]}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.appBarTitle, { color: textColor }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.xlarge,
    paddingBottom: SPACING.medium,
    paddingHorizontal: SPACING.large,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: SPACING.small,
  },
  backText: {
    fontSize: 20,
  },
});

export default AppBar;