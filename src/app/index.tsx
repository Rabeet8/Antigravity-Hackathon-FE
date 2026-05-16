import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const theme = useTheme();

  const handleGetStarted = () => {
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
            <Image 
              source={require('../../assets/images/icon.png')} 
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </View>
          <ThemedText type="subtitle" style={styles.appName}>Kaam Karo</ThemedText>
          <ThemedText style={styles.appNameUrdu}>کام کرو</ThemedText>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.circleBg}>
            <Image 
              source={require('../../assets/images/onboarding_workers.png')} 
              style={styles.illustration}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.tagline}>Ghar Baithe, Kaam Karwao</ThemedText>
          <ThemedText style={styles.taglineUrdu}>گھر بیٹھے، کام کروائیں</ThemedText>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'space-between',
    paddingVertical: Spacing.four,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  logoIcon: {
    width: 50,
    height: 50,
    tintColor: 'white',
  },
  appName: {
    color: '#075E54',
    fontWeight: '800',
    fontSize: 32,
  },
  appNameUrdu: {
    fontSize: 24,
    color: '#075E54',
    fontWeight: '700',
    marginTop: -5,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBg: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  illustration: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.85) / 2,
  },
  footer: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#075E54',
  },
  taglineUrdu: {
    fontSize: 24,
    color: '#1DB954',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
