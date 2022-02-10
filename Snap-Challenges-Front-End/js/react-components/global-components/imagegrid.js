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
    Platform
} from 'react-native';

// STYLE IMPORTS
import { altColor1, textColor } from '../../theme-handler.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ImageGrid = ({images})  => {

    let imageGrid = [];

    if(images.length > 0) {
        let count = 0;

        images.forEach(image => {
            
            imageGrid.push(
                <TouchableOpacity key={count} style={Platform.OS === 'android' || Platform.OS === 'ios' ? styles.mobileImageGridItem : styles.webImageGridImage} onPress={() => alert(image.post_id)}>
                    <Image style={Platform.OS === 'android' || Platform.OS === 'ios' ? styles.mobileImageGridImage : styles.webImageGridImage} source={{uri: image.url}} />
                </TouchableOpacity>
            );

            count +=1;
        });
            
    } else {
        imageGrid.push(
            <Text key='no-value-text' style={styles.noImageText}> NO IMAGES POSTED YET </Text>
        );
    }

    return (
        <View style={{flex:1}}>
            <ScrollView contentContainerStyle={styles.gridContainer}>
                {imageGrid}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,

        width: windowWidth - 20,
    },

    mobileImageGridItem: {
        width: windowWidth * 0.3,
        height: windowWidth * 0.3,
        backgroundColor: altColor1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

        marginVertical: 5,
    },

    mobileImageGridImage: {
        width: windowWidth * 0.3,
        height: windowWidth * 0.3,
        resizeMode: 'cover',

        marginVertical: 5,
    },

    webImageGridItem: {
        width: windowHeight * 0.4,
        height: windowHeight * 0.4,
        backgroundColor: altColor1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

        marginVertical: 5,
    },

    webImageGridImage: {
        width: windowHeight * 0.4,
        height: windowHeight * 0.4,
        resizeMode: 'cover',

        marginVertical: 5,
    },

    noImageText: {
        color: textColor, 
        fontFamily: "Roboto", 
        fontSize: 20,
        fontWeight: "bold",

        textAlign: "center",
    }
});

export default ImageGrid;