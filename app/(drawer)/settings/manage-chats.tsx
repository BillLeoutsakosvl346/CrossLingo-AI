import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import BaseSettingsScreen from '@/components/ui/BaseSettingsScreen';

export default function ManageChatsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <BaseSettingsScreen
      title="Manage Chats"
      description="Control your conversation history and chat preferences."
    >
      <View style={styles.features}>
        <Text style={[styles.featureText, { color: theme.neutral }]}>
          • Delete conversation history{'\n'}
          • Export chats{'\n'}
          • Archive old conversations
        </Text>
        
        <Text style={[styles.comingSoon, { color: theme.primary }]}>
          Coming Soon! 🚀
        </Text>
      </View>
    </BaseSettingsScreen>
  );
}

const styles = StyleSheet.create({
  features: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  featureText: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 24,
  },
  comingSoon: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
