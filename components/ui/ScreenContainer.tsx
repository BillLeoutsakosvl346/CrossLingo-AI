import { ScrollView, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  hasTabBar?: boolean;
}

export default function ScreenContainer({ 
  children, 
  scrollable = false,
  hasTabBar = false
}: ScreenContainerProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.background }
  ];

  const contentStyle = [
    styles.content,
    hasTabBar && { paddingBottom: (60 + insets.bottom) + 20 }
  ];

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
