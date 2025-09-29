import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, RotateCcw, CheckCircle, Circle } from 'lucide-react-native';

// Données des check-lists prédéfinies
const checklistData = {
  prevol: {
    title: 'Check-list Prévol',
    items: [
      'Documentation de vol vérifiée',
      'Contrôle extérieur de l\'avion effectué',
      'Essence vérifiée (quantité et qualité)',
      'Niveaux d\'huile vérifiés',
      'Gouvernes libres et dégagées',
      'Instruments et commutateurs sur OFF',
      'Ceintures et harnais attachés',
      'Porte et verrière fermées et verrouillées',
    ],
  },
  demarrage: {
    title: 'Check-list Démarrage',
    items: [
      'Batterie principale ON',
      'Pompe à essence électrique ON',
      'Mélange RICHE',
      'Hélice PETITE PROFONDEUR',
      'Magnetos sur BOTH',
      'Contacteur de démarrage ENGAGE',
      'Huile pressurisation OK',
      'Générateur ON',
    ],
  },
  roulage: {
    title: 'Check-list Roulage',
    items: [
      'Freins testés',
      'Instruments de vol vérifiés',
      'Compas magnétique ajusté',
      'Transpondeur réglé',
      'Radio communication testée',
      'Contrôles de vol libres',
      'Trim ajusté pour le décollage',
      'Volets positionnés',
    ],
  },
  decollage: {
    title: 'Check-list Décollage',
    items: [
      'Piste libre et dégagée',
      'Vent vérifié',
      'Volets configurés',
      'Trim réglé',
      'Magnetos vérifiés',
      'Mélange ajusté',
      'Pleine puissance appliquée',
      'Vitesse de rotation atteinte',
    ],
  },
  atterrissage: {
    title: 'Check-list Atterrissage',
    items: [
      'Circuit d\'atterrissage intégré',
      'Train d\'atterrissage sorti',
      'Volets configurés',
      'Mélange ajusté',
      'Vitesse d\'approche maintenue',
      'Piste alignée',
      'Arrondi et flare',
      'Freinage et roulage',
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

    try {
      await AsyncStorage.setItem(
        `checklist_${checklistId}`, 
        JSON.stringify(updatedItems)
      );

      // Mettre à jour la check-list courante aussi
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
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Check-list introuvable</Text>
      </SafeAreaView>
    );
  }

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>{checklist.title}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completedCount}/{totalCount} ({Math.round(progress)}%)
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.resetButton}
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
              item.completed && styles.completedItem
            ]}
            onPress={() => toggleItem(index)}
            activeOpacity={0.7}
          >
            <View style={styles.checkButton}>
              {item.completed ? (
                <CheckCircle size={24} color="#27AE60" />
              ) : (
                <Circle size={24} color="#BDC3C7" />
              )}
            </View>
            
            <Text style={[
              styles.itemText,
              item.completed && styles.completedText
            ]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}

        {progress === 100 && (
          <View style={styles.completedBanner}>
            <CheckCircle size={32} color="#27AE60" />
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
    backgroundColor: '#1A252F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#2C3E50',
    borderBottomWidth: 1,
    borderBottomColor: '#34495E',
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
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#34495E',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#BDC3C7',
    fontWeight: '600',
  },
  resetButton: {
    padding: 8,
    backgroundColor: '#E74C3C',
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
    backgroundColor: '#2C3E50',
    padding: 20,
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#BDC3C7',
  },
  completedItem: {
    backgroundColor: '#1E3A3A',
    borderLeftColor: '#27AE60',
  },
  checkButton: {
    marginRight: 16,
    width: 32,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    flex: 1,
  },
  completedText: {
    color: '#BDC3C7',
    textDecorationLine: 'line-through',
  },
  completedBanner: {
    backgroundColor: '#27AE60',
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
    color: '#E74C3C',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});