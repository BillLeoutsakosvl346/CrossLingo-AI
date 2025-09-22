import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom header component for Duolingo-style stats
function CustomTabBarHeader() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: theme.background }]}>
      <View style={[styles.headerContent, { backgroundColor: theme.background }]}>
        {/* Streak and Level in a row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialIcons name="local-fire-department" size={20} color={theme.accent} />
            <Text style={[styles.statNumber, { color: theme.accent }]}>0</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="emoji-events" size={20} color={theme.primary} />
            <Text style={[styles.statNumber, { color: theme.primary }]}>12 XP</Text>
          </View>
        </View>

        {/* Settings button */}
        <Pressable
          style={({ pressed }) => [
            styles.settingsButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={() => router.push('/(drawer)/settings')}
        >
          <FontAwesome name="user-circle" size={28} color={theme.primary} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <CustomTabBarHeader />
      <Tabs
        // RN v7 uses `sceneStyle` (not `sceneContainerStyle`)
        sceneStyle={{ backgroundColor: theme.background }}
        
        screenOptions={{
          headerShown: false,
          // Let React Navigation handle safe area automatically
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            height: 60 + insets.bottom,  // Tab height + safe area bottom
            paddingTop: 8,
            paddingBottom: insets.bottom, // Push above system nav bar
          },
          
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIconStyle: styles.tabIcon,
        }}
      >
        <Tabs.Screen 
          name="practice" 
          options={{
            title: 'Learn',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="school" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="chat" 
          options={{
            title: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="comments" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="vocabulary" 
          options={{
            title: 'Vocabulary',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="book" size={size} color={color} />
            ),
          }} 
        />
        
        {/* Settings screens - hidden from tab bar */}
        <Tabs.Screen 
          name="settings/index" 
          options={{ 
            title: 'Profile',
            href: null, // Hide from tab bar
          }} 
        />
        <Tabs.Screen 
          name="settings/manage-chats" 
          options={{ 
            title: 'Manage Chats',
            href: null, // Hide from tab bar
          }} 
        />
        <Tabs.Screen 
          name="settings/customize-teacher" 
          options={{ 
            title: 'Customize Teacher',
            href: null, // Hide from tab bar
          }} 
        />
        <Tabs.Screen 
          name="settings/start-over" 
          options={{ 
            title: 'Start Over',
            href: null, // Hide from tab bar
          }} 
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingsButton: {
    padding: 4,
  },
  tabBar: {
    // All positioning and padding now handled dynamically in screenOptions
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tabIcon: {
    marginBottom: 2,
  },
});
