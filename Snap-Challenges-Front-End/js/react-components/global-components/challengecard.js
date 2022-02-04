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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChallengeCard = ({id, title, desc, time_left, author_id})  => {

    return (
        <TouchableOpacity style={styles.imageGridItem} onPress={() => alert(id)}>
            <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}> {title} </Text>
                    <View style={styles.cardTimeLeft}>
                        <View style={styles.cardTimeLeftIcon}>
                            <Image style={styles.cardTimeLeftIconImage} source={require("../../../assets/menu-icons/clock.png")} />
                        </View>
                        <Text style={styles.cardTimeLeftText}> {time_left} </Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.cardDesc}> {desc} </Text>
                </View>
                <View style={styles.cardFooter}>
                    <View style={styles.cardFooterLeft}>
                        <Image style={styles.cardAuthorImage} source={{uri: "https://www.w3schools.com/howto/img_avatar2.png"}} />
                        <Text style={styles.cardAuthor}> {author_id} </Text>
                    </View>
                    <View style={styles.cardFooterRight}>
                        <TouchableHighlight style={styles.cardFooterRightButton}>
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

    cardAuthorImage: {
        width: 40,
        height: 40,
        borderRadius: 360,
        resizeMode: "contain",
    },

    cardAuthor: {
        paddingLeft: 10,
        fontSize: 15,
        fontFamily: "Roboto",
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