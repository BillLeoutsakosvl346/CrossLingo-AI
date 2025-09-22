import { Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false 
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, { backgroundColor: theme.primary }];
      case 'secondary':
        return [...baseStyle, { backgroundColor: theme.secondary }];
      case 'outline':
        return [...baseStyle, { 
          backgroundColor: 'transparent', 
          borderWidth: 1, 
          borderColor: theme.border 
        }];
      case 'danger':
        return [...baseStyle, { backgroundColor: '#ff4444' }];
      default:
        return [...baseStyle, { backgroundColor: theme.primary }];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'outline') {
      return [...baseStyle, { color: theme.text }];
    }
    return [...baseStyle, { color: theme.background }];
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...getButtonStyle(),
        { opacity: pressed || disabled ? 0.7 : 1 }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});
