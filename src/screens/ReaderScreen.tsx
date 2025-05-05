import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;

const ReaderScreen = ({ route, navigation }: Props) => {
  const { filePath } = route.params;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isBionicEnabled, setIsBionicEnabled] = useState(false);
  const [isFocusModeEnabled, setIsFocusModeEnabled] = useState(false);

  useEffect(() => {
    // Load last read page
    const loadLastPage = async () => {
      try {
        const lastPage = await AsyncStorage.getItem(`lastPage_${filePath}`);
        if (lastPage) {
          setCurrentPage(parseInt(lastPage, 10));
        }
      } catch (error) {
        console.error('Error loading last page:', error);
      }
    };
    loadLastPage();
  }, [filePath]);

  const saveCurrentPage = async (page: number) => {
    try {
      await AsyncStorage.setItem(`lastPage_${filePath}`, page.toString());
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: filePath }}
        style={styles.pdf}
        page={currentPage}
        onPageChanged={(page) => {
          setCurrentPage(page);
          saveCurrentPage(page);
        }}
        onLoadComplete={(numberOfPages) => {
          setTotalPages(numberOfPages);
        }}
        enablePaging={true}
        horizontal={false}
      />
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsBionicEnabled(!isBionicEnabled)}
        >
          <Icon
            name={isBionicEnabled ? 'format-bold' : 'format-bold-off'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsFocusModeEnabled(!isFocusModeEnabled)}
        >
          <Icon
            name={isFocusModeEnabled ? 'center-focus-strong' : 'center-focus-weak'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          {currentPage} / {totalPages}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  pageInfo: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
});

export default ReaderScreen; 