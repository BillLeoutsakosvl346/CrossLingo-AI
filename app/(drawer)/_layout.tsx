import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

function CustomDrawerContent(props: any) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const recentWords = ['tu', 'un', 'y'];

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Streak Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Streak</Text>
          <Text style={styles.sectionValue}>0 days</Text>
        </View>

        {/* Level Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level</Text>
          <Text style={styles.sectionValue}>0</Text>
          <Text style={styles.progressText}>Progress to Level 1 — 12/50 XP</Text>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text style={styles.achievementText}>First 100 XP! (placeholder)</Text>
        </View>

        {/* Navigation Items */}
        <View style={styles.navSection}>
          <DrawerItem
            label="Chat"
            onPress={() => router.push('/(drawer)/chat')}
            icon={({ color }) => <FontAwesome name="comments" size={20} color={color} />}
            activeTintColor={theme.tint}
            inactiveTintColor={theme.text}
          />
          <DrawerItem
            label="Vocabulary"
            onPress={() => router.push('/(drawer)/vocabulary')}
            icon={({ color }) => <FontAwesome name="book" size={20} color={color} />}
            activeTintColor={theme.tint}
            inactiveTintColor={theme.text}
          />
          <DrawerItem
            label="Practice"
            onPress={() => router.push('/(drawer)/practice')}
            icon={({ color }) => <FontAwesome name="gamepad" size={20} color={color} />}
            activeTintColor={theme.tint}
            inactiveTintColor={theme.text}
          />
        </View>

        {/* Recent Words */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Words</Text>
          {recentWords.map((word, index) => (
            <Text key={index} style={styles.recentWord}>
              {word}
            </Text>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Sticky Footer wrapped in SafeAreaView */}
      <SafeAreaView edges={['bottom']}>
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.gearButton,
              { opacity: pressed ? 0.5 : 1 }
            ]}
            onPress={() => router.push('/(drawer)/settings')}
          >
            <FontAwesome name="cog" size={24} color={theme.text} />
            <Text style={[styles.gearText, { color: theme.text }]}>Settings</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function HeaderMenuButton() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuButton,
        { opacity: pressed ? 0.5 : 1 }
      ]}
      onPress={() => (navigation as any).openDrawer()}
    >
      <Ionicons name="menu" size={24} color={theme.text} />
    </Pressable>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerShown: true,
          drawerType: 'front',
          drawerStyle: { width: 300 },
          swipeEdgeWidth: 50,
          headerLeft: () => <HeaderMenuButton />,
        }}
      >
        <Drawer.Screen 
          name="chat" 
          options={{ title: 'Chat' }} 
        />
        <Drawer.Screen 
          name="vocabulary" 
          options={{ title: 'Vocabulary' }} 
        />
        <Drawer.Screen 
          name="practice" 
          options={{ title: 'Practice' }} 
        />
        <Drawer.Screen 
          name="settings/index" 
          options={{ 
            title: 'Settings',
            drawerItemStyle: { display: 'none' }
          }} 
        />
        <Drawer.Screen 
          name="settings/manage-chats" 
          options={{ 
            title: 'Manage Chats',
            drawerItemStyle: { display: 'none' }
          }} 
        />
        <Drawer.Screen 
          name="settings/customize-teacher" 
          options={{ 
            title: 'Customize Teacher',
            drawerItemStyle: { display: 'none' }
          }} 
        />
        <Drawer.Screen 
          name="settings/start-over" 
          options={{ 
            title: 'Start Over',
            drawerItemStyle: { display: 'none' }
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16, // Give space so last item isn't hidden behind footer
  },
  section: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    opacity: 0.7,
  },
  sectionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  achievementText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  navSection: {
    paddingVertical: 10,
    marginHorizontal: -20, // Compensate for scroll content padding so nav items touch edges
  },
  recentWord: {
    fontSize: 14,
    paddingVertical: 2,
    paddingLeft: 10,
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 12, // Fixed padding - SafeAreaView handles dynamic inset
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  gearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  gearText: {
    fontSize: 16,
    marginLeft: 15,
  },
  menuButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
