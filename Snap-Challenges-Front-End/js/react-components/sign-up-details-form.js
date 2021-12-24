// REACT IMPORTS
import React from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity , Image } from 'react-native';

// STYLE IMPORTS
import GlobalStyles from '../global-styles.js';
import { colorScheme, backgroundColor, textColor, altColor1, altColor2 } from '../theme-handler.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUpDetailsForm = ()  => {
  return (
    <View style={GlobalStyles.container}>
        <Image style={styles.logo} source={require('../../assets/snap-challenges-logos/small-logo.png')} />
        <Text style={styles.tagLine}>SIGN UP DETAILS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: windowHeight * 0.5,
    height: windowHeight * 0.5,
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