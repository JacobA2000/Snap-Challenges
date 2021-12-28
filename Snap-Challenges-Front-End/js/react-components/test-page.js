// REACT IMPORTS
import React from 'react';
import { 
  Dimensions, 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  Image
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { SafeAreaView } from 'react-native-safe-area-context';

// STYLE IMPORTS
import GlobalStyles from '../global-styles.js';
import { statusBarTheme } from '../theme-handler.js';

import TopBar from './global-components/topbar.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TestPage = ()  => {
  return (
    <SafeAreaView style={ GlobalStyles.listContainer }>
        <StatusBar style={ statusBarTheme } />
        <TopBar />
        <Image style={GlobalStyles.avatarImage} source={{uri: 'https://pickaface.net/gallery/avatar/unr_test_180821_0925_9k0pgs.png'}} />
    </SafeAreaView>
  );
}

export default TestPage;