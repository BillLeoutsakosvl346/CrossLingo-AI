import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, Platform, KeyboardAvoidingView, Keyboard, ActivityIndicator, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InteractiveText from '../../components/ui/InteractiveText';
import { useChat } from '../../src/lib/hooks';
import { Message } from '../../src/types';

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const { messages, isLoading, sendMessage: sendChatMessage, addMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to bottom when keyboard appears
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const sendMessage = async () => {
    const txt = inputText.trim();
    if (!txt || isLoading) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: txt,
      timestamp: new Date(),
      isUser: true,
      status: 'sent'
    };

    // Add user message and clear input
    addMessage(userMessage);
    setInputText('');
    setIsTyping(true);

    // Scroll to bottom after sending message
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // Send message using the new hook
      const response = await sendChatMessage(txt);
      
      // Create AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.error || response.message,
        timestamp: new Date(),
        isUser: false,
        status: response.error ? 'failed' : 'sent',
        isError: !!response.error
      };
      
      addMessage(aiMessage);
    } catch (error) {
      // Handle unexpected errors
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
        isUser: false,
        status: 'failed',
        isError: true
      };
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
      // Scroll to bottom after AI response
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <View style={[
      styles.messageBubbleContainer,
      message.isUser ? styles.userContainer : styles.aiContainer
    ]}>
      {/* AI Badge */}
      {!message.isUser && !message.isError && (
        <View style={[styles.aiBadge, { backgroundColor: theme.primary + '20' }]}>
          <MaterialIcons name="smart-toy" size={12} color={theme.primary} />
          <Text style={[styles.badgeText, { color: theme.primary }]}>AI</Text>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble,
        {
          backgroundColor: message.isError 
            ? '#ffebee' 
            : message.isUser 
              ? theme.primary 
              : theme.background,
          borderColor: message.isError 
            ? '#f44336' 
            : message.isUser 
              ? 'transparent'
              : theme.border,
          borderWidth: message.isUser ? 0 : 1,
          shadowColor: message.isUser ? theme.primary : '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: message.isUser ? 0.3 : 0.1,
          shadowRadius: 2,
          elevation: message.isUser ? 3 : 1,
        }
      ]}>
        {message.isUser || message.isError ? (
          <Text style={[
            styles.messageText, 
            { 
              color: message.isError 
                ? '#c62828' 
                : theme.background 
            }
          ]}>
            {message.text}
          </Text>
        ) : (
          <InteractiveText
            text={message.text}
            style={[styles.messageText, { color: theme.text }]}
            isUserMessage={false}
            messageId={message.id}
          />
        )}
        
        {message.isError && (
          <View style={styles.errorIndicator}>
            <MaterialIcons 
              name="error-outline" 
              size={16} 
              color="#c62828" 
            />
          </View>
        )}
      </View>
    </View>
  );

  const AnimatedDots = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animateDot = (dot: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: -8,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const animation = Animated.parallel([
        animateDot(dot1, 0),
        animateDot(dot2, 150),
        animateDot(dot3, 300),
      ]);

      animation.start();

      return () => animation.stop();
    }, []);

    return (
      <View style={styles.dotsContainer}>
        {[dot1, dot2, dot3].map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: theme.neutral,
                transform: [{ translateY: dot }],
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const TypingIndicator = () => (
    <View style={[styles.messageBubbleContainer, styles.aiContainer]}>
      <View style={[styles.aiBadge, { backgroundColor: theme.primary + '20' }]}>
        <MaterialIcons name="smart-toy" size={12} color={theme.primary} />
        <Text style={[styles.badgeText, { color: theme.primary }]}>AI</Text>
      </View>
      
      <View style={[
        styles.messageBubble,
        styles.aiBubble,
        {
          backgroundColor: theme.background,
          borderColor: theme.border,
          borderWidth: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        }
      ]}>
        <AnimatedDots />
      </View>
    </View>
  );

  return (
    <View style={[{ flex: 1 }, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: 20 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(m => <MessageBubble key={m.id} message={m} />)}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input Footer */}
        <View style={[styles.inputContainer, {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          paddingTop: 8, // Very narrow equal spacing
          paddingBottom: 8, // Restore original narrow spacing
          marginBottom: keyboardHeight > 0 ? Math.min(keyboardHeight * 0.25, 80) : 0, // Move up a bit more when keyboard appears
        }]}>
          <View style={[styles.inputWrapper, { 
            borderColor: theme.border,
            backgroundColor: theme.surface,
          }]}>
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholder={isLoading ? "Waiting for response..." : "Chat with your teacher..."}
              placeholderTextColor={theme.neutral}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
              editable={!isLoading}
            />
            <Pressable
              style={[
                styles.sendButton, 
                { 
                  backgroundColor: inputText.trim() && !isLoading ? theme.primary : theme.neutral,
                  opacity: isLoading ? 0.6 : 1,
                }
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.background} />
              ) : (
                <Ionicons name="arrow-up" size={24} color={theme.background} />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  messagesContainer: { flex: 1 },
  messagesContent: { paddingHorizontal: 16, paddingTop: 16 },
  messageBubbleContainer: {
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userContainer: {
    alignItems: 'flex-end',
    marginLeft: '20%',
  },
  aiContainer: {
    alignItems: 'flex-start',
    marginRight: '20%',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  messageBubble: {
    maxWidth: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: { 
    borderBottomRightRadius: 6,
    alignSelf: 'flex-end',
  },
  aiBubble: { 
    borderBottomLeftRadius: 6,
    alignSelf: 'flex-start',
  },
  messageText: { 
    fontSize: 16, 
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  errorIndicator: {
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 56,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendButton: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 16, marginRight: 0,
  },
});
