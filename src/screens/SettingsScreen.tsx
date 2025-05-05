import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Settings {
  bionicReading: boolean;
  focusMode: boolean;
  fontSize: number;
  lineSpacing: number;
  fontFamily: string;
  theme: 'light' | 'dark';
}

const defaultSettings: Settings = {
  bionicReading: false,
  focusMode: false,
  fontSize: 16,
  lineSpacing: 1.5,
  fontFamily: 'System',
  theme: 'light',
};

const fontOptions = [
  { label: 'System Default', value: 'System' },
  { label: 'OpenDyslexic', value: 'OpenDyslexic' },
  { label: 'Lexend', value: 'Lexend' },
];

const SettingsScreen = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('readerSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('readerSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reading Assistance</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Bionic Reading</Text>
          <Switch
            value={settings.bionicReading}
            onValueChange={(value) => updateSetting('bionicReading', value)}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Focus Mode</Text>
          <Switch
            value={settings.focusMode}
            onValueChange={(value) => updateSetting('focusMode', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Typography</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Font Family</Text>
          <View style={styles.fontSelector}>
            {fontOptions.map((font) => (
              <TouchableOpacity
                key={font.value}
                style={[
                  styles.fontOption,
                  settings.fontFamily === font.value && styles.selectedFont,
                ]}
                onPress={() => updateSetting('fontFamily', font.value)}
              >
                <Text style={[
                  styles.fontOptionText,
                  settings.fontFamily === font.value && styles.selectedFontText,
                ]}>
                  {font.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Font Size</Text>
          <View style={styles.sizeControls}>
            <TouchableOpacity
              onPress={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 1))}
              style={styles.sizeButton}
            >
              <Icon name="remove" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.sizeValue}>{settings.fontSize}</Text>
            <TouchableOpacity
              onPress={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 1))}
              style={styles.sizeButton}
            >
              <Icon name="add" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Theme</Text>
          <View style={styles.themeSelector}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                settings.theme === 'light' && styles.selectedTheme,
              ]}
              onPress={() => updateSetting('theme', 'light')}
            >
              <Text style={styles.themeText}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                settings.theme === 'dark' && styles.selectedTheme,
              ]}
              onPress={() => updateSetting('theme', 'dark')}
            >
              <Text style={styles.themeText}>Dark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  fontSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fontOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedFont: {
    backgroundColor: '#007AFF',
  },
  fontOptionText: {
    color: '#333',
  },
  selectedFontText: {
    color: '#fff',
  },
  sizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeButton: {
    padding: 5,
  },
  sizeValue: {
    fontSize: 16,
    marginHorizontal: 15,
    color: '#333',
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  themeOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedTheme: {
    backgroundColor: '#007AFF',
  },
  themeText: {
    color: '#333',
  },
});

export default SettingsScreen; 