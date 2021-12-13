import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity , Image } from 'react-native';
import { colorScheme, backgroundColor, textColor, altColor1, altColor2 } from './js/theme-handler.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('./assets/snap-challenges-logos/small-logo.png')} />
        <Text style={styles.tagLine}>A COLLABORATIVE PHOTOGRPAHY EXPERIENCE {colorScheme}</Text>
        <TouchableOpacity style={styles.loginButton} title="Login" onPress={()=>{alert("you clicked me")}}>
          <Image style={styles.googleLoginImage}source={require('./assets/google-sign-in-buttons/btn_google_signin_dark_normal_web.png')}/>
        </TouchableOpacity>
        
      </View>
    );
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <Login/>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  },

  loginButton: {
    width: 191,
    height: 46,
  },

  googleLoginImage: {
    width: 191,
    height: 46,
  },
});
