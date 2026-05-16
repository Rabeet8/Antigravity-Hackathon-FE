import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Star } from 'lucide-react-native';

interface WorkerCardProps {
  name: string;
  type: string;
  rating: string;
  reviews: string;
  image: any;
}

export function WorkerCard({ name, type, rating, reviews, image }: WorkerCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.backgroundElement }]}
      activeOpacity={0.8}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.info}>
        <ThemedText type="default" style={styles.name}>{name}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>{type}</ThemedText>
        <View style={styles.ratingRow}>
          <Star size={14} color="#FBBF24" fill="#FBBF24" />
          <ThemedText type="smallBold" style={styles.ratingText}>{rating}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}> ({reviews})</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    borderRadius: 16,
    marginRight: Spacing.four,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  info: {
    padding: Spacing.three,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  ratingText: {
    marginLeft: 4,
    color: '#075E54',
  },
});
