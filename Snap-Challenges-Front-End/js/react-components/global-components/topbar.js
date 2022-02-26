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

const TopBar = ({altButtonVisible, altButton})  => {
    return (
        <View style={styles.topbarContainer}>
            <Image style={styles.topbarLogo} source={require('../../../assets/snap-challenges-logos/text-logo.png')} />

            <View style={styles.topbarRightContainer}>

                {/* {altButtonVisible == true ? 
                    (<TouchableOpacity style={styles.topBarButton}>
                        <Image style={styles.topBarButtonImage} source={require('../../../assets/menu-icons/bell-icon.png')} />
                    </TouchableOpacity>)
                : console.log(altButtonVisible)} */}

                {altButton}

                <TouchableOpacity style={styles.topBarButton} title="Notification" onPress={() => {alert("TEST")}}>
                    <Image style={styles.topBarButtonImage} source={require('../../../assets/menu-icons/bell-icon.png')}/>
                </TouchableOpacity> 
            </View>
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

    topbarRightContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    topBarButton: {
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
        backgroundColor: altColor2,
        borderRadius: windowHeight * 0.1,
        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 10,
    },

    topBarButtonImage: {
        width: windowHeight * 0.04,
        height: windowHeight * 0.04,
        resizeMode: 'contain',
    },

});

export default TopBar;