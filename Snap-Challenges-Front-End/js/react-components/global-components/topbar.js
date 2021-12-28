// REACT IMPORTS
import React from 'react';
import { 
  Dimensions, 
  StyleSheet, 
  View, 
  Image,
  TouchableOpacity
} from 'react-native';

// STYLE IMPORTS
import { altColor1, altColor2 } from '../../theme-handler.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TopBar = ()  => {
  return (
    <View style={styles.topbarContainer}>
        <Image style={styles.topbarLogo} source={require('../../../assets/snap-challenges-logos/text-logo.png')} />

        <TouchableOpacity style={styles.topbarNotificationButton} title="Notification" onPress={() => {alert("TEST")}}>
            <Image style={styles.topbarNotificationButtonImage}source={require('../../../assets/menu-icons/bell-icon.png')}/>
        </TouchableOpacity> 
    </View>
  );
}

const styles = StyleSheet.create({
    topbarContainer: {
        width: windowWidth,
        height: windowHeight * 0.075,
        backgroundColor: altColor1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    topbarLogo: {
        width: windowHeight * 0.25,
        height: "100%",

        resizeMode: 'contain',

        left: 0,
    },

    topbarNotificationButton: {
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
        backgroundColor: altColor2,
        borderRadius: windowHeight * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    topbarNotificationButtonImage: {
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
        resizeMode: 'contain',
    },

});

export default TopBar;