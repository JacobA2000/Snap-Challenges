// REACT IMPORTS
import React, { useEffect } from 'react';
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
import ChallengeList from './global-components/challengeslist.js';

import { API_URL } from '../serverconf.js';

import { getToken } from '../flask-api-token.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChallengesPage = ()  => {

    // SEND A REQUEST TO THE SERVER TO GET THE CHALLENGES
    // CHALLENGES WILL BE STORED IN THE VARIABLE CHALLENGES
    // CHALLENGES WILL BE AN ARRAY OF OBJECTS
    // EACH OBJECT WILL HAVE THE FOLLOWING PROPERTIES:
    // id, title, desc, time_left, author
    let challenges = []

    //fetch(API_URL + 'challenges')

    return (
        <SafeAreaView style={ GlobalStyles.listContainer }>
            <StatusBar style={ statusBarTheme } />
            <TopBar />
            <ChallengeList challenges={challenges} />
            <BottomBar />
        </SafeAreaView>
    );
}




export default ChallengesPage;