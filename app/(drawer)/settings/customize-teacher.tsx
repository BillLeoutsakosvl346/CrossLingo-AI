import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import BaseSettingsScreen from '@/components/ui/BaseSettingsScreen';

export default function CustomizeTeacherScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <BaseSettingsScreen
      title="Customize Teacher"
      description="Personalize your AI learning companion to match your preferences."
    >
      <View style={styles.features}>
        <Text style={[styles.featureText, { color: theme.neutral }]}>
          • Change AI personality{'\n'}
          • Adjust teaching style{'\n'}
          • Set difficulty level{'\n'}
          • Choose conversation topics
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
