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
import BottomBar from './global-components/bottombar.js';
import ImageGrid from './global-components/imagegrid.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TestPage = ()  => {

  let image_path = "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60";

  let imgs = [image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path]

  return (
    <SafeAreaView style={ GlobalStyles.listContainer }>
          <StatusBar style={ statusBarTheme } />
          <TopBar />
          <ImageGrid images={imgs} />
          <BottomBar />
    </SafeAreaView>
  );
}

export default TestPage;