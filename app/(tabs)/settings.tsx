import React from 'react';
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
import { Sun, Moon, Trash2 } from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { LightTheme, DarkTheme } from '@/constants/Colors';

export default function SettingsScreen() {
  const { settings, updateDarkMode, updateSoundEnabled } = useSettings();
  const colors = settings.darkMode ? DarkTheme : LightTheme;

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Paramètres</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Affichage</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              {settings.darkMode ?
                <Moon size={24} color={colors.warning} /> :
                <Sun size={24} color={colors.warning} />
              }
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Mode sombre</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Optimisé pour l'utilisation en cockpit
                </Text>
              </View>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={updateDarkMode}
              trackColor={{ false: '#BDC3C7', true: colors.success }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Audio</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Sons de validation</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Feedback audio lors de la validation des étapes
                </Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={updateSoundEnabled}
              trackColor={{ false: '#BDC3C7', true: colors.success }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Données</Text>

          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: colors.danger }]}
            onPress={clearAllData}
          >
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={styles.dangerButtonText}>
              Effacer toutes les données
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={[styles.appInfoTitle, { color: colors.text }]}>Check-list JRO</Text>
          <Text style={[styles.appInfoVersion, { color: colors.textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.appInfoDescription, { color: colors.textSecondary }]}>
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
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  dangerButton: {
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
    marginBottom: 5,
  },
  appInfoVersion: {
    fontSize: 14,
    marginBottom: 15,
  },
  appInfoDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});