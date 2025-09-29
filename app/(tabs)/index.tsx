import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Plane, 
  PlayCircle, 
  Move3D, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react-native';

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
    id: 'decollage',
    title: 'Décollage',
    description: 'Procédures de décollage',
    icon: ArrowUp,
    color: '#27AE60',
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

  const handleChecklistSelect = (checklistId: string) => {
    router.push(`/checklist/${checklistId}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Check-lists Avion</Text>
          <Text style={styles.subtitle}>Sélectionnez une procédure</Text>
        </View>

        <View style={styles.checklistGrid}>
          {checklistTypes.map((checklist) => {
            const IconComponent = checklist.icon;
            return (
              <TouchableOpacity
                key={checklist.id}
                style={[styles.checklistCard, { borderLeftColor: checklist.color }]}
                onPress={() => handleChecklistSelect(checklist.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <IconComponent size={32} color={checklist.color} />
                  <Text style={styles.cardTitle}>{checklist.title}</Text>
                </View>
                <Text style={styles.cardDescription}>
                  {checklist.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
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
    backgroundColor: '#1A252F',
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
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
  },
  checklistGrid: {
    flex: 1,
  },
  checklistCard: {
    backgroundColor: '#2C3E50',
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#BDC3C7',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});