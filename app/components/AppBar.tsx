import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/Colors';
import { SPACING } from '../../constants/spacing';

type AppBarProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

const AppBar: React.FC<AppBarProps> = ({ title, showBackButton = false, onBackPress }) => {
  const router = useRouter();

  return (
    <View style={styles.appBar}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress || (() => {
          if (router.canGoBack?.()) {
            router.back();
          } else {
            router.replace('/tabs/home');
          }
        })}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.appBarTitle}>{title}</Text>
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
    backgroundColor: COLORS.primary,
  },
  appBarTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: SPACING.small,
  },
  backText: {
    fontSize: 20,
    color: COLORS.white,
  },
});

export default AppBar;
