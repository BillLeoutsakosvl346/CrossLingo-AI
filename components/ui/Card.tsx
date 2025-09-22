import { Pressable, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated';
}

export default function Card({ children, onPress, variant = 'default' }: CardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const cardStyle = [
    styles.card,
    { 
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },
    variant === 'elevated' && styles.elevated
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          ...cardStyle,
          { opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={onPress}
      >
        <View style={styles.content}>
          {children}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={cardStyle}>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
    backgroundColor: 'transparent',
  },
});
