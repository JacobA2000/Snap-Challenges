// REACT IMPORTS
import React from 'react';
import { 
    Dimensions, 
    StyleSheet, 
    View,
    ScrollView, 
    Image,
    TouchableOpacity,
    Text,
    TouchableHighlight
} from 'react-native';

// STYLE IMPORTS
import { altColor1, altColor2, textColor } from '../../theme-handler.js';

import { useNavigation } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChallengeCard = ({id, title, desc, end_date, timesCompleted})  => {

    const navigation = useNavigation();

    //Convert end date to a date object
    let endDate = new Date(end_date);

    //Calculate time left for challenge
    let timeLeft = endDate - Date.now();
    let timeLeftDays = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    let timeLeftHours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    let timeLeftMinutes = Math.floor((timeLeft / 1000 / 60) % 60);

    let timeLeftDisplayed = '';

    console.log('Time left: ' + timeLeft);

    if(timeLeftDays > 0) {
        timeLeftDisplayed = timeLeftDays + 'd';
    } else if(timeLeftHours > 0) {
        timeLeftDisplayed = timeLeftHours + 'h';
    } else {
        timeLeftDisplayed = timeLeftMinutes + 'm';
    }

    return (
        <TouchableOpacity style={styles.imageGridItem} onPress={
            () => 
            navigation.navigate("Challenge", {
                id: id, 
                title: title, 
                desc: desc,
                end_date: end_date,
                timesCompleted: timesCompleted
            }
        )}>
            <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <View style={styles.cardTimeLeft}>
                        <View style={styles.cardTimeLeftIcon}>
                            <Image style={styles.cardTimeLeftIconImage} source={require("../../../assets/menu-icons/clock.png")} />
                        </View>
                        <Text style={styles.cardTimeLeftText}>{timeLeftDisplayed}</Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.cardDesc}>{desc}</Text>
                </View>
                <View style={styles.cardFooter}>
                    <View style={styles.cardFooterLeft}>
                        <Text style={styles.cardTimesCompleted}>Entries Submitted:</Text>
                        <Text style={styles.cardTimesCompleted}> {timesCompleted} </Text>
                    </View>
                    <View style={styles.cardFooterRight}>
                        <TouchableHighlight style={styles.cardFooterRightButton} onPress={() => {navigation.navigate("PostUpload", {challengeID: id})}}>
                            <Text style={styles.cardFooterRightButtonText}> JOIN </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: windowWidth - 20,
        height: windowHeight/4,
        borderWidth: 5,
        borderRadius: 10,
        borderColor: altColor1,
        margin: 10,
        padding: 10,
    },

    cardHeader: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    cardTitle: {
        fontSize: 20,
        fontFamily: "Roboto",
        fontWeight: "bold",
        color: textColor,
    },

    cardTimeLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    cardTimeLeftIcon: {
        width: windowHeight * 0.03,
        height: windowHeight * 0.03,
        borderRadius: windowHeight * 0.03,
        backgroundColor: altColor2,
        justifyContent: "center",
        alignItems: "center",
    },

    cardTimeLeftIconImage: {
        width: 20,
        height: 20,
        resizeMode: "contain",
    },

    cardTimeLeftText: {
        fontSize: 20,
        fontFamily: "Roboto",
        fontWeight: "bold",
        color: textColor,
        marginLeft: 5,
    },

    cardBody: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
    },

    cardDesc: {
        fontSize: 15,
        fontFamily: "Roboto",
        color: textColor,
    },

    cardFooter: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    cardFooterLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    cardTimesCompleted: {
        fontSize: 15,
        fontFamily: "Roboto",
        fontWeight: "bold",
        color: textColor,
    },

    cardFooterRight: {
        flexDirection: "row",
        alignItems: "center",
    },

    cardFooterRightButton: {
        width: 70,
        height: 30,
        borderRadius: 10,
        backgroundColor: altColor2,
        justifyContent: "center",
        alignItems: "center",
    },

    cardFooterRightButtonText: {
        fontSize: 15,
        fontFamily: "Roboto",
        color: textColor,
    },


});

export default ChallengeCard;