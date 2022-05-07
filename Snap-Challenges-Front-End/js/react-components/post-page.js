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
import { API_URL } from '../serverconf.js';
import globalStates from '../global-states.js';
import { TabRouter } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VoteComponent = ({kudos, downvotes, post_id}) => {

    const kudosVotedImage = require('../../assets/menu-icons/kudos-voted.png');
    const kudosNotVoted = require('../../assets/menu-icons/kudos-not-voted.png');
    const downvotesVotedImage = require('../../assets/menu-icons/downvote-voted.png');
    const downvotesNotVoted = require('../../assets/menu-icons/downvote-not-voted.png');

    const [kudosImage, setKudosImage] = React.useState(kudosNotVoted);
    const [downvotesImage, setDownvotesImage] = React.useState(downvotesNotVoted);
    
    const [kudosVoted, setKudosVoted] = React.useState(false);
    const [downvotesVoted, setDownvotesVoted] = React.useState(false);

    const [kudosCount, setKudosCount] = React.useState(kudos);
    const [downvotesCount, setDownvotesCount] = React.useState(downvotes);

    const kudosVote = () => {
        if(!kudosVoted && !downvotesVoted) {
            setKudosVoted(true);
            setKudosImage(kudosVotedImage);
            setKudosCount(kudosCount + 1);

            // SEND API REQUEST TO INCREMENT SERVER UPVOTES
            increment_votes('upvotes');

        } else if(kudosVoted && !downvotesVoted) {
            setKudosVoted(false);
            setKudosImage(kudosNotVoted);
            setKudosCount(kudosCount - 1);

            // SEND API REQUEST TO DECREMENT SERVER UPVOTES
            decrement_votes('upvotes');

        } else if(!kudosVoted && downvotesVoted) {
            setKudosVoted(true);
            setKudosImage(kudosVotedImage);
            setKudosCount(kudosCount + 1);

            setDownvotesVoted(false);
            setDownvotesImage(downvotesNotVoted);
            setDownvotesCount(downvotesCount - 1);

            // SEND API REQUEST TO UPDATE INCREMENT SERVER UPVOTES
            increment_votes("upvotes");

            // SEND API REQUEST TO UPDATE DECREMENT SERVER DOWNVOTES
            decrement_votes("downvotes");
        }
    }

    const downvotesVote = () => {
        if(!downvotesVoted && !kudosVoted) {
            setDownvotesVoted(true);
            setDownvotesImage(downvotesVotedImage);
            setDownvotesCount(downvotesCount + 1);

            // SEND API REQUEST TO INCREMENT SERVER DOWNVOTES
            increment_votes("downvotes");

        } else if (downvotesVoted && !kudosVoted) {
            setDownvotesVoted(false);
            setDownvotesImage(downvotesNotVoted);
            setDownvotesCount(downvotesCount - 1);

            // SEND API REQUEST TO DECREMENT SERVER DOWNVOTES
            decrement_votes("downvotes");

        } else if (!downvotesVoted && kudosVoted) {
            setDownvotesVoted(true);
            setDownvotesImage(downvotesVotedImage);
            setDownvotesCount(downvotesCount + 1);

            setKudosVoted(false);
            setKudosImage(kudosNotVoted);
            setKudosCount(kudosCount - 1);

            // SEND API REQUEST TO UPDATE INCREMENT SERVER DOWNVOTES
            increment_votes("downvotes");

            // SEND API REQUEST TO UPDATE DECREMENT SERVER UPVOTES
            decrement_votes("upvotes");
        }
    }

    const increment_votes = (voteType) => {
        fetch(`${API_URL}posts/${post_id}/increment_${voteType}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': globalStates.token
            }
        })
    }

    const decrement_votes = (voteType) => {
        fetch(`${API_URL}posts/${post_id}/decrement_${voteType}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': globalStates.token
            }
        })
    }

    return (
        <View style={voteStyles.voteContainer}>
            <View style={voteStyles.kudosContainer}>
                <TouchableOpacity style={voteStyles.kudosIconContainer} onPress={kudosVote}>
                    <Image style={voteStyles.kudosImage} source={kudosImage} />
                </TouchableOpacity>
                <Text style={voteStyles.kudosText}> {kudosCount} </Text>
            </View>
            <View style={voteStyles.downvotesContainer}>
                <TouchableOpacity style={voteStyles.downvotesIconContainer} onPress={downvotesVote}>
                    <Image style={voteStyles.downvoteImage} source={downvotesImage} />
                </TouchableOpacity>
                <Text style={voteStyles.downvotesText}> {downvotesCount} </Text>
            </View>
        </View>
    );
}

