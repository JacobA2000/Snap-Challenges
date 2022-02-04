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

    challenges = [
        {id: 1, title: "Challenge 1", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 1"}, 
        {id: 2, title: "Challenge 2", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 2"}, 
        {id: 3, title: "Challenge 3", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 3"},
        {id: 4, title: "Challenge 4", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 4"},
        {id: 5, title: "Challenge 5", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 5"},
        {id: 6, title: "Challenge 6", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 6"},
        {id: 7, title: "Challenge 7", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 7"},
        {id: 8, title: "Challenge 8", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 8"},
        {id: 9, title: "Challenge 9", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 9"},
        {id: 10, title: "Challenge 10", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 10"},
        {id: 11, title: "Challenge 11", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 11"},
        {id: 12, title: "Challenge 12", desc: "This is a description of the challenge", time_left: "1 day", author_id: "Author 12"},
    ];

    let ChallengeList = [];

    if(challenges.length > 0) {
        for(let i = 0; i < challenges.length; i++) {
            ChallengeList.push(
                <ChallengeCard key={challenges[i].id} id={challenges[i].id} title={challenges[i].title} desc={challenges[i].desc} time_left={challenges[i].time_left} author_id={challenges[i].author_id} />
            );
        }
    } else {
        ChallengeList.push(
            <Text style={styles.noChallengeText}> NO CHALLENGES POSTED YET </Text>
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