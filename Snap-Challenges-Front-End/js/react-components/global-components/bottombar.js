// REACT IMPORTS
import { AuthError } from 'expo-auth-session';
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

const BottomBar = ()  => {
  return (
    <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBarNavList}>
            <TouchableOpacity style={styles.bottomBarNavButton} title="Challenges" onPress={() => {alert("CHALLENGE")}}>
                <Image style={styles.bottomBarNavButtonImage} source={require('../../../assets/menu-icons/challenge-icon.png')}/>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.bottomBarNavButton} title="Badges" onPress={() => {alert("BADGE")}}>
                <Image style={styles.bottomBarNavButtonImage} source={require('../../../assets/menu-icons/badge-icon.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBarNavButton} title="Profile" onPress={() => {alert("PROFILE")}}>
                <Image style={styles.bottomBarNavButtonProfileImage} source={{uri: 'https://pickaface.net/gallery/avatar/unr_test_180821_0925_9k0pgs.png'}}/>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    bottomBarContainer: {
        width: windowWidth,
        height: windowHeight * 0.075,
        backgroundColor: altColor1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    bottomBarNavList: {
        width: "100%",
        height: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    bottomBarNavButton: {
        width: windowHeight * 0.06,
        height: windowHeight * 0.06,
        borderRadius: windowHeight * 0.06,
        backgroundColor: altColor2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    bottomBarNavButtonImage: {
        width: windowHeight * 0.05,
        height: windowHeight * 0.05,
    },

    bottomBarNavButtonProfileImage: {
        width: windowHeight * 0.055,
        height: windowHeight * 0.055,
        borderRadius: windowHeight * 0.055,
    },

});

export default BottomBar;