import { ScrollView, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export default function ScreenContainer({ 
  children, 
  scrollable = false
}: ScreenContainerProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.background }
  ];

  const contentStyle = styles.content;

  if (scrollable) {
    return (
      <View style={containerStyle}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[containerStyle, contentStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});
