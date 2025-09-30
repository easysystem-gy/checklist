import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  darkMode: boolean;
  soundEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateDarkMode: (value: boolean) => Promise<void>;
  updateSoundEnabled: (value: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    darkMode: true,
    soundEnabled: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({
          darkMode: parsed.darkMode ?? true,
          soundEnabled: parsed.soundEnabled ?? true,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  const updateDarkMode = async (value: boolean) => {
    await saveSettings({ ...settings, darkMode: value });
  };

  const updateSoundEnabled = async (value: boolean) => {
    await saveSettings({ ...settings, soundEnabled: value });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateDarkMode, updateSoundEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}