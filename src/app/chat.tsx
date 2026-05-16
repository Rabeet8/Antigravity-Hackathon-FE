import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Send, Mic, Plus, Menu, ChevronLeft, Bot, Radio, CheckCircle2, RotateCcw } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function ChatScreen() {
  const theme = useTheme();
  const [message, setMessage] = useState('');

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#F0FDF4" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Kaam Karo</ThemedText>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.urduButton}>
              <ThemedText style={styles.urduText}>اردو</ThemedText>
            </TouchableOpacity>
            <Image 
              source={require('../../assets/images/user_profile.png')} 
              style={styles.profilePic} 
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.chatContent}>
        <View style={styles.botMessage}>
          <ThemedText style={styles.botText}>
            Assalam o Alaikum! 👋 Kaunsi service chahiye aaj?
          </ThemedText>
          <ThemedText style={styles.timeText}>10:00 AM</ThemedText>
        </View>

        <View style={[styles.userMessage, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={styles.userText}>
            Mujhe kal subah G-13 mein AC technician chahiye
          </ThemedText>
          <ThemedText style={[styles.timeText, { textAlign: 'right' }]}>10:01 AM</ThemedText>
        </View>

        <View style={styles.botMessage}>
          <ThemedText style={styles.botText}>
            Samajh raha hoon... 🤔 ...
          </ThemedText>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.summaryHeader}>
            <Bot size={20} color={theme.primary} />
            <ThemedText style={styles.summaryTitle}>Yeh samjha maine 🤖</ThemedText>
          </View>
          
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Service</ThemedText>
            <ThemedText style={styles.summaryValue}>AC Technician</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Location</ThemedText>
            <ThemedText style={styles.summaryValue}>G-13, Islamabad</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Time</ThemedText>
            <ThemedText style={styles.summaryValue}>Tomorrow Morning</ThemedText>
          </View>

          <View style={styles.summaryActions}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.secondary }]}>
              <ThemedText style={styles.actionText}>Haan, sahi hai</ThemedText>
              <CheckCircle2 size={16} color="white" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryActionButton}>
              <ThemedText style={styles.secondaryActionText}>Badlo</ThemedText>
              <RotateCcw size={16} color={theme.textSecondary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusMessage}>
          <Radio size={16} color={theme.primary} />
          <ThemedText style={styles.statusText}>
            Providers dhoond raha hoon aapke area mein... 📡
          </ThemedText>
        </View>
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.plusButton}>
            <Plus size={24} color={theme.textSecondary} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput 
              placeholder="Apni zaroorat likhein..." 
              style={styles.input}
              value={message}
              onChangeText={setMessage}
            />
            <Mic size={20} color={theme.textSecondary} />
          </View>
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.primary }]}>
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  header: {
    backgroundColor: '#075E54', // Dark Secondary Color
    paddingTop: 60,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1DB954',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  urduButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  urduText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F0FDF4',
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  chatContent: {
    padding: Spacing.four,
    paddingBottom: 40,
  },
  botMessage: {
    backgroundColor: 'white',
    padding: Spacing.three,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '85%',
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  botText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  timeText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    padding: Spacing.three,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '85%',
    marginBottom: Spacing.three,
  },
  userText: {
    fontSize: 16,
    color: '#075E54',
    lineHeight: 22,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
  },
  summaryTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '800',
    color: '#075E54',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    color: '#71796F',
    fontSize: 14,
  },
  summaryValue: {
    fontWeight: '700',
    color: '#075E54',
    fontSize: 14,
  },
  summaryActions: {
    flexDirection: 'row',
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryActionText: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 13,
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: '#F0FDF4',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.three,
  },
  plusButton: {
    marginRight: Spacing.two,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: Spacing.three,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.two,
  },
});
