import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MapPin, Pencil, Globe, Bell, HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  const languages = ['English', 'Roman Urdu', 'اردو'];

  return (
    <ThemedView style={styles.container}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileCard, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require('../../../assets/images/user_profile.png')} 
                style={styles.avatar} 
              />
              <TouchableOpacity style={[styles.editIcon, { backgroundColor: theme.primary }]}>
                <Pencil size={12} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.userDetails}>
              <ThemedText style={styles.userName}>Ahmed Khan</ThemedText>
              <View style={styles.locationRow}>
                <MapPin size={16} color={theme.textSecondary} />
                <ThemedText style={styles.locationText}>G-13, Islamabad</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <ThemedText style={styles.sectionLabel}>App Preferences</ThemedText>
        
        <View style={[styles.settingItem, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.settingHeader}>
            <Globe size={20} color={theme.secondary} />
            <ThemedText style={styles.settingTitle}>Language Preference</ThemedText>
          </View>
          
          <View style={styles.languageContainer}>
            {languages.map((lang) => (
              <TouchableOpacity 
                key={lang}
                style={[
                  styles.languageTab,
                  language === lang && styles.activeLanguageTab
                ]}
                onPress={() => setLanguage(lang)}
              >
                <ThemedText style={[
                  styles.languageTabText,
                  language === lang && { color: theme.primary }
                ]}>
                  {lang}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.settingItem, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={theme.secondary} />
              <ThemedText style={styles.settingTitle}>Notifications</ThemedText>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <ThemedText style={styles.sectionLabel}>Support & Info</ThemedText>
        
        <TouchableOpacity style={[styles.infoItem, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.infoLeft}>
            <HelpCircle size={20} color={theme.secondary} />
            <ThemedText style={styles.settingTitle}>Help & Support</ThemedText>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.infoItem, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.infoLeft}>
            <Info size={20} color={theme.secondary} />
            <ThemedText style={styles.settingTitle}>About App</ThemedText>
          </View>
          <ThemedText style={styles.versionText}>Version 1.0.4</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#FEE2E2' }]}>
          <LogOut size={20} color="#EF4444" />
          <ThemedText style={styles.logoutText}>Logout from Account</ThemedText>
        </TouchableOpacity>
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
  profileCard: {
    borderRadius: 24,
    padding: Spacing.four,
    marginTop: Spacing.three,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#1DB954',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userDetails: {
    marginLeft: Spacing.four,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#075E54',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    marginLeft: 4,
    color: '#71796F',
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: Spacing.five,
    marginBottom: Spacing.two,
  },
  settingItem: {
    borderRadius: 20,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    marginLeft: Spacing.three,
    fontSize: 18,
    fontWeight: '700',
    color: '#075E54',
  },
  languageContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  languageTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeLanguageTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageTabText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#4B5563',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    color: '#71796F',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    borderRadius: 20,
    marginTop: Spacing.four,
    gap: Spacing.three,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
});
