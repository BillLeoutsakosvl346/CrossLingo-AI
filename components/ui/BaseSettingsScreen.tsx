import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import ScreenContainer from './ScreenContainer';
import Button from './Button';
import { router } from 'expo-router';

interface BaseSettingsScreenProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export default function BaseSettingsScreen({ 
  title, 
  description, 
  children,
  showBackButton = true 
}: BaseSettingsScreenProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.description, { color: theme.neutral }]}>
          {description}
        </Text>
      </View>
      
      <View style={styles.content}>
        {children}
      </View>

      {showBackButton && (
        <View style={styles.footer}>
          <Button
            title="Back to Settings"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  footer: {
    marginTop: 32,
    backgroundColor: 'transparent',
  },
});
