import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ScreenContainer from '@/components/ui/ScreenContainer';
import Card from '@/components/ui/Card';
import UserStatsService from '../../../services/userStats';

interface SettingsOptionProps {
  title: string;
  icon: string;
  onPress: () => void;
  iconType?: 'FontAwesome' | 'MaterialIcons';
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [stats, setStats] = useState({ streak: 0, xp: 0, level: 0 });
  const userStatsService = UserStatsService.getInstance();

  // Load stats
  useEffect(() => {
    const loadStats = () => {
      const currentStats = userStatsService.getStats();
      setStats(currentStats);
    };

    loadStats();
    const interval = setInterval(loadStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const SettingsOption = ({ title, icon, onPress, iconType = 'FontAwesome' }: SettingsOptionProps) => (
    <Card onPress={onPress}>
      <View style={styles.optionContent}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          {iconType === 'MaterialIcons' ? (
            <MaterialIcons name={icon as any} size={24} color={theme.primary} />
          ) : (
            <FontAwesome name={icon as any} size={20} color={theme.primary} />
          )}
        </View>
        <Text style={[styles.optionText, { color: theme.text }]}>{title}</Text>
        <FontAwesome name="chevron-right" size={16} color={theme.neutral} />
      </View>
    </Card>
  );

  const StatCard = ({ icon, value, label, color }: {
    icon: string;
    value: string | number;
    label: string;
    color: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.statContent}>
        <MaterialIcons name={icon as any} size={28} color={color} />
        <Text style={[styles.statNumber, { color: theme.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: theme.neutral }]}>{label}</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <MaterialIcons name="person" size={80} color={theme.primary} />
        <Text style={[styles.title, { color: theme.text }]}>Profile & Settings</Text>
        <Text style={[styles.subtitle, { color: theme.neutral }]}>
          Manage your learning experience
        </Text>
      </View>
      
      <View style={styles.statsSection}>
        <StatCard icon="local-fire-department" value={stats.streak} label="Day Streak" color={theme.accent} />
        <StatCard icon="emoji-events" value={stats.xp} label="Total XP" color={theme.primary} />
        <StatCard icon="trending-up" value={stats.level} label="Level" color={theme.secondary} />
      </View>
      
      <View style={styles.optionsContainer}>
        <SettingsOption
          title="Manage Chats"
          icon="chat"
          iconType="MaterialIcons"
          onPress={() => router.push('/(drawer)/settings/manage-chats')}
        />
        <SettingsOption
          title="Customize Teacher"
          icon="person-outline"
          iconType="MaterialIcons"
          onPress={() => router.push('/(drawer)/settings/customize-teacher')}
        />
        <SettingsOption
          title="Start Over"
          icon="refresh"
          iconType="MaterialIcons"
          onPress={() => router.push('/(drawer)/settings/start-over')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 70,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    backgroundColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});
