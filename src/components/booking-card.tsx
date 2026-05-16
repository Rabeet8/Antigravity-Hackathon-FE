import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LucideIcon, ChevronRight, Calendar, Clock, Banknote } from 'lucide-react-native';

interface BookingCardProps {
  service: string;
  provider: string;
  date: string;
  time?: string;
  amount?: string;
  status: 'Upcoming' | 'Completed';
  Icon: LucideIcon;
}

export function BookingCard({ service, provider, date, time, amount, status, Icon }: BookingCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.backgroundElement }]}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: status === 'Upcoming' ? '#E0F2FE' : '#DCFCE7' }]}>
          <Icon size={24} color={status === 'Upcoming' ? '#0284C7' : theme.primary} />
        </View>
        
        <View style={styles.info}>
          <ThemedText type="default" style={styles.serviceTitle}>{service}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>{provider}</ThemedText>
        </View>

        <View style={[
          styles.statusBadge, 
          { backgroundColor: status === 'Upcoming' ? '#FEE2E2' : '#DCFCE7' }
        ]}>
          <ThemedText type="small" style={{ 
            color: status === 'Upcoming' ? '#EF4444' : theme.primary,
            fontSize: 12,
            fontWeight: '700'
          }}>
            {status}
          </ThemedText>
        </View>
        
        <ChevronRight size={20} color={theme.textSecondary} />
      </View>

      <View style={styles.footer}>
        <View style={styles.detailItem}>
          <Calendar size={16} color={theme.textSecondary} style={styles.footerIcon} />
          <ThemedText type="small" style={styles.footerText}>{date}</ThemedText>
        </View>
        
        {time && (
          <View style={styles.detailItem}>
            <Clock size={16} color={theme.textSecondary} style={styles.footerIcon} />
            <ThemedText type="small" style={styles.footerText}>{time}</ThemedText>
          </View>
        )}

        {amount && (
          <View style={styles.detailItem}>
            <Banknote size={16} color={theme.textSecondary} style={styles.footerIcon} />
            <ThemedText type="small" style={styles.footerText}>{amount}</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  info: {
    flex: 1,
  },
  serviceTitle: {
    fontWeight: '700',
    fontSize: 18,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: Spacing.two,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: Spacing.two,
    gap: Spacing.four,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: Spacing.one,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