const CameraInfoRow = ({icon, text}) => {
    return (
        <View style={cameraInfoStyles.cameraInfoRow}>
            <View style={cameraInfoStyles.cameraInfoIcon}>
                <Image style={cameraInfoStyles.cameraInfoIconImage} source={icon} />
            </View>
            <Text style={cameraInfoStyles.cameraInfoText}>
                {text}
            </Text>
        </View>
    );
}

const CameraInfo = ({camera, focalLength, aperture, shutterSpeed, iso}) => {

    if (camera === null) {
        camera = 'N/A';
    }

    if (focalLength === null) {
        focalLength = 'N/A';
    }

    if (aperture === null) {
        aperture = 'N/A';
    }

    if (shutterSpeed === null) {
        shutterSpeed = 'N/A';
    }

    if (iso === null) {
        iso = 'N/A';
    }

    camera = String(camera).toUpperCase();
    focalLength = `${String(focalLength).toUpperCase()}mm`;
    aperture = `f/${String(aperture).toUpperCase()}`;
    shutterSpeed = `${String(shutterSpeed).toUpperCase()}s`;
    iso = String(iso).toUpperCase();

    return (
        <View style={cameraInfoStyles.cameraInfoContainer}>
            <CameraInfoRow icon={require('../../assets/menu-icons/camera-icon.png')} text={camera} />
            <CameraInfoRow icon={require('../../assets/menu-icons/focal-length-icon.png')} text={focalLength}/>
            <CameraInfoRow icon={require('../../assets/menu-icons/aperture-icon.png')} text={aperture} />
            <CameraInfoRow icon={require('../../assets/menu-icons/shutter-speed-icon.png')} text={shutterSpeed} />
            <CameraInfoRow icon={require('../../assets/menu-icons/iso-icon.png')} text={iso} />
     </View>
    );
}

