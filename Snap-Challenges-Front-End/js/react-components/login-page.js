// REACT IMPORTS
import React, {useState} from 'react';
import { Dimensions, StyleSheet, Text , Image, TextInput, Button, TouchableHighlight, View } from 'react-native';

// STYLE IMPORTS
import GlobalStyles from '../global-styles.js';
import { textColor, statusBarTheme, altColor1, backgroundColor } from '../theme-handler.js';

// EXPO IMPORTS
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
import { StatusBar } from 'expo-status-bar';

import { SafeAreaView } from 'react-native-safe-area-context';

import base64 from 'base-64';

// MY IMPORTS
// import { GoogleApi } from '../google-api-handler.js';
import globalStyles from '../global-styles.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation })  => {
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: '918375695632-au8sr5oebk32remoefi1d4m3c8suludp.apps.googleusercontent.com',
  //   iosClientId: '918375695632-lj5c0c0187gb06om7p2rqoovnrm055hp.apps.googleusercontent.com',
  //   androidClientId: '918375695632-kfdjlaes6gfbtnillksad5bjk00s2rf6.apps.googleusercontent.com',
  //   webClientId: '918375695632-euu2cqvfnut4tm06c54ee5o57j6b0k9t.apps.googleusercontent.com',
  // });

  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');

  function handleLoginButtonClick() {
    alert("Username = " + username + " Password = " + password);

    fetch('http://localhost:5000/api/login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64.encode(username + ':' + password)
      }
    }).then(response => {
      console.log(response.json());
    });

  }

  function handleSignUpButtonClick() {
    navigation.navigate('SignUp');
  }
  
  // React.useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { authentication } = response;
  //     const { accessToken } = authentication;

  //     let googleApi = new GoogleApi(accessToken);
  //     googleApi.getUserData(accessToken)
  //       .then(userData => {
  //         console.log(userData);
  //       }
  //     );
  //     navigation.navigate('SignUpDetailsForm');
  //   }
  // }, [response]);

  return (
    <SafeAreaView style={GlobalStyles.centeredContainer}>
        <StatusBar style={statusBarTheme} />
        <Image style={styles.logo} source={require('../../assets/snap-challenges-logos/small-logo.png')} />
        <Text style={styles.tagLine}>A COLLABORATIVE PHOTOGRPAHY EXPERIENCE</Text>
        {/* <TouchableOpacity style={styles.loginButton} disabled={!request} title="Login" onPress={() => {promptAsync();}}>
            <Image style={styles.googleLoginImage}source={require('../../assets/google-sign-in-buttons/btn_google_signin_dark_normal_web.png')}/>
        </TouchableOpacity>      */}
        <TextInput 
          style={styles.loginTextBox} 
          placeholder="Username" 
          placeholderTextColor={textColor} 
          value={username}
          onChangeText={usernameText => setUsername(usernameText)}>
        </TextInput>
        <TextInput 
          style={styles.loginTextBox} 
          placeholder="Password" 
          placeholderTextColor={textColor} 
          secureTextEntry={true} 
          value={password}
          onChangeText={passwordText => setPassword(passwordText)}>    
        </TextInput>
        <TouchableHighlight style={styles.loginButton} onPress={() => handleLoginButtonClick()}>
          <Text style={styles.loginButtonText}>Login!</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.loginButton} onPress={() => handleSignUpButtonClick()}>
          <Text style={styles.loginButtonText}>Sign up!</Text>
        </TouchableHighlight>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: windowHeight * 0.3,
    height: windowHeight * 0.3,
  },

  tagLine: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: textColor,

    width: windowWidth * 0.75,
    paddingVertical: 25
  },

  // googleLoginImage: {
  //   width: 191,
  //   height: 46,
  // },

  loginTextBox: {
    height: windowHeight * 0.075,
    width: windowWidth * 0.8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: altColor1,
    backgroundColor: backgroundColor,
    color: textColor,
    fontSize: 20,
    fontFamily: 'Roboto',
    paddingLeft: 10,
    paddingRight: 10,

    marginVertical: 5,
  },

  loginButton: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.1,
    backgroundColor: altColor1,
    textAlign: 'center',
    color: textColor,
    fontSize: 20,
    fontFamily: 'Roboto',
    borderRadius: 10,
    
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    fontSize: 20,
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontWeight: 'bold',
    color: textColor,
  },

});

export default Login;