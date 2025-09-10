import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

export default function CustomizeTeacherScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Customize Teacher</Text>
      
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: theme.text }]}>
          Teacher customization options will go here.
        </Text>
        <Text style={[styles.description, { color: theme.text, opacity: 0.7 }]}>
          • Change AI personality{'\n'}
          • Adjust teaching style{'\n'}
          • Set difficulty level{'\n'}
          • Choose conversation topics
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          { 
            borderColor: theme.text,
            opacity: pressed ? 0.7 : 1 
          }
        ]}
        onPress={() => router.back()}
      >
        <Text style={[styles.backButtonText, { color: theme.text }]}>Back to Settings</Text>
      </Pressable>
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
    marginBottom: 20,
  },
  content: {
    marginVertical: 40,
  },
  placeholder: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
