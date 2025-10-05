import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, RotateCcw, CheckCircle, Circle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSettings } from '@/contexts/SettingsContext';
import { LightTheme, DarkTheme } from '@/constants/Colors';

// Données des check-lists prédéfinies
const checklistData = {
  prevol: {
    title: 'Check-list Prévol',
    items: [
      'Documentation de vol vérifiée',
      'Contrôle extérieur effectué',
      'Contrôle visuel moteur effectué',
      'Essence vérifiée (quantité et qualité)',
      'Niveaux d\'huile vérifiés',
      'Gouvernes libres et dégagées',
      'Instruments et commutateurs sur OFF',
    ],
  },
  demarrage: {
    title: 'Check-list Démarrage',
    items: [
      'Frein de parking ON',
      'Commande de vol bloquée en avant',
      'Batterie principale ON',
      'Pompe à essence électrique ON',
      'Magnetos sur BOTH',
      'Contacteur de démarrage ENGAGE',
      'Huile pressurisation OK',
      'Réglage QNH',
      'Radio ON et fréquence réglée',
      'Huile Température 55°C minimum',
    ],
  },
  roulage: {
    title: 'Check-list Roulage',
    items: [
      'Frein de parking OFF',
      'Freins testés',
      'Instruments de vol vérifiés',
      'Transpondeur réglé',
      'Radio communication testée',
      'Trim ajusté pour le décollage',
      'Vent vérifié',
      'Annonce radio roulage',
    ],
  },
  entreepiste: {
    title: 'Check-list Préparation entrée piste',
    items: [
      'Ceintures et harnais attachés',
      'Porte et verrière fermées et verrouillées',
      'Piste libre et dégagée',
      'Vent vérifié',
      'Breifing passager effectué',
      'Radio alignement prelancement',
    ],
  },
  decollage: {
    title: 'Check-list Décollage',
    items: [
      'Frein rotor OFF',
      'Manche libre et en avant',
      '2000 tr/min atteints',
      'Pré-lancement ON',
      'Rotor 150 tr/min manche arrière',
      'Rotor 220 tr/min',
      'Pré-lancement OFF',
      'Puissance maximale',
      'Vitesse de décollage atteinte',
      'Montée initiale',
    ],
  },
  approche: {
    title: 'Check-list Approche',
    items: [
      'Vérification météo',
      'Vérification VAC',
      'Radio annonce approche',
    ],
  },
  atterrissage: {
    title: 'Check-list Atterrissage',
    items: [
      'Verticale terrain',
      'Vent vérifié',
      'Circuit d\'atterrissage intégré',
      'Vitesse d\'approche maintenue',
      'Piste alignée',
      'Arrondi et flare',
      'Freinage et roulage',
      'Manche dans le vent',
      'Frein rotor ON',
    ],
  },
};

interface ChecklistItem {
  text: string;
  completed: boolean;
}

export default function ChecklistScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { settings } = useSettings();
  const colors = settings.darkMode ? DarkTheme : LightTheme;
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [progress, setProgress] = useState(0);

  const checklistId = Array.isArray(id) ? id[0] : id;
  const checklist = checklistData[checklistId as keyof typeof checklistData];

  useEffect(() => {
    if (checklist) {
      loadChecklist();
    }
  }, [checklistId]);

  const loadChecklist = async () => {
    try {
      const stored = await AsyncStorage.getItem(`checklist_${checklistId}`);
      let checklistItems: ChecklistItem[];

      if (stored) {
        checklistItems = JSON.parse(stored);
      } else {
        checklistItems = checklist.items.map(item => ({
          text: item,
          completed: false,
        }));
        await AsyncStorage.setItem(
          `checklist_${checklistId}`, 
          JSON.stringify(checklistItems)
        );
      }

      setItems(checklistItems);
      calculateProgress(checklistItems);

      // Sauvegarder comme check-list active
      const currentChecklist = {
        id: checklistId,
        title: checklist.title,
        items: checklistItems,
      };
      await AsyncStorage.setItem('currentChecklist', JSON.stringify(currentChecklist));
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const calculateProgress = (checklistItems: ChecklistItem[]) => {
    const completed = checklistItems.filter(item => item.completed).length;
    const total = checklistItems.length;
    const progressPercent = total > 0 ? (completed / total) * 100 : 0;
    setProgress(progressPercent);
  };

  const toggleItem = async (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;

    setItems(updatedItems);
    calculateProgress(updatedItems);

    if (settings.soundEnabled && Platform.OS !== 'web') {
      try {
        if (updatedItems[index].completed) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch (error) {
        console.error('Erreur haptics:', error);
      }
    }

    try {
      await AsyncStorage.setItem(
        `checklist_${checklistId}`,
        JSON.stringify(updatedItems)
      );

      const currentChecklist = {
        id: checklistId,
        title: checklist.title,
        items: updatedItems,
      };
      await AsyncStorage.setItem('currentChecklist', JSON.stringify(currentChecklist));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const resetChecklist = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Êtes-vous sûr de vouloir remettre à zéro toutes les étapes ?')) {
        performReset();
      }
    } else {
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
    }
  };

  const performReset = async () => {
    const resetItems = items.map(item => ({
      ...item,
      completed: false,
    }));

    setItems(resetItems);
    setProgress(0);

    try {
      await AsyncStorage.setItem(
        `checklist_${checklistId}`, 
        JSON.stringify(resetItems)
      );

      // Mettre à jour la check-list courante
      const currentChecklist = {
        id: checklistId,
        title: checklist.title,
        items: resetItems,
      };
      await AsyncStorage.setItem('currentChecklist', JSON.stringify(currentChecklist));
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  };

  if (!checklist) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.danger }]}>Check-list introuvable</Text>
      </SafeAreaView>
    );
  }

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>{checklist.title}</Text>
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

        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.danger }]}
          onPress={resetChecklist}
        >
          <RotateCcw size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.checklistContainer}
        contentContainerStyle={styles.checklistContent}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.checklistItem,
              { backgroundColor: colors.cardBackground, borderLeftColor: colors.textSecondary },
              item.completed && { backgroundColor: colors.completedBackground, borderLeftColor: colors.completedBorder }
            ]}
            onPress={() => toggleItem(index)}
            activeOpacity={0.7}
          >
            <View style={styles.checkButton}>
              {item.completed ? (
                <CheckCircle size={24} color={colors.success} />
              ) : (
                <Circle size={24} color={colors.textSecondary} />
              )}
            </View>

            <Text style={[
              styles.itemText,
              { color: colors.text },
              item.completed && { color: colors.textSecondary, textDecorationLine: 'line-through' }
            ]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}

        {progress === 100 && (
          <View style={[styles.completedBanner, { backgroundColor: colors.success }]}>
            <CheckCircle size={32} color="#FFFFFF" />
            <Text style={styles.completedBannerText}>
              Check-list terminée !
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    padding: 8,
    borderRadius: 6,
  },
  checklistContainer: {
    flex: 1,
  },
  checklistContent: {
    padding: 20,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  checkButton: {
    marginRight: 16,
    width: 32,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  completedBanner: {
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  completedBannerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});