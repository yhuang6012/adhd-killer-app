import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      
      if (result[0]) {
        navigation.navigate('Reader', { filePath: result[0].uri });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        return;
      }
      console.error('Error picking document:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ADHD Reader</Text>
        <Text style={styles.subtitle}>Your reading companion</Text>
        
        <TouchableOpacity style={styles.button} onPress={pickDocument}>
          <Icon name="file-upload" size={24} color="#fff" />
          <Text style={styles.buttonText}>Open PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.settingsButton]} 
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings" size={24} color="#fff" />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    justifyContent: 'center',
  },
  settingsButton: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default HomeScreen; 