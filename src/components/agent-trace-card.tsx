import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ThemedText } from './themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ChevronDown, ChevronUp, Cpu, CheckCircle2, XCircle } from 'lucide-react-native';

// Enable layout animations for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TraceStep {
  step: number;
  agent: string;
  status: string;
  summary: string;
  timestamp: string;
}

interface AgentTraceCardProps {
  trace: TraceStep[];
  executionTime?: number;
}

export const AgentTraceCard: React.FC<AgentTraceCardProps> = ({ trace, executionTime }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const formatStepTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  if (!trace || trace.length === 0) return null;

  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: '#FFFFFF' }]}>
      {/* Header (Tappable Area) */}
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpand} 
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
            <Cpu size={18} color={theme.primary} />
          </View>
          <View>
            <ThemedText style={styles.title}>🤖 Agentic Reasoning Log</ThemedText>
            {executionTime && (
              <ThemedText style={styles.subtitle}>
                Executed in {executionTime}ms • {trace.length} steps completed
              </ThemedText>
            )}
          </View>
        </View>
        {expanded ? (
          <ChevronUp size={20} color={theme.textSecondary} />
        ) : (
          <ChevronDown size={20} color={theme.textSecondary} />
        )}
      </TouchableOpacity>

      {/* Expanded Step-by-Step Logs */}
      {expanded && (
        <View style={styles.content}>
          <View style={styles.timeline}>
            {trace.map((step, index) => {
              const isLast = index === trace.length - 1;
              const isSuccess = step.status === 'success';

              return (
                <View key={step.step || index} style={styles.stepRow}>
                  {/* Left Column (Timeline Line & Dot) */}
                  <View style={styles.leftCol}>
                    <View style={[
                      styles.dot, 
                      { backgroundColor: isSuccess ? '#DCFCE7' : '#FEE2E2' }
                    ]}>
                      {isSuccess ? (
                        <CheckCircle2 size={14} color="#15803D" />
                      ) : (
                        <XCircle size={14} color="#B91C1C" />
                      )}
                    </View>
                    {!isLast && <View style={[styles.line, { backgroundColor: theme.border }]} />}
                  </View>

                  {/* Right Column (Step details) */}
                  <View style={styles.rightCol}>
                    <View style={styles.stepHeader}>
                      <ThemedText style={styles.stepTitle}>
                        Step {step.step}: {step.agent.replace('_', ' ')}
                      </ThemedText>
                      <ThemedText style={styles.stepTime}>
                        {formatStepTimestamp(step.timestamp)}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.stepSummary}>
                      {step.summary}
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: Spacing.two,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#075E54',
  },
  subtitle: {
    fontSize: 11,
    color: '#71796F',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  timeline: {
    marginTop: Spacing.two,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 50,
  },
  leftCol: {
    alignItems: 'center',
    width: 24,
    marginRight: Spacing.two,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  rightCol: {
    flex: 1,
    paddingBottom: Spacing.three,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  stepTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  stepSummary: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
});
