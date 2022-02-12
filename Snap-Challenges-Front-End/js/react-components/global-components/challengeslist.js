// REACT IMPORTS
import React from 'react';
import { 
    Dimensions, 
    StyleSheet, 
    View,
    ScrollView, 
    Image,
    TouchableOpacity,
    Text
} from 'react-native';

// STYLE IMPORTS
import { altColor1, textColor } from '../../theme-handler.js';

import ChallengeCard from './challengecard.js';

const windowWidth = Dimensions.get('window').width;

const ChallengeList = ({challenges})  => {

    let ChallengeList = [];

    if(challenges.length > 0) {
        for(let i = 0; i < challenges.length; i++) {
            ChallengeList.push(
                <ChallengeCard key={challenges[i].id} id={challenges[i].id} title={challenges[i].title} desc={challenges[i].desc} end_date={challenges[i].end_date} timesCompleted={challenges[i].timesCompleted} />
            );
        }
    } else {
        ChallengeList.push(
            <Text key='no post' style={styles.noChallengeText}> NO CHALLENGES POSTED YET </Text>
        );
    }

    return (
        <View style={{flex:1}}>
            <ScrollView contentContainerStyle={styles.listContainer}>
                {ChallengeList}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    listContainer: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    noChallengeText: {
        color: textColor, 
        fontFamily: "Roboto", 
        fontSize: 20,
        fontWeight: "bold",

        textAlign: "center",
    }
});

export default ChallengeList;