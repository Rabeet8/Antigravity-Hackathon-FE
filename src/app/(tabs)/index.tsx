import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { ServiceCard } from '@/components/service-card';
import { WorkerCard } from '@/components/worker-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Search, Mic, Plus, Snowflake, Wrench, Zap, Paintbrush, Hammer, Eraser } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const theme = useTheme();

  const handleOpenChat = () => {
    router.push('/chat');
  };

  const handleBookNow = () => {
    // Navigates directly to the chat screen with context for Roof Waterproofing
    router.push('/chat?service=waterproofing');
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.greetingSection}>
          <ThemedText style={styles.greetingText}>Assalam-o-Alaikum,</ThemedText>
          <ThemedText style={styles.userName}>Ahmed Khan</ThemedText>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: '#FFFFFF' }]}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput 
            placeholder="Search for a service..." 
            style={styles.searchInput}
            placeholderTextColor={theme.textSecondary}
          />
          <Mic size={20} color={theme.primary} />
        </View>

        {/* Active tracking banner */}
        <View style={[styles.activeBanner, { backgroundColor: theme.primary }]}>
          <View style={styles.bannerIconContainer}>
            <Snowflake size={24} color={theme.primary} />
          </View>
          <View style={styles.bannerInfo}>
            <ThemedText style={styles.activeNowText}>ACTIVE NOW</ThemedText>
            <ThemedText style={styles.serviceNameText}>AC Technician</ThemedText>
            <ThemedText style={styles.etaText}>Arriving in 8 mins</ThemedText>
          </View>
          <TouchableOpacity style={styles.trackButton} onPress={() => router.push('/track')}>
            <ThemedText style={styles.trackButtonText}>Track</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Popular Services</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          <ServiceCard title="AC Tech" Icon={Snowflake} />
          <ServiceCard title="Plumber" Icon={Wrench} />
          <ServiceCard title="Electrician" Icon={Zap} />
          <ServiceCard title="Painter" Icon={Paintbrush} />
          <ServiceCard title="Carpenter" Icon={Hammer} />
          <ServiceCard title="Cleaning" Icon={Eraser} />
        </View>

        {/* Book Now Promo Banner */}
        <TouchableOpacity 
          style={styles.promoBanner} 
          activeOpacity={0.9}
          onPress={handleBookNow}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800' }} 
            style={styles.promoImage} 
          />
          <View style={styles.promoOverlay}>
            <ThemedText style={styles.promoTag}>MONSOON SPECIAL</ThemedText>
            <ThemedText style={styles.promoTitle}>20% off on Roof Waterproofing</ThemedText>
            <TouchableOpacity style={styles.bookNowButton} onPress={handleBookNow} activeOpacity={0.8}>
              <ThemedText style={styles.bookNowText}>Book Now</ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Top Rated Near You</ThemedText>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <WorkerCard 
            name="Kashif Ali" 
            type="Master Plumber" 
            rating="4.9" 
            reviews="120" 
            image={require('../../../assets/images/worker_plumber.png')} 
          />
          <WorkerCard 
            name="Zeeshan Malik" 
            type="Electrician" 
            rating="4.8" 
            reviews="85" 
            image={require('../../../assets/images/worker_electrician.png')} 
          />
        </ScrollView>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.secondary }]}
        onPress={handleOpenChat}
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 100,
  },
  greetingSection: {
    marginTop: Spacing.three,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#075E54',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1DB954',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    height: 56,
    borderRadius: 16,
    marginTop: Spacing.three,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.two,
    fontSize: 16,
    color: '#075E54',
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 20,
    marginTop: Spacing.four,
  },
  bannerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  bannerInfo: {
    flex: 1,
  },
  activeNowText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  serviceNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  etaText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  trackButton: {
    backgroundColor: '#075E54',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.five,
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#075E54',
  },
  seeAllText: {
    color: '#1DB954',
    fontWeight: '700',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  promoBanner: {
    height: 180,
    borderRadius: 24,
    marginTop: Spacing.four,
    overflow: 'hidden',
    position: 'relative',
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: Spacing.four,
    justifyContent: 'center',
  },
  promoTag: {
    color: '#1DB954',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  promoTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
    maxWidth: '80%',
  },
  bookNowButton: {
    backgroundColor: '#1DB954',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
  },
  bookNowText: {
    color: 'white',
    fontWeight: '700',
  },
  horizontalScroll: {
    marginBottom: Spacing.four,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
