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

// STYLE IMPORTS
import GlobalStyles from '../global-styles.js';
import { textColor, altColor1, statusBarTheme } from '../theme-handler.js';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUp = ()  => {
  return (
    <SafeAreaView style={GlobalStyles.centeredContainer}>
        <StatusBar style={statusBarTheme} />
        <Text style={styles.tagLine}>SIGN UP DETAILS!</Text>
        <Image style={GlobalStyles.avatarImage} source={{uri: 'https://pickaface.net/gallery/avatar/unr_test_180821_0925_9k0pgs.png'}} />
        <TextInput style={styles.textInput} placeholder="First Name" />
        <TextInput style={styles.textInput} placeholder="Last Name" />
        <TextInput style={styles.textInput} placeholder="Email" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: windowHeight * 0.5,
    height: windowHeight * 0.5,
  },

  textInput: {
    width: windowWidth * 0.25,
    height: windowHeight * 0.1,

    backgroundColor: altColor1,
    color: textColor,

    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    padding: 10,
  },

  tagLine: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: textColor,

    width: windowWidth * 0.75,
    paddingVertical: 25
  }
});

export default SignUp;