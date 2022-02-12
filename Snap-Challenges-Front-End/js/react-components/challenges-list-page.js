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

import globalStates from '../global-states.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChallengesPage = ({ navigation })  => {

    // SEND A REQUEST TO THE SERVER TO GET THE CHALLENGES
    // CHALLENGES WILL BE STORED IN THE VARIABLE CHALLENGES
    // CHALLENGES WILL BE AN ARRAY OF OBJECTS
    // EACH OBJECT WILL HAVE THE FOLLOWING PROPERTIES:
    // id, title, desc, end_date, timesCompleted

    const [isLoading, setIsLoading] = React.useState(true);
    const [challenges, setChallenges] = React.useState([]);

    useEffect(() => {
        fetch(API_URL + 'challenges', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': globalStates.token
            }
        }).then(response => {
            response.json().then(data => ({
                data: data,
                status: response.status
            }))
            .then(res => {
                if (res.status === 200) {

                    let challengesList = [];

                    let challengesData = res.data.challenges;

                    challengesData.forEach(challenge => {
                        let challengesListItem = {
                            id: challenge.id,
                            title: challenge.title,
                            desc: challenge.description,
                            end_date: challenge.end_date,
                            timesCompleted: challenge.times_completed
                        }

                        challengesList.push(challengesListItem);
                    });

                    setChallenges(challengesList);
                    setIsLoading(false);
                }
            })
        })
    }, []);

    if (isLoading) {
        return null
    }

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