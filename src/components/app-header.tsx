import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from './themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface AppHeaderProps {
  showProfile?: boolean;
}

export function AppHeader({ showProfile = false }: AppHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.two }]}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <TouchableOpacity>
          <Menu size={24} color="#F0FDF4" />
        </TouchableOpacity>
        
        <ThemedText style={styles.title}>Kaam Karo</ThemedText>
        
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.urduButton}>
            <ThemedText style={styles.urduText}>اردو</ThemedText>
          </TouchableOpacity>
          
          {showProfile && (
            <Image 
              source={require('../../assets/images/user_profile.png')} 
              style={styles.profilePic} 
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    backgroundColor: '#075E54', // Dark Secondary Color
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1DB954', // Primary Green
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  urduButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  urduText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0FDF4', // Light Text
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
});
