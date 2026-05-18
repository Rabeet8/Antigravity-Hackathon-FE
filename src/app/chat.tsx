import React, { useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { 
  Send, Mic, Plus, ChevronLeft, Bot, Radio, CheckCircle2, RotateCcw, 
  Calendar, MapPin, Clock, DollarSign, Bell, Award, Star, Wrench 
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { runOrchestrator } from '@/services/orchestratorService';
import { AgentTraceCard } from '@/components/agent-trace-card';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'card' | 'thinking' | 'status_loading';
  cardType?: 'extracted_info' | 'provider_list' | 'booking_confirmed' | 'reminder_set' | 'agent_trace';
  text?: string;
  time?: string;
  data?: any;
  executionTime?: number;
}

export default function ChatScreen() {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeAgentStep, setActiveAgentStep] = useState(0); // 0: None, 1: NER, 2: Search, 3: Ranking, 4: Booking, 5: Reminders
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      type: 'bot',
      text: 'Assalam o Alaikum! 👋 Kaunsi service chahiye aaj?',
      time: '10:00 AM',
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  // Helper to get formatted current time (e.g. 10:05 AM)
  const formatTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    let userText = message.trim();
    
    // Proactive Context Merge: If responding to a missing location sector query,
    // merge the previous context so our stateless backend completes the booking successfully.
    if (messages.length >= 2) {
      const lastBotMessage = messages[messages.length - 1];
      const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
      
      if (lastBotMessage && lastBotMessage.text && lastBotMessage.text.includes("area kaunsa hai") && lastUserMessage) {
        userText = `${lastUserMessage.text} at ${userText}`;
        console.log('[Chat] Proactive context merge:', userText);
      }
    }

    setMessage('');
    setIsSending(true);

    const timestamp = formatTime();
    const userMsgId = Date.now().toString();

    // 1. Add user message to history
    const userMsg: Message = {
      id: userMsgId,
      type: 'user',
      text: userText,
      time: timestamp,
    };

    // 2. Add temporary thinking bubble
    const thinkingMsgId = (Date.now() + 1).toString();
    const thinkingMsg: Message = {
      id: thinkingMsgId,
      type: 'thinking',
      text: 'Samajh raha hoon... 🤔 ...',
    };

    setMessages((prev) => [...prev, userMsg, thinkingMsg]);

    try {
      console.log('[Chat] Triggering orchestrator for:', userText);
      const responseData = await runOrchestrator(userText);
      console.log('[Chat] Orchestrator response:', responseData);

      // 3. Remove thinking bubble
      setMessages((prev) => prev.filter((m) => m.id !== thinkingMsgId));

      // 4. Handle error fallback cases (e.g. missing location / empty)
      if (responseData.final_output?.error_code) {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          type: 'bot',
          text: responseData.final_output.confirmation_message,
          time: formatTime(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      // 5. Append AI cards in sequence with status loading bubbles and 1.5s delay
      // Set to 1500ms so the user can easily read and interact with the loading animations!
      const AGENT_DELAY = 1500; 

      // --- Agent 1: NER ---
      setActiveAgentStep(1);
      const status1Id = `status-ner-${Date.now()}`;
      setMessages((prev) => [...prev, {
        id: status1Id,
        type: 'status_loading',
        text: 'Analyzing request... 🧠'
      }]);
      await delay(AGENT_DELAY);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== status1Id),
        {
          id: `ner-${Date.now()}`,
          type: 'card',
          cardType: 'extracted_info',
          data: responseData.full_trace.ner.output,
          time: formatTime(),
        }
      ]);

      // --- Agent 2: Search ---
      setActiveAgentStep(2);
      const status2Id = `status-search-${Date.now()}`;
      setMessages((prev) => [...prev, {
        id: status2Id,
        type: 'status_loading',
        text: 'Searching providers... 🔍'
      }]);
      await delay(AGENT_DELAY);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== status2Id),
        {
          id: `ranking-${Date.now()}`,
          type: 'card',
          cardType: 'provider_list',
          data: responseData.full_trace.ranking.output.ranked_providers,
          time: formatTime(),
        }
      ]);

      // --- Agent 3: Ranking ---
      setActiveAgentStep(3);
      const status3Id = `status-ranking-${Date.now()}`;
      setMessages((prev) => [...prev, {
        id: status3Id,
        type: 'status_loading',
        text: 'Ranking best providers... 📊'
      }]);
      await delay(AGENT_DELAY);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== status3Id),
        {
          id: `booking-${Date.now()}`,
          type: 'card',
          cardType: 'booking_confirmed',
          data: responseData.final_output,
          time: formatTime(),
        }
      ]);

      // --- Agent 4: Booking ---
      setActiveAgentStep(4);
      const status4Id = `status-booking-${Date.now()}`;
      setMessages((prev) => [...prev, {
        id: status4Id,
        type: 'status_loading',
        text: 'Creating Appointment... 📅'
      }]);
      await delay(AGENT_DELAY);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== status4Id),
        {
          id: `reminder-${Date.now()}`,
          type: 'card',
          cardType: 'reminder_set',
          data: responseData.full_trace.reminder.output,
          time: formatTime(),
        }
      ]);

      // --- Agent 5: Reminder ---
      setActiveAgentStep(5);
      const status5Id = `status-reminder-${Date.now()}`;
      setMessages((prev) => [...prev, {
        id: status5Id,
        type: 'status_loading',
        text: 'Scheduling Reminders... 🔔'
      }]);
      await delay(AGENT_DELAY);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== status5Id),
        {
          id: `trace-${Date.now()}`,
          type: 'card',
          cardType: 'agent_trace',
          data: responseData.agent_trace,
          executionTime: responseData.execution_time_ms,
          time: formatTime(),
        }
      ]);

      setActiveAgentStep(0); // Finished!

    } catch (error) {
      console.error('[Chat] Execution error:', error);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== thinkingMsgId);
        const errorMsg: Message = {
          id: `err-net-${Date.now()}`,
          type: 'bot',
          text: 'Maaf kijiyega, backend server se rabta nahi ho saka. Apni API keys check karein aur server ko dobara start karein! 🔌🛠️',
          time: formatTime(),
        };
        return [...filtered, errorMsg];
      });
    } finally {
      setIsSending(false);
    }
  };

  const renderAgentLoader = () => {
    if (activeAgentStep === 0) return null;

    const steps = [
      { id: 1, label: 'Analyzing request... 🧠' },
      { id: 2, label: 'Searching providers... 🔍' },
      { id: 3, label: 'Ranking best providers... 📊' },
      { id: 4, label: 'Creating Appointment... 📅' },
      { id: 5, label: 'Scheduling Reminders... 🔔' },
    ];

    const currentStep = steps.find(s => s.id === activeAgentStep);
    if (!currentStep) return null;

    return (
      <View style={styles.floatingLoaderContainer}>
        <View style={styles.floatingLoaderCard}>
          <ActivityIndicator size="small" color="#059669" />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.floatingLoaderTitle}>🤖 Kaam Karo AI Engine Active</ThemedText>
            <ThemedText style={styles.floatingLoaderStatus}>{currentStep.label}</ThemedText>
          </View>
        </View>
      </View>
    );
  };

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

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => {
          if (msg.type === 'bot') {
            return (
              <View key={msg.id} style={styles.botMessage}>
                <ThemedText style={styles.botText}>{msg.text}</ThemedText>
                {msg.time && <ThemedText style={styles.timeText}>{msg.time}</ThemedText>}
              </View>
            );
          }

          if (msg.type === 'thinking') {
            return (
              <View key={msg.id} style={styles.botMessage}>
                <ThemedText style={styles.botText}>{msg.text}</ThemedText>
              </View>
            );
          }

          if (msg.type === 'status_loading') {
            return (
              <View key={msg.id} style={[styles.botMessage, { borderColor: theme.primary, borderWidth: 1, backgroundColor: '#F0FDF4', flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 }]}>
                <ActivityIndicator size="small" color={theme.primary} />
                <ThemedText style={{ fontWeight: '700', color: theme.primary, fontSize: 13, flex: 1 }}>
                  {msg.text}
                </ThemedText>
              </View>
            );
          }

          if (msg.type === 'user') {
            return (
              <View 
                key={msg.id} 
                style={[styles.userMessage, { backgroundColor: theme.backgroundSelected }]}
              >
                <ThemedText style={styles.userText}>{msg.text}</ThemedText>
                {msg.time && (
                  <ThemedText style={[styles.timeText, { textAlign: 'right' }]}>
                    {msg.time}
                  </ThemedText>
                )}
              </View>
            );
          }

          if (msg.type === 'card') {
            if (msg.cardType === 'extracted_info') {
              return (
                <View key={msg.id} style={[styles.summaryCard, { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }]}>
                  <View style={[styles.summaryHeader, { backgroundColor: '#F3F4F6' }]}>
                    <Bot size={20} color={theme.primary} />
                    <ThemedText style={[styles.summaryTitle, { color: '#374151' }]}>
                      📝 Details Samjhi Gayeen
                    </ThemedText>
                  </View>
                  
                  <View style={styles.summaryItem}>
                    <ThemedText style={styles.summaryLabel}>Intent</ThemedText>
                    <ThemedText style={styles.summaryValue}>
                      {msg.data.intent === 'book_service' ? 'Book Service' : msg.data.intent}
                    </ThemedText>
                  </View>
                  <View style={styles.summaryItem}>
                    <ThemedText style={styles.summaryLabel}>Service</ThemedText>
                    <ThemedText style={[styles.summaryValue, !msg.data.service_type && { color: '#EF4444' }]}>
                      {msg.data.service_type || 'Nahi mila ⚠️'}
                    </ThemedText>
                  </View>
                  <View style={styles.summaryItem}>
                    <ThemedText style={styles.summaryLabel}>Location</ThemedText>
                    <ThemedText style={[styles.summaryValue, !msg.data.location && { color: '#EF4444' }]}>
                      {msg.data.location || 'Nahi mila ⚠️'}
                    </ThemedText>
                  </View>
                  <View style={styles.summaryItem}>
                    <ThemedText style={styles.summaryLabel}>Time</ThemedText>
                    <ThemedText style={[styles.summaryValue, !msg.data.time_normalized && { color: '#EF4444' }]}>
                      {msg.data.time_normalized || 'Nahi mila ⚠️'}
                    </ThemedText>
                  </View>
                  <View style={styles.summaryItem}>
                    <ThemedText style={styles.summaryLabel}>Language</ThemedText>
                    <ThemedText style={styles.summaryValue}>
                      {msg.data.language_detected || 'Unknown'}
                    </ThemedText>
                  </View>
                </View>
              );
            }

            if (msg.cardType === 'provider_list') {
              return (
                <View key={msg.id} style={[styles.summaryCard, { backgroundColor: '#FFFFFF', borderColor: '#DCFCE7' }]}>
                  <View style={styles.summaryHeader}>
                    <Radio size={20} color={theme.primary} />
                    <ThemedText style={styles.summaryTitle}>🔍 Ranked Providers Near You</ThemedText>
                  </View>
                  
                  {msg.data.map((prov: any, idx: number) => (
                    <View key={prov.provider_id || idx} style={[styles.summaryItem, { flexDirection: 'column', alignItems: 'flex-start', paddingVertical: 10 }]}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View style={{ backgroundColor: theme.primary, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <ThemedText style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>
                              {prov.rank}
                            </ThemedText>
                          </View>
                          <ThemedText style={{ fontWeight: '800', color: '#075E54', fontSize: 14 }}>
                            {prov.name}
                          </ThemedText>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                          <Star size={12} color="#EAB308" fill="#EAB308" />
                          <ThemedText style={{ fontSize: 11, fontWeight: '700', color: '#15803D', marginLeft: 2 }}>
                            {prov.rating || '4.5'}
                          </ThemedText>
                        </View>
                      </View>
                      
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 4, paddingLeft: 26 }}>
                        <ThemedText style={{ fontSize: 12, color: '#71796F' }}>
                          Distance: {prov.distance || '2.0 km'}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, fontWeight: '700', color: theme.secondary }}>
                          Score: {prov.score}
                        </ThemedText>
                      </View>
                      <ThemedText style={{ fontSize: 11, color: '#71796F', paddingLeft: 26, fontStyle: 'italic', marginTop: 2 }}>
                        {prov.reasoning}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              );
            }

            if (msg.cardType === 'booking_confirmed') {
              return (
                <View key={msg.id} style={[styles.summaryCard, { backgroundColor: '#FFFFFF', borderColor: theme.primary, borderWidth: 1.5 }]}>
                  <View style={[styles.summaryHeader, { backgroundColor: theme.backgroundSelected }]}>
                    <CheckCircle2 size={20} color={theme.primary} />
                    <ThemedText style={[styles.summaryTitle, { color: '#15803D' }]}>
                      ✅ Appointment Receipt
                    </ThemedText>
                  </View>
                  
                  <View style={{ paddingVertical: 8, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', marginBottom: 6 }}>
                    <ThemedText style={{ fontSize: 12, color: '#9CA3AF' }}>BOOKING REFERENCE</ThemedText>
                    <ThemedText style={{ fontSize: 16, fontWeight: '800', color: theme.primary, marginTop: 2 }}>
                      {msg.data.booking_id}
                    </ThemedText>
                  </View>

                  <View style={styles.summaryItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Wrench size={14} color="#71796F" />
                      <ThemedText style={styles.summaryLabel}>Service</ThemedText>
                    </View>
                    <ThemedText style={styles.summaryValue}>{msg.data.service}</ThemedText>
                  </View>
                  <View style={styles.summaryItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Award size={14} color="#71796F" />
                      <ThemedText style={styles.summaryLabel}>Provider</ThemedText>
                    </View>
                    <ThemedText style={styles.summaryValue}>{msg.data.provider_name}</ThemedText>
                  </View>
                  <View style={styles.summaryItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} color="#71796F" />
                      <ThemedText style={styles.summaryLabel}>Time Slot</ThemedText>
                    </View>
                    <ThemedText style={styles.summaryValue}>{msg.data.slot}</ThemedText>
                  </View>
                  <View style={styles.summaryItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <MapPin size={14} color="#71796F" />
                      <ThemedText style={styles.summaryLabel}>Location</ThemedText>
                    </View>
                    <ThemedText style={styles.summaryValue}>{msg.data.location}</ThemedText>
                  </View>
                  <View style={styles.summaryItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <DollarSign size={14} color="#71796F" />
                      <ThemedText style={styles.summaryLabel}>Estimated Cost</ThemedText>
                    </View>
                    <ThemedText style={[styles.summaryValue, { color: theme.primary }]}>
                      {msg.data.estimated_cost}
                    </ThemedText>
                  </View>

                  <View style={{ backgroundColor: '#F9FAFB', padding: 8, borderRadius: 8, marginTop: 10 }}>
                    <ThemedText style={{ fontSize: 13, color: '#374151', fontStyle: 'italic', textAlign: 'center' }}>
                      "{msg.data.confirmation_message}"
                    </ThemedText>
                  </View>
                </View>
              );
            }

            if (msg.cardType === 'reminder_set') {
              return (
                <View key={msg.id} style={[styles.summaryCard, { backgroundColor: '#FFFFFF', borderColor: '#FEF08A' }]}>
                  <View style={[styles.summaryHeader, { backgroundColor: '#FEF9C3' }]}>
                    <Bell size={20} color="#CA8A04" />
                    <ThemedText style={[styles.summaryTitle, { color: '#854D0E' }]}>
                      🔔 Reminders Scheduled
                    </ThemedText>
                  </View>
                  
                  <View style={{ paddingVertical: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6 }}>
                      <Clock size={16} color="#71796F" />
                      <View style={{ flex: 1 }}>
                        <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#374151' }}>
                          Tonight 8:00 PM (Night Before)
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                          {msg.data.reminders_scheduled?.[0]?.message || 'Kal subah time pe service provider aayega. Tayyar rahein!'}
                        </ThemedText>
                      </View>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 6 }}>
                      <Clock size={16} color="#71796F" />
                      <View style={{ flex: 1 }}>
                        <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#374151' }}>
                          Tomorrow 9:00 AM (1 Hour Before)
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                          {msg.data.reminders_scheduled?.[1]?.message || 'Yaad dihani: 1 ghante mein provider aa raha hai!'}
                        </ThemedText>
                      </View>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 6 }}>
                      <Clock size={16} color="#71796F" />
                      <View style={{ flex: 1 }}>
                        <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#374151' }}>
                          Tomorrow 12:00 PM (Completion Check)
                        </ThemedText>
                        <ThemedText style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                          {msg.data.follow_up?.message || 'Kya service complete ho gayi? Apna feedback dein!'}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }

            if (msg.cardType === 'agent_trace') {
              return (
                <AgentTraceCard 
                  key={msg.id} 
                  trace={msg.data} 
                  executionTime={msg.executionTime} 
                />
              );
            }
          }

          return null;
        })}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {renderAgentLoader()}
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
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!isSending}
            />
            {isSending ? (
              <ActivityIndicator size="small" color={theme.textSecondary} />
            ) : (
              <Mic size={20} color={theme.textSecondary} />
            )}
          </View>
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: theme.primary }]}
            onPress={handleSend}
            disabled={isSending || !message.trim()}
          >
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
  floatingLoaderContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  floatingLoaderCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  floatingLoaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  floatingLoaderStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginTop: 2,
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
