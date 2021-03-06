// REACT IMPORTS
import React, { Component, useEffect } from 'react';

// REACT NAVIGATION IMPORTS
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

//OTHER IMPORTS
import jwt_decode from 'jwt-decode';

// PAGE COMPONENT IMPORTS
import Login from './js/react-components/login-page.js';
import SignUp from './js/react-components/sign-up-page.js';
import Profile from './js/react-components/profile-page.js';
import Challenges from './js/react-components/challenges-list-page.js';
import Post from './js/react-components/post-page.js';
import Challenge from './js/react-components/challenge-page.js';
import PostUpload from './js/react-components/post-upload-page.js';
import AddChallenge from './js/react-components/add-challenge-page.js';

import TestPage from './js/react-components/test-page.js';

// MY SCRIPT IMPORTS
import { getMultipleValuesFromAsyncStorage, getValueFromAsyncStorage, removeValueFromAsyncStorage, storeValueInAsyncStorage } from './js/AsyncStorage-Handler.js';
import { API_URL } from './js/serverconf.js';
import globalStates from './js/global-states.js';

import { navigationRef, navigate } from './js/NavigationService';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      isLoading: true,
      initRoute: 'Login',
    };
  }

  async refreshApiToken (refreshToken) {
    // GET NEW TOKEN FROM API REFRESH ENDPOINT
    fetch(API_URL + 'refreshtoken', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': refreshToken
      }
    }).then(response => {
      response.json().then(data => ({
        data: data,
        status: response.status
      }))
      .then(res => {
        if (res.status === 200) {

          let newToken = res.data.token;
          // store token on device
          //storeValueInAsyncStorage('@token', newToken);
          // store the token in memory global state
          globalStates.token = newToken;
          // store the public id in memory global state
          globalStates.public_id = jwt_decode(newToken).public_id;

          this.forceUpdate();

        } else {
          console.log('Invalid token');
        }
      });
    }).catch(error => {
      console.log(error);
    });
  }

  async checkIfRefreshNeeded (token) {
    // CHECK IF REFRESH NEEDED
    let decodedToken = jwt_decode(token);
    let currentTime = Math.floor(Date.now() / 1000);
    //Calculate time difference
    let timeDifference = decodedToken.exp - currentTime;

    console.log('Time difference: ' + timeDifference);

    if (timeDifference <= 300) {
      return true;
    } 

    return false;
  }

  componentDidMount() { 

    getMultipleValuesFromAsyncStorage(['@token', '@refreshToken']).then(tokens => {
      let token = tokens[0][1];
      //let refreshToken = tokens[1][1];

      // TIMER FOR REFRESHING TOKEN 
      // if(globalStates.token !== null) {
      //   this.refreshTimer = setInterval(() => {
      //     this.checkIfRefreshNeeded(globalStates.token).then(res => {
      //       if (res === true) {
      //         console.log('Refreshing token');
      //         this.refreshApiToken(refreshToken);
      //       }
      //     });
      //   }, 1 * 60 * 1000);
      // }

      // TIMER TO CHECK IF USER NEEDS TO BE RE LOGGED IN
      this.logoutTimer = setInterval(() => {

        console.log('Checking if user needs to be logged out');

        if(globalStates.token !== null) {
          console.log('Token is not null');

          let decodedToken = jwt_decode(globalStates.token);
          
          //Calculate time difference
          let currentTime = Math.floor(Date.now() / 1000);
          let timeDifference = decodedToken.exp - currentTime;
          console.log('Time difference: ' + timeDifference);

          if (timeDifference <= 120) {
            console.log('Logging out');
            globalStates.token = null;
            removeValueFromAsyncStorage('@token');
            removeValueFromAsyncStorage('@refreshToken');
            removeValueFromAsyncStorage('@public_id');
            navigate('Login');
          }

        }
      }, 1 * 60 * 1000);

      if (token) {

        globalStates.token = token;
        globalStates.public_id = jwt_decode(token).public_id;

        let decodedToken = jwt_decode(token);
        //let decodedRefreshToken = jwt_decode(refreshToken);

        // CHECK IF TOKEN EXPIRED 
        if (decodedToken.exp < Date.now() / 1000) {
          
          // OLD CODE FOR REFRESHING TOKEN REMOVED FOR NOW
          // console.log('Token expired - Attempting to refresh');
          // CHECK IF REFRESH TOKEN IS VALID
          // if (decodedRefreshToken.exp < Date.now() / 1000) {
          //   console.log('Refresh token expired - Logging out');
          //   this.setState({
          //     initRoute: 'Login',
          //     isLoading: false
          //   });
          // } else {
          //   // REFRESH TOKEN IS VALID - REFRESH TOKEN
          //   console.log('Refresh token is valid - Attempting to refresh token');
          //   this.refreshApiToken(refreshToken);
          // }

          console.log('Token expired - New login required');

          this.setState({
            initRoute: 'Login',
            isLoading: false
          });

        } else {
          console.log('Token valid');

          // STORE USER PUBLIC ID
          storeValueInAsyncStorage('@public_id', decodedToken.public_id);

          this.setState({
            initRoute: 'Challenges',
          });
        }
      }

      this.setState({
        isLoading: false,
      });
    });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    return (
      <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={this.state.initRoute}>
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
              <Stack.Screen name="Challenges" component={Challenges} options={{ headerShown: false }} />
              <Stack.Screen name="Post" component={Post} options={{ headerShown: false }} />
              <Stack.Screen name="Challenge" component={Challenge} options={{ headerShown: false }} />
              <Stack.Screen name="PostUpload" component={PostUpload} options={{ headerShown: false }} />
              <Stack.Screen name="AddChallenge" component={AddChallenge} options={{ headerShown: false }} />

              {/* TEST PAGE FOR DEBUGGING PURPOSES ONLY - REMOVE BEFORE RELEASE */}
              <Stack.Screen name="TestP" component={TestPage} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
    );
  }
}