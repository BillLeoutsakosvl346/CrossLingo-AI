import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const scrollViewRef = useRef<ScrollView>(null);

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
        backgroundColor: message.isUser ? theme.text : 'transparent',
        borderColor: theme.text,
        borderWidth: message.isUser ? 0 : 1,
      }
    ]}>
      <Text style={[styles.messageText, { color: message.isUser ? theme.background : theme.text }]}>
        {message.text}
      </Text>
      <Text style={[styles.timestamp, { color: (message.isUser ? theme.background : theme.text) + '80' }]}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
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
          borderTopColor: 'rgba(255,255,255,0.1)',
          paddingBottom: insets.bottom || 8,
        }]}>
          <View style={[styles.inputWrapper, { borderColor: theme.text }]}>
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholder="Type a message..."
              placeholderTextColor={theme.text + '60'}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
              onFocus={() => setTimeout(
                () => scrollViewRef.current?.scrollToEnd({ animated: true }), 300
              )}
            />
            <Pressable
              style={[styles.sendButton, { backgroundColor: theme.text }]}
              onPress={sendMessage}
              disabled={inputText.trim() === ''}
            >
              <Ionicons name="arrow-up" size={24} color={theme.background} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16 },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 100,
    alignSelf: 'flex-end',
  },
  userBubble: { borderBottomRightRadius: 8 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 8 },
  messageText: { fontSize: 16, lineHeight: 20, marginBottom: 4 },
  timestamp: { fontSize: 12, alignSelf: 'flex-end' },
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
