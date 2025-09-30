import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RotateCcw, CheckCircle } from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { LightTheme, DarkTheme } from '@/constants/Colors';

export default function CurrentChecklistScreen() {
  const { settings } = useSettings();
  const colors = settings.darkMode ? DarkTheme : LightTheme;
  const [currentChecklist, setCurrentChecklist] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadCurrentChecklist();
  }, []);

  const loadCurrentChecklist = async () => {
    try {
      const stored = await AsyncStorage.getItem('currentChecklist');
      if (stored) {
        const checklist = JSON.parse(stored);
        setCurrentChecklist(checklist);
        calculateProgress(checklist);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const calculateProgress = (checklist: any) => {
    if (!checklist || !checklist.items) return;
    
    const completed = checklist.items.filter((item: any) => item.completed).length;
    const total = checklist.items.length;
    const progressPercent = total > 0 ? (completed / total) * 100 : 0;
    setProgress(progressPercent);
  };

  const resetChecklist = () => {
    Alert.alert(
      'Réinitialiser la check-list',
      'Êtes-vous sûr de vouloir remettre à zéro toutes les étapes ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Réinitialiser', 
          style: 'destructive',
          onPress: performReset 
        },
      ]
    );
  };

  const performReset = async () => {
    if (!currentChecklist) return;

    const resetChecklist = {
      ...currentChecklist,
      items: currentChecklist.items.map((item: any) => ({
        ...item,
        completed: false,
      })),
    };

    try {
      await AsyncStorage.setItem('currentChecklist', JSON.stringify(resetChecklist));
      setCurrentChecklist(resetChecklist);
      calculateProgress(resetChecklist);
      
      // Also update the main storage
      await AsyncStorage.setItem(
        `checklist_${currentChecklist.id}`, 
        JSON.stringify(resetChecklist.items)
      );
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  };

  if (!currentChecklist) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <CheckCircle size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucune check-list active</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Sélectionnez une check-list depuis l'accueil pour commencer
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const completedCount = currentChecklist.items.filter((item: any) => item.completed).length;
  const totalCount = currentChecklist.items.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{currentChecklist.title}</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.progressBar }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: colors.success }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {completedCount}/{totalCount} ({Math.round(progress)}%)
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.danger }]}
          onPress={resetChecklist}
        >
          <RotateCcw size={20} color="#FFFFFF" />
          <Text style={styles.resetButtonText}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        {progress === 100 ? (
          <View style={[styles.completedBanner, { backgroundColor: colors.success }]}>
            <CheckCircle size={24} color="#FFFFFF" />
            <Text style={styles.completedText}>Check-list terminée !</Text>
          </View>
        ) : (
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            Progression: {completedCount} étapes sur {totalCount} complétées
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  summary: {
    paddingHorizontal: 20,
  },
  completedBanner: {
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  summaryText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});