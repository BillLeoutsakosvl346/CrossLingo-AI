import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
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

  const sendMessage = () => {
    const txt = inputText.trim();
    if (!txt) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: txt,
      timestamp: new Date(),
      isUser: true,
    }]);
    setInputText('');
    // Scroll to bottom after sending message
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <View style={[
      styles.messageBubble,
      message.isUser ? styles.userBubble : styles.aiBubble,
      {
        backgroundColor: message.isUser ? theme.primary : theme.surfaceVariant,
        borderColor: theme.secondary,
        borderWidth: message.isUser ? 0 : 1,
      }
    ]}>
      <Text style={[styles.messageText, { color: message.isUser ? theme.background : theme.text }]}>
        {message.text}
      </Text>
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
              placeholder="Chat with your teacher..."
              placeholderTextColor={theme.neutral}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <Pressable
              style={[
                styles.sendButton, 
                { 
                  backgroundColor: inputText.trim() ? theme.primary : theme.neutral,
                }
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons name="arrow-up" size={24} color={theme.background} />
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
  messageBubble: {
    maxWidth: '75%',
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    alignSelf: 'flex-end',
  },
  userBubble: { 
    borderBottomRightRadius: 4,
    marginLeft: '25%',
  },
  aiBubble: { 
    alignSelf: 'flex-start', 
    borderBottomLeftRadius: 4,
    marginRight: '25%',
  },
  messageText: { 
    fontSize: 16, 
    lineHeight: 20,
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
