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
import globalStyles from '../global-styles.js';
import { storeValueInAsyncStorage } from '../AsyncStorage-Handler.js';
import { API_URL } from '../serverconf.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = ({ navigation })  => {

  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');

  function handleLoginButtonClick() {
    fetch( API_URL + 'login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64.encode(username + ':' + password)
      }
    }).then(response => {
      response.json().then(data => ({
        data: data,
        status: response.status
      }))
      .then(res => {
        if (res.status === 200) {
          storeValueInAsyncStorage('@token', res.data.token);
          storeValueInAsyncStorage('@refreshToken', res.data.refresh_token);

          let decodedToken = jwt_decode(token);
          storeValueInAsyncStorage('@public_id', decodedToken.public_id);

          navigation.navigate('Challenges');
        } else {
          alert('Invalid username or password');
        }
      });
    }).catch(error => {
      console.log(error);
    });
  }

  function handleSignUpButtonClick() {
    navigation.navigate('SignUp');
  }

  return (
    <SafeAreaView style={GlobalStyles.centeredContainer}>
        <StatusBar style={statusBarTheme} />
        <Image style={styles.logo} source={require('../../assets/snap-challenges-logos/small-logo.png')} />
        <Text style={styles.tagLine}>A COLLABORATIVE PHOTOGRPAHY EXPERIENCE</Text>
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