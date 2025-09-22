import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ScreenContainer from '@/components/ui/ScreenContainer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface LessonCardProps {
  title: string;
  progress: number;
  icon: string;
  color: string;
}

export default function PracticeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const LessonCard = ({ title, progress, icon, color }: LessonCardProps) => (
    <Card onPress={() => console.log(`Starting ${title}`)}>
      <View style={styles.lessonContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <MaterialIcons name={icon as any} size={32} color={color} />
        </View>
        <View style={styles.lessonInfo}>
          <Text style={[styles.lessonTitle, { color: theme.text }]}>{title}</Text>
          <View style={[styles.progressBar, { backgroundColor: theme.surfaceVariant }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: color,
                  width: `${progress}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.neutral }]}>
            {progress}% complete
          </Text>
        </View>
        <FontAwesome name="chevron-right" size={16} color={theme.neutral} />
      </View>
    </Card>
  );

  return (
    <ScreenContainer scrollable hasTabBar>
      <Text style={[styles.greeting, { color: theme.text }]}>
        Ready to learn?
      </Text>
      
      <View style={styles.lessonsSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Continue Learning
        </Text>
        
        <View style={styles.lessonsContainer}>
          <LessonCard 
            title="Basic Phrases"
            progress={60}
            icon="chat-bubble"
            color={theme.primary}
          />
          
          <LessonCard 
            title="Common Words"
            progress={30}
            icon="menu-book"
            color={theme.secondary}
          />
          
          <LessonCard 
            title="Grammar Basics"
            progress={15}
            icon="school"
            color={theme.accent}
          />
        </View>
      </View>

      <Button
        title="Start Practice"
        size="large"
        onPress={() => console.log('Starting practice')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  lessonsSection: {
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  lessonsContainer: {
    gap: 24, // Increased spacing between lesson cards
    backgroundColor: 'transparent',
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
