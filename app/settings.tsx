import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleClose = () => {
    router.back();
  };

  const SettingsButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.tint, opacity: pressed ? 0.7 : 1 }
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: '#fff' }]}>{title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.buttonsContainer}>
        <SettingsButton 
          title="Manage Chats" 
          onPress={() => {/* TODO: Implement */}} 
        />
        <SettingsButton 
          title="Customize Teacher" 
          onPress={() => {/* TODO: Implement */}} 
        />
        <SettingsButton 
          title="Start Over" 
          onPress={() => {/* TODO: Implement */}} 
        />
      </View>

      <View style={styles.closeContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.closeButton,
            { borderColor: theme.text, opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={handleClose}
        >
          <Text style={[styles.closeButtonText, { color: theme.text }]}>Close</Text>
        </Pressable>
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeContainer: {
    paddingTop: 20,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
