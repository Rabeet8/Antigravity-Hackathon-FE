import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LucideIcon } from 'lucide-react-native';

interface ServiceCardProps {
  title: string;
  Icon: LucideIcon;
  onPress?: () => void;
}

export function ServiceCard({ title, Icon, onPress }: ServiceCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.backgroundElement }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.backgroundSelected }]}>
        <Icon size={32} color={theme.primary} />
      </View>
      <ThemedText type="small" style={styles.title}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
