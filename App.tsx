/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import SettingsProvider from './src/contexts/SettingsContext';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
