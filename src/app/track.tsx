import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Animated, Dimensions, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { 
  ChevronLeft, Phone, MessageSquare, MapPin, Bike, 
  Clock, ShieldCheck, Star, Award, Compass
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 280;

export default function TrackScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [eta, setEta] = useState(8);
  const [distance, setDistance] = useState(1.8);
  const [currentStatus, setCurrentStatus] = useState('On the Way');
  const [rotation, setRotation] = useState('270deg'); // Initially moving UP from segment 0 to 1

  // Animation values for technician location
  const moveAnimX = useRef(new Animated.Value(0)).current;
  const moveAnimY = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Track coordinates for moving animation (relative to map layout)
  // We'll map coordinates along stylized roads on our custom map
  const pathPoints = [
    { x: 40, y: 240 },   // Start: Clifton Block 5
    { x: 40, y: 140 },   // Turn 1
    { x: 180, y: 140 },  // Turn 2
    { x: 180, y: 60 },   // Turn 3
    { x: 280, y: 60 },   // Destination: Home
  ];

  useEffect(() => {
    // Pulse animation for markers
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: false,
        })
      ])
    ).start();

    // Animate technician along path points
    let currentSegment = 0;
    const animateSegment = () => {
      if (currentSegment >= pathPoints.length - 1) {
        // Arrived!
        setCurrentStatus('Arrived');
        setEta(0);
        setDistance(0);
        return;
      }

      const nextPoint = pathPoints[currentSegment + 1];
      const prevPoint = pathPoints[currentSegment];
      
      // Calculate rotation based on direction of next move
      const dx = nextPoint.x - prevPoint.x;
      const dy = nextPoint.y - prevPoint.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          setRotation('0deg'); // Moving Right
        } else {
          setRotation('180deg'); // Moving Left
        }
      } else {
        if (dy > 0) {
          setRotation('90deg'); // Moving Down
        } else {
          setRotation('270deg'); // Moving Up
        }
      }

      Animated.parallel([
        Animated.timing(moveAnimX, {
          toValue: nextPoint.x,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(moveAnimY, {
          toValue: nextPoint.y,
          duration: 4000,
          useNativeDriver: false,
        })
      ]).start(() => {
        currentSegment++;
        // Update ETA and distance dynamically
        setEta(prev => Math.max(1, prev - 2));
        setDistance(prev => Math.max(0.2, parseFloat((prev - 0.4).toFixed(1))));
        animateSegment();
      });
    };

    // Initialize position
    moveAnimX.setValue(pathPoints[0].x);
    moveAnimY.setValue(pathPoints[0].y);
    
    // Start sequence after 1 second delay
    const timeout = setTimeout(animateSegment, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleCall = () => {
    Linking.openURL('tel:+923001234567');
  };

  const handleChat = () => {
    router.push('/chat');
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerTitle}>Live Tracking</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Kashif Ali is on his way</ThemedText>
        </View>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <Clock size={12} color="white" style={{ marginRight: 4 }} />
            <ThemedText style={styles.badgeText}>{eta > 0 ? `${eta} mins` : 'Arrived'}</ThemedText>
          </View>
        </View>
      </View>

      {/* Stylized Concept Map */}
      <View style={styles.mapContainer}>
        {/* Map Background grid / parks */}
        <View style={styles.mapBackground}>
          {/* Park 1 */}
          <View style={[styles.mapSector, styles.park1, { backgroundColor: '#E8F5E9' }]} />
          {/* Park 2 */}
          <View style={[styles.mapSector, styles.park2, { backgroundColor: '#E8F5E9' }]} />
          {/* Block A */}
          <View style={[styles.mapSector, styles.blockA, { backgroundColor: '#F5F5F5' }]}>
            <ThemedText style={styles.sectorLabel}>Gulberg III</ThemedText>
          </View>
          {/* Block B */}
          <View style={[styles.mapSector, styles.blockB, { backgroundColor: '#F5F5F5' }]}>
            <ThemedText style={styles.sectorLabel}>Block K</ThemedText>
          </View>
          {/* Sector C */}
          <View style={[styles.mapSector, styles.blockC, { backgroundColor: '#F5F5F5' }]}>
            <ThemedText style={styles.sectorLabel}>Main Boulevard</ThemedText>
          </View>

          {/* Roads (Grid system representation) */}
          <View style={styles.roadVertical1} />
          <View style={styles.roadVertical2} />
          <View style={styles.roadHorizontal1} />
          <View style={styles.roadHorizontal2} />

          {/* Route path lines pointing all the way to destination */}
          <View style={styles.routeSegment1} />
          <View style={styles.routeSegment2} />
          <View style={styles.routeSegment3} />
          <View style={styles.routeSegment4} />

          {/* User Destination Marker (Home) */}
          <View style={[styles.markerContainer, { left: 280 - 20, top: 60 - 20 }]}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], borderColor: '#1DB954' }]} />
            <View style={[styles.markerPin, { backgroundColor: '#1DB954' }]}>
              <MapPin size={20} color="white" fill="#1DB954" />
            </View>
            <View style={styles.markerLabelContainer}>
              <ThemedText style={styles.markerLabel}>Ghar</ThemedText>
            </View>
          </View>

          {/* Technician Origin Marker */}
          <View style={[styles.markerContainer, { left: 40 - 20, top: 240 - 20 }]}>
            <View style={[styles.markerPin, { backgroundColor: '#71796F' }]}>
              <Compass size={18} color="white" />
            </View>
            <View style={[styles.markerLabelContainer, { bottom: -24 }]}>
              <ThemedText style={[styles.markerLabel, { color: '#71796F' }]}>Start</ThemedText>
            </View>
          </View>

          {/* Animated Technician Bike Marker with Rotation */}
          <Animated.View 
            style={[
              styles.animatedMarker, 
              { 
                left: Animated.subtract(moveAnimX, 20), 
                top: Animated.subtract(moveAnimY, 20),
                transform: [{ rotate: rotation }]
              }
            ]}
          >
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], borderColor: '#075E54' }]} />
            <View style={[styles.technicianBubble, { backgroundColor: '#075E54' }]}>
              <Bike size={22} color="white" />
            </View>
          </Animated.View>
        </View>
      </View>

      <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 8 }}>
          {/* Status timeline */}
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, styles.completedDot]}>
                <ShieldCheck size={12} color="white" />
              </View>
              <ThemedText style={styles.statusTextDone}>Confirmed</ThemedText>
            </View>
            <View style={styles.statusConnectorActive} />
            
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, currentStatus === 'On the Way' ? styles.activeDot : styles.completedDot]}>
                {currentStatus === 'Arrived' ? <ShieldCheck size={12} color="white" /> : <Clock size={10} color="white" />}
              </View>
              <ThemedText style={currentStatus === 'On the Way' ? styles.statusTextActive : styles.statusTextDone}>On the Way</ThemedText>
            </View>
            <View style={currentStatus === 'Arrived' ? styles.statusConnectorActive : styles.statusConnectorPending} />
            
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, currentStatus === 'Arrived' ? styles.activeDot : styles.pendingDot]} />
              <ThemedText style={currentStatus === 'Arrived' ? styles.statusTextActive : styles.statusTextPending}>Arrived</ThemedText>
            </View>
          </View>

          {/* Technician Card */}
          <View style={styles.technicianCard}>
            <Image 
              source={require('../../assets/images/worker_plumber.png')} 
              style={styles.providerImage}
            />
            <View style={styles.providerDetails}>
              <View style={styles.providerNameRow}>
                <ThemedText style={styles.providerName}>Kashif Ali</ThemedText>
                <View style={styles.ratingBadge}>
                  <Star size={12} color="#EAB308" fill="#EAB308" />
                  <ThemedText style={styles.ratingText}>4.9</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.providerService}>AC Repair Specialist</ThemedText>
              <ThemedText style={styles.vehicleText}>Suzuki GS-150 • KHI-9281</ThemedText>
            </View>
          </View>

          {/* Live Distance Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <ThemedText style={styles.infoLabel}>DISTANCE</ThemedText>
              <ThemedText style={styles.infoValue}>{distance} km</ThemedText>
            </View>
            <View style={[styles.infoBox, { borderLeftWidth: 1, borderLeftColor: '#F3F4F6' }]}>
              <ThemedText style={styles.infoLabel}>ESTIMATED TIME</ThemedText>
              <ThemedText style={styles.infoValue}>{eta > 0 ? `${eta} mins` : 'Arrived'}</ThemedText>
            </View>
          </View>
        </ScrollView>

        {/* Action Controls */}
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={handleCall} style={[styles.actionBtn, styles.callBtn]}>
            <Phone size={20} color="#075E54" />
            <ThemedText style={styles.callBtnText}>Call</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChat} style={[styles.actionBtn, styles.chatBtn, { backgroundColor: theme.primary }]}>
            <MessageSquare size={20} color="white" />
            <ThemedText style={styles.chatBtnText}>Message Chat</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  header: {
    backgroundColor: '#075E54',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: Spacing.three,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#D1FAE5',
    marginTop: 2,
  },
  badgeContainer: {
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  mapContainer: {
    height: MAP_HEIGHT,
    backgroundColor: '#E8F5E9',
    position: 'relative',
    overflow: 'hidden',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8F5E9', // Light green base
  },
  mapSector: {
    position: 'absolute',
    borderRadius: 16,
    padding: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  park1: {
    width: 110,
    height: 110,
    left: 50,
    top: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  park2: {
    width: 140,
    height: 90,
    left: 210,
    top: 160,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  blockA: {
    width: 110,
    height: 36,
    left: 210,
    top: 8,
    opacity: 0.8,
  },
  blockB: {
    width: 110,
    height: 70,
    left: 50,
    top: 160,
    opacity: 0.8,
  },
  blockC: {
    width: 60,
    height: 70,
    left: 210,
    top: 80,
    opacity: 0.8,
  },
  sectorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Simulated roads
  roadVertical1: {
    position: 'absolute',
    left: 28,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  roadVertical2: {
    position: 'absolute',
    left: 168,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  roadHorizontal1: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  roadHorizontal2: {
    position: 'absolute',
    top: 128,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  // Route markers & lines pointing all the way to destination
  routeSegment1: {
    position: 'absolute',
    left: 38,
    top: 140,
    height: 100,
    width: 4,
    backgroundColor: '#075E54',
  },
  routeSegment2: {
    position: 'absolute',
    left: 40,
    top: 138,
    width: 140,
    height: 4,
    backgroundColor: '#075E54',
  },
  routeSegment3: {
    position: 'absolute',
    left: 178,
    top: 60,
    height: 80,
    width: 4,
    backgroundColor: '#075E54',
  },
  routeSegment4: {
    position: 'absolute',
    left: 180,
    top: 58,
    width: 100,
    height: 4,
    backgroundColor: '#075E54',
  },
  markerContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerLabelContainer: {
    position: 'absolute',
    bottom: 42,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    left: -4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  markerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1DB954',
    textAlign: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    opacity: 0.4,
  },
  animatedMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  technicianBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  // Bottom Sheet styles
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -30,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.four,
  },
  statusItem: {
    alignItems: 'center',
    width: 70,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  completedDot: {
    backgroundColor: '#1DB954',
  },
  activeDot: {
    backgroundColor: '#075E54',
  },
  pendingDot: {
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  statusTextDone: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1DB954',
  },
  statusTextActive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#075E54',
  },
  statusTextPending: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  statusConnectorActive: {
    flex: 1,
    height: 3,
    backgroundColor: '#1DB954',
    marginTop: -16,
  },
  statusConnectorPending: {
    flex: 1,
    height: 3,
    backgroundColor: '#E5E7EB',
    marginTop: -16,
  },
  technicianCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  providerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: Spacing.three,
  },
  providerDetails: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#075E54',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#854D0E',
    marginLeft: 2,
  },
  providerService: {
    fontSize: 13,
    color: '#71796F',
    marginTop: 2,
  },
  vehicleText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    marginBottom: Spacing.two,
  },
  infoBox: {
    flex: 1,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#075E54',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  callBtn: {
    borderWidth: 1.5,
    borderColor: '#075E54',
    backgroundColor: 'white',
  },
  callBtnText: {
    color: '#075E54',
    fontWeight: '700',
    fontSize: 15,
  },
  chatBtn: {
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  chatBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
});
