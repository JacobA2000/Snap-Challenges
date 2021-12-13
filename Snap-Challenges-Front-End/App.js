import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity , Image } from 'react-native';
import { colorScheme, backgroundColor, textColor, altColor1, altColor2 } from './js/theme-handler.js';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '918375695632-au8sr5oebk32remoefi1d4m3c8suludp.apps.googleusercontent.com',
    iosClientId: '918375695632-lj5c0c0187gb06om7p2rqoovnrm055hp.apps.googleusercontent.com',
    androidClientId: '918375695632-kfdjlaes6gfbtnillksad5bjk00s2rf6.apps.googleusercontent.com',
    webClientId: '918375695632-euu2cqvfnut4tm06c54ee5o57j6b0k9t.apps.googleusercontent.com',
  });
  
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('./assets/snap-challenges-logos/small-logo.png')} />
        <Text style={styles.tagLine}>A COLLABORATIVE PHOTOGRPAHY EXPERIENCE</Text>
        <TouchableOpacity style={styles.loginButton} disabled={!request} title="Login" onPress={() => {promptAsync();}}>
          <Image style={styles.googleLoginImage}source={require('./assets/google-sign-in-buttons/btn_google_signin_dark_normal_web.png')}/>
        </TouchableOpacity>     
      </View>
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

// import * as React from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { Button } from 'react-native';

// WebBrowser.maybeCompleteAuthSession();

// export default function App() {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: '918375695632-au8sr5oebk32remoefi1d4m3c8suludp.apps.googleusercontent.com',
//     iosClientId: '918375695632-lj5c0c0187gb06om7p2rqoovnrm055hp.apps.googleusercontent.com',
//     androidClientId: '918375695632-kfdjlaes6gfbtnillksad5bjk00s2rf6.apps.googleusercontent.com',
//     webClientId: '918375695632-euu2cqvfnut4tm06c54ee5o57j6b0k9t.apps.googleusercontent.com',
//   });

//   React.useEffect(() => {
//     if (response?.type === 'success') {
//       const { authentication } = response;
//       }
//   }, [response]);

//   return (
//     <Button
//       disabled={!request}
//       title="Login"
//       onPress={() => {
//         promptAsync();
//         }}
//     />
//   );
// }