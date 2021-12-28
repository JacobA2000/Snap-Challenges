// REACT IMPORTS
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity , Image } from 'react-native';

// STYLE IMPORTS
import GlobalStyles from '../global-styles.js';
import { textColor, statusBarTheme } from '../theme-handler.js';

// EXPO IMPORTS
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// MY IMPORTS
import { GoogleApi } from '../google-api-handler.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation })  => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '918375695632-au8sr5oebk32remoefi1d4m3c8suludp.apps.googleusercontent.com',
    iosClientId: '918375695632-lj5c0c0187gb06om7p2rqoovnrm055hp.apps.googleusercontent.com',
    androidClientId: '918375695632-kfdjlaes6gfbtnillksad5bjk00s2rf6.apps.googleusercontent.com',
    webClientId: '918375695632-euu2cqvfnut4tm06c54ee5o57j6b0k9t.apps.googleusercontent.com',
  });
  
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const { accessToken } = authentication;

      let googleApi = new GoogleApi(accessToken);
      googleApi.getUserData(accessToken)
        .then(userData => {
          console.log(userData);
        }
      );
      
      navigation.navigate('SignUpDetailsForm');
    }
  }, [response]);

  return (
    <SafeAreaView style={GlobalStyles.centeredContainer}>
        <StatusBar style={statusBarTheme} />
        <Image style={styles.logo} source={require('../../assets/snap-challenges-logos/small-logo.png')} />
        <Text style={styles.tagLine}>A COLLABORATIVE PHOTOGRPAHY EXPERIENCE</Text>
        <TouchableOpacity style={styles.loginButton} disabled={!request} title="Login" onPress={() => {promptAsync();}}>
            <Image style={styles.googleLoginImage}source={require('../../assets/google-sign-in-buttons/btn_google_signin_dark_normal_web.png')}/>
        </TouchableOpacity>     
    </SafeAreaView>
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

export default Login;