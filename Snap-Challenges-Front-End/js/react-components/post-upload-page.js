// REACT IMPORTS
import React, { useEffect } from 'react';
import { 
    Dimensions, 
    StyleSheet, 
    View,
    ScrollView, 
    Image,
    TouchableOpacity,
    Text,
    Platform,
    ImageBackground,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import TopBar from './global-components/topbar.js';
import BottomBar from './global-components/bottombar.js';

// STYLE IMPORTS
import { altColor1, altColor2, textColor, statusBarTheme } from '../theme-handler.js';
import globalStyles from '../global-styles.js';
import { API_URL, CDN_URL } from '../serverconf.js';
import globalStates from '../global-states.js';

import * as ImagePicker from 'expo-image-picker';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PostUploadPage = ({route, challengeID})  => {

    //GET CHALLENGE ID FROM PARAMS
    if (challengeID == null) {
        challengeID = route.params.challengeID;
    }

    const [isLoading, setIsLoading] = React.useState(true);
    const [image, setImage] = React.useState(null);
    const [exif, setExif] = React.useState(null);

    const [status, requestPermission] = ImagePicker.useCameraPermissions();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          exif: true,
        });
    
        if (!result.cancelled) {
          setImage(result.uri);
          setExif(result.exif);
        }
    };

    const takeImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            exif: true,
          });
      
          if (!result.cancelled) {
            setImage(result.uri);
            setExif(result.exif);
          }
    };

    const handleSubmit = async () => {

        if (image == null) {
            alert('Please select an image to upload.');
            return;
        }

        // UPLOAD IMAGE TO CDN SERVER

        const uploadData = new FormData();
        uploadData.append('image', {
            uri: image,
            name: 'image.jpg',
            type: 'image/jpg'
        });

        uploadData.append('user_public_id', globalStates.public_id);

        fetch(CDN_URL + 'upload.php', {
            method: 'POST',
            body: uploadData
        })
        .then(response => {
            console.log(response.text());
        });

        // SEND TO API TO STORE ON DB
    };


    return (
        <SafeAreaView style={globalStyles.centeredContainer}>
            <StatusBar style={statusBarTheme} />
            <TopBar />
            <View style={globalStyles.centeredContainer}>
                {image && 

                <ImageBackground 
                    style={styles.postImageContainer} 
                    source={{uri: image}}
                    resizeMode='cover'
                    blurRadius={4}
                >
                    <View style={styles.postImageOverlay} />

                    <Image
                        style={styles.postImage}
                        source={{uri: image}}
                    />
                </ImageBackground>

                }

                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <Text style={styles.uploadButtonText}> CHOOSE IMAGE </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadButton} onPress={takeImage}>
                    <Text style={styles.uploadButtonText}> TAKE PHOTO </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadButton} onPress={handleSubmit}>
                    <Text style={styles.uploadButtonText}> SUBMIT </Text>
                </TouchableOpacity>

            </View>

            <BottomBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    postImageContainer: {
        width: windowWidth,
        height: windowHeight * 0.6,
        
        justifyContent: 'center',
        alignItems: 'center',
    },

    postImageOverlay: {
        width: windowWidth,
        height: windowHeight * 0.6,
        backgroundColor: 'black',
        opacity: 0.3,

        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
    },

    postImage: {
        width: "90%",
        height: "90%",
        resizeMode: 'contain'
    },

    uploadButton: {
        width: windowWidth * 0.55,
        height: windowHeight * 0.055,
        backgroundColor: altColor1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: windowHeight * 0.02,
    },

    uploadButtonText: {
        color: textColor,
        fontSize: 20,
        fontWeight: 'bold',
    },

});

export default PostUploadPage;