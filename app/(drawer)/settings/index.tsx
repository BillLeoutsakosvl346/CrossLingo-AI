import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const SettingsOption = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => (
    <Pressable
      style={({ pressed }) => [
        styles.option,
        { backgroundColor: theme.background, opacity: pressed ? 0.7 : 1 }
      ]}
      onPress={onPress}
    >
      <FontAwesome name={icon as any} size={20} color={theme.text} style={styles.optionIcon} />
      <Text style={[styles.optionText, { color: theme.text }]}>{title}</Text>
      <FontAwesome name="chevron-right" size={16} color={theme.text} style={styles.chevron} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      
      <View style={styles.optionsContainer}>
        <SettingsOption
          title="Manage Chats"
          icon="comments"
          onPress={() => router.push('/(drawer)/settings/manage-chats')}
        />
        <SettingsOption
          title="Customize Teacher"
          icon="user-circle"
          onPress={() => router.push('/(drawer)/settings/customize-teacher')}
        />
        <SettingsOption
          title="Start Over"
          icon="refresh"
          onPress={() => router.push('/(drawer)/settings/start-over')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    opacity: 0.5,
  },
});
