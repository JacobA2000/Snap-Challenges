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

const windowWidth = Dimensions.get('window').width;

const ImageGrid = ({images})  => {

    let imageGrid = [];

    if(images.length > 0) {
        for(let i = 0; i < images.length; i++) {
            imageGrid.push(
                <TouchableOpacity key={i} style={styles.imageGridItem} onPress={() => alert(i)}>
                    <Image style={styles.imageGridImage} source={{uri: images[i]}} />
                </TouchableOpacity>
            );
        }
    } else {
        imageGrid.push(
            <Text style={styles.noImageText}> NO IMAGES POSTED YET </Text>
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
    },

    imageGridItem: {
        width: windowWidth * 0.3,
        height: windowWidth * 0.3,
        backgroundColor: altColor1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

        marginVertical: 5,
    },

    imageGridImage: {
        width: windowWidth * 0.3,
        height: windowWidth * 0.3,
        resizeMode: 'cover',
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