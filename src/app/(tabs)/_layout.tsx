import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Calendar, Settings as SettingsIcon } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  // Safe padding calculation for systems with software navigation buttons
  const bottomInset = insets.bottom || 12;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1DB954', // Primary Green
        tabBarInactiveTintColor: '#99F6E4', // Light Teal/Green
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 56 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 12,
          backgroundColor: '#075E54', // Dark Secondary Color
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