const PostPage = ({navigation, route, post_id})  => {
    if ((post_id === null || post_id === undefined) && (route.params.post_id !== undefined && route.params.post_id !== null)) {
        post_id = route.params.post_id;
    }

    const [isLoading, setIsLoading] = React.useState(true);

    const [post_image_url, setPostImageURL] = React.useState('');
    const [post_description, setPostDescription] = React.useState('');

    const [kudos, setKudos] = React.useState(0);
    const [downvotes, setDownvotes] = React.useState(0);

    const [camera, setCamera] = React.useState('');
    const [focalLength, setFocalLength] = React.useState('');
    const [aperture, setAperture] = React.useState('');
    const [shutterSpeed, setShutterSpeed] = React.useState('');
    const [iso, setISO] = React.useState('');

    const [location, setLocation] = React.useState('');
    const [dateTaken, setDateTaken] = React.useState('');

    const [postedAt, setPostedAt] = React.useState('');
    const [postedByUserID, setPostedByUserID] = React.useState('');
    const [postedBy, setPostedBy] = React.useState('');
    const [postedByImage, setPostedByImage] = React.useState('');

    useEffect(() => {
        //FETCH THE POST DATA
        fetch(`${API_URL}posts/${post_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': globalStates.token
            }
        })
        .then(response => response.json())
        .then(responseJson => { 
            if (responseJson.desc !== null) {
                setPostDescription(responseJson.desc);
            } else {
                setPostDescription('Post has no description.');
            }
            setKudos(responseJson.upvotes);
            setDownvotes(responseJson.downvotes);
            setPostedAt(responseJson.posted_at);

            //FETCH THE PHOTO DATA
            fetch(`${API_URL}photos/${responseJson.photo_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Token': globalStates.token
                }
            })
            .then(response => response.json())
            .then(responseJson => {
                setPostImageURL(responseJson.url);
                setCamera(responseJson.camera);
                setFocalLength(responseJson.focal_length);
                setAperture(responseJson.aperture);
                setShutterSpeed(responseJson.shutter_speed);
                setISO(responseJson.iso);
                setLocation(responseJson.location);
                setDateTaken(responseJson.date_taken);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
            console.log(error);
        });

        //FETCH THE USER DATA
        fetch(`${API_URL}users/posts/${post_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': globalStates.token
                }
            })
            .then(response => response.json())
            .then(responseJson => {
                setPostedByUserID(responseJson.public_id);
                setPostedBy(responseJson.username);
                setPostedByImage(responseJson.avatar_url);
                
            }
        )
        .catch(error => {
            console.log(error);
        });
    }, []);

    if (isLoading) {
        return null
    }

    return (
        <SafeAreaView style={globalStyles.centeredContainer}>
            <StatusBar style={statusBarTheme} />
            <TopBar />
 
            <ScrollView style={{flex: 1}}>
                <ImageBackground 
                    style={styles.postImageContainer} 
                    source={{uri: post_image_url}}
                    resizeMode='cover'
                    blurRadius={4}
                >
                    <View style={styles.postImageOverlay} />

                    <Image
                        style={styles.postImage}
                        source={{uri: post_image_url}}
                    />
                </ImageBackground>
                
                <View style={styles.postDescriptionContainer}>
                    <View style={styles.postInfoContainer}>
                        <VoteComponent kudos={kudos} downvotes={downvotes} post_id={post_id} />
                    
                        <Text style={styles.postDescription}>{post_description}</Text>

                        <Text style={styles.postedAt}>Posted: {postedAt}</Text>

                        <TouchableOpacity style={styles.postAuthor} onPress={() => {
                            navigation.navigate('Profile', postedByUserID);
                        }}>
                            <Image
                                style={styles.postAuthorImage}
                                source={{uri: postedByImage}}
                            />
                            <Text style={styles.postAuthorText}>{postedBy}</Text>
                        </TouchableOpacity>
                    
                    </View>
                    <CameraInfo 
                        camera={camera} 
                        focalLength={focalLength} 
                        aperture={aperture}
                        shutterSpeed={shutterSpeed}
                        iso={iso}
                    />
                </View>

            </ScrollView>

            <BottomBar />
        </SafeAreaView>
    );
}

const cameraInfoStyles = StyleSheet.create({
    cameraInfoContainer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        paddingVertical: 10,
        //backgroundColor: altColor2,
        borderWidth:5,
        borderColor: altColor2,
        borderTopWidth: 0,
    },

    cameraInfoRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    cameraInfoText: {
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        color: textColor,

        marginLeft: 5,
    },

    cameraInfoIcon: {
        backgroundColor: altColor2,
        borderRadius: 50,
        width: windowWidth * 0.05,
        height: windowWidth * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cameraInfoIconImage: {
        width: windowWidth * 0.03,
        height: windowWidth * 0.03,
    },

});

const voteStyles = StyleSheet.create({
    voteContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5,

        //backgroundColor: altColor2,
        borderBottomWidth:5,
        borderBottomColor: altColor2,

    },

    kudosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    kudosIconContainer: {
        marginRight: 10,
        width: 50,
        height: 50,

        backgroundColor: altColor2,
        borderRadius: windowHeight * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    kudosImage: {
        width: 40,
        height: 40,

        resizeMode: 'contain',
    },

    kudosText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: textColor,
    },

    downvotesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    downvotesIconContainer: {
        marginLeft: 10,
        width: 50,
        height: 50,

        backgroundColor: altColor2,
        borderRadius: windowHeight * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    downvoteImage: {
        width: 40,
        height: 40,

        resizeMode: 'contain',
    },

    downvotesText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: textColor,
    },
});

const styles = StyleSheet.create({
    postInfoContainer: {
        width: "65%",
    },

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

    postDescriptionContainer: {
        width: "100%",
        height: windowHeight * 0.25,
        flexDirection: 'row',

        borderTopWidth: 5,
        borderTopColor: altColor2,
    },

    postDescription: {
        fontSize: 14,
        color: textColor,
        padding: 5,

        overflow: 'hidden'
    },

    postedAt: {
        fontSize: 12,
        color: textColor,
        padding: 5, 
    },

    postAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },

    postAuthorImage: {
        width: windowWidth * 0.05,
        height: windowWidth * 0.05,
        borderRadius: windowWidth * 0.1,
        resizeMode: 'contain',
    },

    postAuthorText: {
        fontSize: 14,
        color: textColor,
        padding: 5,
    },
});

export default PostPage;