// REACT IMPORTS
import React from 'react';
import { Dimensions, View } from 'react-native';

// STYLE IMPORTS
import GlobalStyles from './js/global-styles.js';

// COMPONENT IMPORTS
import Login from './js/react-components/login.js';

// EXPO IMPORTS
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={GlobalStyles.container}>
      <Login />
      <StatusBar style="auto" />
    </View>
  );
}