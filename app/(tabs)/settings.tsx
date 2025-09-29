import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sun, Moon, Trash2, RotateCcw } from 'lucide-react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setDarkMode(parsed.darkMode ?? true);
        setSoundEnabled(parsed.soundEnabled ?? true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await saveSettings({ darkMode: newValue, soundEnabled });
  };

  const toggleSound = async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    await saveSettings({ darkMode, soundEnabled: newValue });
  };

  const clearAllData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const checklistKeys = keys.filter(key => key.startsWith('checklist_'));
      await AsyncStorage.multiRemove([...checklistKeys, 'currentChecklist']);
      console.log('Toutes les données ont été effacées');
    } catch (error) {
      console.error('Erreur lors de l\'effacement des données:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Paramètres</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affichage</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              {darkMode ? 
                <Moon size={24} color="#F39C12" /> : 
                <Sun size={24} color="#F39C12" />
              }
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Mode sombre</Text>
                <Text style={styles.settingDescription}>
                  Optimisé pour l'utilisation en cockpit
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#BDC3C7', true: '#27AE60' }}
              thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Sons de validation</Text>
                <Text style={styles.settingDescription}>
                  Feedback audio lors de la validation des étapes
                </Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#BDC3C7', true: '#27AE60' }}
              thumbColor={soundEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Données</Text>
          
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={clearAllData}
          >
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={styles.dangerButtonText}>
              Effacer toutes les données
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Check-list JRO</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoDescription}>
            Application développée pour les pilotes afin d'assurer 
            un suivi rigoureux des procédures de vol.
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
  },
  section: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 2,
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#BDC3C7',
    marginBottom: 15,
  },
  appInfoDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});