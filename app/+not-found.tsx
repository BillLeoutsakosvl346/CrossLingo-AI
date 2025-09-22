import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { router } from 'expo-router';
import ScreenContainer from '@/components/ui/ScreenContainer';
import Button from '@/components/ui/Button';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ScreenContainer>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Text style={styles.subtitle}>
          The page you're looking for cannot be found.
        </Text>
        
        <Button
          title="Go to home screen"
          onPress={() => router.replace('/(drawer)/practice')}
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
});
