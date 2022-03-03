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
    TextInput,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import TopBar from './global-components/topbar.js';
import BottomBar from './global-components/bottombar.js';

// STYLE IMPORTS
import { altColor1, altColor2, textColor, statusBarTheme, backgroundColor } from '../theme-handler.js';
import globalStyles from '../global-styles.js';
import { API_URL, CDN_URL } from '../serverconf.js';
import globalStates from '../global-states.js';

import HideableView from './global-components/hideableview.js';

import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PostUploadPage = ({route, challengeID})  => {

    const navigation = useNavigation();

    //GET CHALLENGE ID FROM PARAMS
    if (challengeID == null) {
        challengeID = route.params.challengeID;
    }

    const [isLoading, setIsLoading] = React.useState(true);
    const [image, setImage] = React.useState(null);
    const [base64, setBase64] = React.useState(null);
    const [exif, setExif] = React.useState(null);
    const [photoID, setPhotoID] = React.useState(null);
    const [desc, setDesc] = React.useState('');
    const [postID, setPostID] = React.useState(null);

    const [status, requestPermission] = ImagePicker.useCameraPermissions();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          exif: true,
          base64: true,
        });
    
        if (!result.cancelled) {
            setBase64(result.base64);
            setImage(result.uri);
            setExif(result.exif);
        }
    };

    const takeImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            exif: true,
            base64: true,
          });
      
          if (!result.cancelled) {
            setBase64(result.base64);
            setImage(result.uri);
            setExif(result.exif);
          }
    };

    const handleSubmit = async () => {
        let uploadedURL = "";

        if (image == null) {
            alert('Please select an image to upload.');
            return;
        }

        // UPLOAD IMAGE TO CDN SERVER
        const uploadData = new FormData();

        uploadData.append('image', 'data:image/jpeg;base64,' + base64);
        uploadData.append('user_public_id', globalStates.public_id);

        await fetch(CDN_URL + 'upload.php', {
            method: 'POST',
            body: uploadData
        })
        
        .then(response => response.json())
            .then(responseJson => { 
                uploadedURL = CDN_URL + responseJson.path;
                console.log(uploadedURL);
            })
        .catch(error => {
            console.error(error);
        });

        let cameraMake = exif.Make;
        let cameraModel = exif.Model;
        
        let camera = cameraMake + ' ' + cameraModel;

        let aperture = exif.FNumber;
        let shutterSpeed = (exif.ExposureTime < 1) ? "1/" + parseInt((1 / exif.ExposureTime).toFixed(2)) : exif.ExposureTime;
        let iso = exif.ISOSpeedRatings;
        let focalLength = exif.FocalLength;
        let dateTaken = exif.DateTimeOriginal;

        // SEND TO API TO STORE ON DB
        await fetch (API_URL + 'photos', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': globalStates.token,
            },
            body: JSON.stringify({
                url: uploadedURL,
                camera: camera,
                focal_length: focalLength,
                aperture: aperture,
                iso: iso,
                shutter_speed: shutterSpeed,
                location: null,
                date_taken: dateTaken,
            })
        })
        .then(response => response.json())
        .then(responseJson => { 
            //setPhotoID(responseJson.id);

            // SEND POST DATA TO API
            fetch (API_URL + 'posts', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Token': globalStates.token,
                },
                body: JSON.stringify({
                    photo_id: responseJson.id,
                    desc: desc,
                })
            })
            .then(response => response.json())
            .then(responseJson => { 
                //setPostID(responseJson.id);

                // USER HAS POSTS ENDPOINT
                fetch (API_URL + 'users/me/posts', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Access-Token': globalStates.token,
                    },
                    body: JSON.stringify({
                        post_id: responseJson.id,
                    })
                })
                .catch(error => {
                    console.error(error);
                });

                // CHALLENGE HAS POSTS ENDPOINT
                fetch (API_URL + 'challenges/' + challengeID + '/posts', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Access-Token': globalStates.token,
                    },
                    body: JSON.stringify({
                        post_id: responseJson.id,
                    })
                })
                .catch(error => {
                    console.error(error);
                });

            })
            .catch(error => {
                console.log(error);
            });

        })
        .catch(error => {
            console.log(error);
        });

        // REDIRECT TO CHALLENGE PAGE
        alert('Post uploaded successfully!');
        navigation.goBack();
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

                <HideableView visible={image == null}>
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        <Text style={styles.uploadButtonText}> CHOOSE IMAGE </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.uploadButton} onPress={takeImage}>
                        <Text style={styles.uploadButtonText}> TAKE PHOTO </Text>
                    </TouchableOpacity>
                </HideableView>
   
                <HideableView visible={image != null}>

                    <TextInput
                        style={ styles.largeTextInput }
                        placeholder="Description"
                        placeholderTextColor={textColor}
                        onChangeText={ (text) => setDesc(text) }
                        multiline={true}
                    />

                </HideableView>

                <HideableView visible={image != null}>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleSubmit}>
                        <Text style={styles.uploadButtonText}> SUBMIT </Text>
                    </TouchableOpacity>
                </HideableView>

            </View>

            <BottomBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    postImageContainer: {
        width: windowWidth,
        height: windowHeight * 0.4,
        
        justifyContent: 'center',
        alignItems: 'center',
    },

    postImageOverlay: {
        width: windowWidth,
        height: windowHeight * 0.4,
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

    largeTextInput: {
        height: windowHeight * 0.3,
        width: windowWidth * 0.85,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: altColor1,
        backgroundColor: backgroundColor,
        color: textColor,
        fontSize: 15,
        fontFamily: 'Roboto',
        paddingLeft: 10,
        paddingRight: 10,

        margin: 5,
    },

});

export default PostUploadPage;