import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Plane,
  PlayCircle,
  Move3D,
  ArrowUp,
  ArrowDown,
  CheckCircle2
} from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { LightTheme, DarkTheme } from '@/constants/Colors';

const checklistTypes = [
  {
    id: 'prevol',
    title: 'Prévol',
    description: 'Vérifications avant vol',
    icon: Plane,
    color: '#3498DB',
  },
  {
    id: 'demarrage',
    title: 'Démarrage',
    description: 'Procédures de démarrage moteur',
    icon: PlayCircle,
    color: '#E67E22',
  },
  {
    id: 'roulage',
    title: 'Roulage',
    description: 'Préparation au roulage',
    icon: Move3D,
    color: '#9B59B6',
  },
  {
    id: 'entreepiste',
    title: 'Entrée piste',
    description: 'Procédures entrée de piste',
    icon: Move3D,
    color: '#9B59B6',
  },
  {
    id: 'decollage',
    title: 'Décollage',
    description: 'Procédures de décollage',
    icon: ArrowUp,
    color: '#27AE60',
  },
  {
    id: 'approche',
    title: 'Approche',
    description: 'Procédures d\'approche',
    icon: ArrowDown,
    color: '#E74C3C',
  },
  {
    id: 'atterrissage',
    title: 'Atterrissage',
    description: 'Procédures d\'atterrissage',
    icon: ArrowDown,
    color: '#E74C3C',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { settings } = useSettings();
  const colors = settings.darkMode ? DarkTheme : LightTheme;
  const [completedChecklists, setCompletedChecklists] = useState<Record<string, boolean>>({});
  const [progressPercentages, setProgressPercentages] = useState<Record<string, number>>({});

  const loadChecklistsProgress = async () => {
    const completed: Record<string, boolean> = {};
    const percentages: Record<string, number> = {};

    for (const checklist of checklistTypes) {
      try {
        const stored = await AsyncStorage.getItem(`checklist_${checklist.id}`);
        if (stored) {
          const items = JSON.parse(stored);
          const completedCount = items.filter((item: any) => item.completed).length;
          const percentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

          percentages[checklist.id] = percentage;
          completed[checklist.id] = percentage === 100;
        } else {
          percentages[checklist.id] = 0;
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        percentages[checklist.id] = 0;
      }
    }

    setProgressPercentages(percentages);
    setCompletedChecklists(completed);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadChecklistsProgress();
    }, [])
  );

  const handleChecklistSelect = (checklistId: string) => {
    router.push(`/checklist/${checklistId}` as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Check-lists JRO</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sélectionnez une procédure</Text>
        </View>

        <View style={styles.checklistGrid}>
          {checklistTypes.map((checklist) => {
            const IconComponent = checklist.icon;
            const isCompleted = completedChecklists[checklist.id];
            const percentage = progressPercentages[checklist.id] || 0;

            return (
              <TouchableOpacity
                key={checklist.id}
                style={[
                  styles.checklistCard,
                  { backgroundColor: colors.cardBackground, borderLeftColor: checklist.color },
                  isCompleted && { backgroundColor: colors.completedBackground }
                ]}
                onPress={() => handleChecklistSelect(checklist.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <IconComponent size={32} color={checklist.color} />
                  <View style={styles.cardTitleContainer}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{checklist.title}</Text>
                    <Text style={[styles.cardPercentage, { color: checklist.color }]}>
                      {percentage}%
                    </Text>
                  </View>
                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <CheckCircle2 size={20} color={colors.success} />
                    </View>
                  )}
                </View>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  {checklist.description}
                </Text>
                <View style={[styles.progressBarSmall, { backgroundColor: colors.progressBar }]}>
                  <View
                    style={[
                      styles.progressFillSmall,
                      { width: `${percentage}%`, backgroundColor: checklist.color }
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Voler en sécurité avec des check-lists structurées
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  checklistGrid: {
    flex: 1,
  },
  checklistCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  completedBadge: {
    backgroundColor: '#27AE6020',
    padding: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  progressBarSmall: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 2,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});