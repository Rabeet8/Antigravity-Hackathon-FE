import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { BookingCard } from '@/components/booking-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Paintbrush, Zap, Wrench, Headphones } from 'lucide-react-native';

export default function BookingsScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All Bookings', 'Upcoming', 'Completed'];

  return (
    <ThemedView style={styles.container}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <ThemedText style={styles.title}>Meri Bookings</ThemedText>
          <ThemedText style={styles.subtitle}>Manage your service requests and history</ThemedText>
        </View>

        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[
                styles.tab, 
                activeTab === tab && { backgroundColor: theme.primary }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText style={[
                styles.tabText, 
                activeTab === tab && { color: 'white' }
              ]}>
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bookingsList}>
          <BookingCard 
            service="Painter" 
            provider="Usman Painters" 
            date="20 May 2025" 
            time="10:00 AM" 
            status="Upcoming" 
            Icon={Paintbrush}
          />
          <BookingCard 
            service="Electrician" 
            provider="Hamid Electric" 
            date="10 May 2025" 
            amount="Rs. 1,200" 
            status="Completed" 
            Icon={Zap}
          />
          <BookingCard 
            service="Plumber" 
            provider="Khan Plumbing" 
            date="28 Apr 2025" 
            amount="Rs. 850" 
            status="Completed" 
            Icon={Wrench}
          />
        </View>

        <View style={[styles.supportBanner, { backgroundColor: '#CCFBF1' }]}>
          <View style={styles.supportInfo}>
            <ThemedText style={styles.supportTitle}>Need help with a booking?</ThemedText>
            <ThemedText style={styles.supportDesc}>
              Our support team is available 24/7 to resolve any issues with your service providers.
            </ThemedText>
            <TouchableOpacity style={[styles.supportButton, { backgroundColor: theme.secondary }]}>
              <ThemedText style={styles.supportButtonText}>Contact Support</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.supportIconContainer}>
            <Headphones size={80} color="#99F6E4" strokeWidth={1} />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  headerSection: {
    marginTop: Spacing.three,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#075E54',
  },
  subtitle: {
    fontSize: 16,
    color: '#71796F',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: Spacing.four,
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  tabText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#4B5563',
  },
  bookingsList: {
    marginTop: Spacing.two,
  },
  supportBanner: {
    borderRadius: 24,
    padding: Spacing.four,
    marginTop: Spacing.four,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  supportInfo: {
    flex: 1,
    zIndex: 1,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#075E54',
  },
  supportDesc: {
    fontSize: 14,
    color: '#0D9488',
    marginTop: 8,
    lineHeight: 20,
  },
  supportButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 16,
  },
  supportButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  supportIconContainer: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    opacity: 0.5,
  },
});
