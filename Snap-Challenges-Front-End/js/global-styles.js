// REACT IMPORTS
import { StyleSheet, Dimensions } from 'react-native';

// STYLE IMPORTS
import { colorScheme, backgroundColor, textColor, altColor1, altColor2 } from './theme-handler.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    centeredContainer: {
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
    },

    listContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: backgroundColor,
    },

    avatarImage: {
        height: windowHeight * 0.15,
        width: windowHeight * 0.15,
        
        borderRadius: 100,
    }
});