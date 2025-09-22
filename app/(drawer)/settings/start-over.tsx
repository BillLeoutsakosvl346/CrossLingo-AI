import { StyleSheet, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import BaseSettingsScreen from '@/components/ui/BaseSettingsScreen';
import Button from '@/components/ui/Button';

export default function StartOverScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleReset = () => {
    Alert.alert(
      'Reset Everything?',
      'This action cannot be undone. All your progress will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement reset functionality
            Alert.alert('Reset Complete', 'Your progress has been reset.');
          }
        }
      ]
    );
  };

  return (
    <BaseSettingsScreen
      title="Start Over"
      description="Reset your progress and start fresh."
    >
      <View style={styles.content}>
        <Text style={[styles.warningText, { color: theme.neutral }]}>
          This will:{'\n'}
          • Clear all conversation history{'\n'}
          • Reset your learning progress{'\n'}
          • Remove saved vocabulary{'\n'}
          • Restore default settings
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Reset Everything"
            variant="danger"
            onPress={handleReset}
          />
        </View>
      </View>
    </BaseSettingsScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  warningText: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
