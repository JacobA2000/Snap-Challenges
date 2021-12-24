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
import { colorScheme, backgroundColor, textColor, altColor1, altColor2 } from '../theme-handler.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUpDetailsForm = ()  => {
  return (
    <View style={GlobalStyles.container}>
        <Text style={styles.tagLine}>SIGN UP DETAILS!</Text>
        <Image style={GlobalStyles.avatarImage} source={{uri: 'https://pickaface.net/gallery/avatar/unr_test_180821_0925_9k0pgs.png'}} />
        <TextInput style={styles.textInput} placeholder="First Name" />
        <TextInput style={styles.textInput} placeholder="Last Name" />
        <TextInput style={styles.textInput} placeholder="Email" />
    </View>
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

    placeholderTextColor: textColor,
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

export default SignUpDetailsForm;