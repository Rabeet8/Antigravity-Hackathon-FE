import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { BookingCard } from '@/components/booking-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Paintbrush, Zap, Wrench, Headphones, Snowflake, Hammer, Eraser, User } from 'lucide-react-native';
import { getBookingHistory } from '@/services/orchestratorService';

interface Booking {
  booking_id: string;
  service: string;
  provider_id: string;
  provider_name: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Completed';
  amount?: string;
}

export default function BookingsScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('All Bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = ['All Bookings', 'Upcoming', 'Completed'];

  // Map service names to Lucide icons dynamically
  const getServiceIcon = (serviceName: string) => {
    const sLower = (serviceName || '').toLowerCase();
    if (sLower.includes('ac') || sLower.includes('cool') || sLower.includes('air')) return Snowflake;
    if (sLower.includes('plumb') || sLower.includes('nalka') || sLower.includes('pipe') || sLower.includes('flush')) return Wrench;
    if (sLower.includes('elect') || sLower.includes('bijli') || sLower.includes('wire')) return Zap;
    if (sLower.includes('paint') || sLower.includes('rang')) return Paintbrush;
    if (sLower.includes('carpenter') || sLower.includes('badhai') || sLower.includes('wood')) return Hammer;
    if (sLower.includes('clean') || sLower.includes('safai')) return Eraser;
    return User;
  };

  const loadBookingHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBookingHistory();
      console.log('[BookingsScreen] Loaded bookings:', data);
      setBookings(data);
    } catch (err: any) {
      console.warn('[BookingsScreen] Failed to fetch live bookings, engaging offline fallback state.');
      // Local fallback standard mocks
      setBookings([
        {
          booking_id: "KK-20240520-003",
          service: "Painter",
          provider_id: "PRV-006",
          provider_name: "Usman Painters",
          date: "2024-05-20",
          time: "08:00 AM",
          location: "E-11, Islamabad",
          status: "Upcoming"
        },
        {
          booking_id: "KK-20240510-001",
          service: "Electrician",
          provider_id: "PRV-004",
          provider_name: "Hamid Electric",
          date: "2024-05-10",
          time: "10:00 AM",
          location: "F-7, Islamabad",
          status: "Completed",
          amount: "Rs. 1,200"
        },
        {
          booking_id: "KK-20240428-002",
          service: "Plumber",
          provider_id: "PRV-005",
          provider_name: "Khan Plumbing",
          date: "2024-04-28",
          time: "09:00 AM",
          location: "G-9, Islamabad",
          status: "Completed",
          amount: "Rs. 850"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookingHistory();
  }, []);

  // Filter list based on selected active tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All Bookings') return true;
    return b.status === activeTab;
  });

  return (
    <ThemedView style={styles.container}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <ThemedText style={styles.title}>Meri Bookings</ThemedText>
          <ThemedText style={styles.subtitle}>Manage your service requests and history</ThemedText>
        </View>

        {/* Tab Filters */}
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

        {/* Dynamic Loading indicator */}
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <ThemedText style={styles.loaderText}>History loading...</ThemedText>
          </View>
        ) : (
          <View style={styles.bookingsList}>
            {filteredBookings.length === 0 ? (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>Abhi koi booking nahi mili.</ThemedText>
              </View>
            ) : (
              filteredBookings.map((b) => (
                <BookingCard 
                  key={b.booking_id}
                  service={b.service} 
                  provider={b.provider_name} 
                  date={b.date} 
                  time={b.time} 
                  amount={b.amount || "Rs. 1,000"} 
                  status={b.status} 
                  Icon={getServiceIcon(b.service)}
                />
              ))
            )}
          </View>
        )}

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
    minHeight: 150,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.five,
  },
  loaderText: {
    marginTop: Spacing.two,
    color: '#71796F',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.five,
  },
  emptyText: {
    fontSize: 14,
    color: '#71796F',
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
