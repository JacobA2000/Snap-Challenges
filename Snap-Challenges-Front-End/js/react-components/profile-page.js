// REACT IMPORTS
import React, { useEffect } from 'react';
import { 
  Dimensions, 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  Image
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// STYLE IMPORTS
import GlobalStyles from '../global-styles.js';
import { textColor, altColor2, statusBarTheme } from '../theme-handler.js';

// GLOBAL COMPONENT IMPORTS
import Topbar from './global-components/topbar.js';
import BottomBar from './global-components/bottombar.js';
import ImageGrid from './global-components/imagegrid.js';
import { API_URL, CDN_URL } from '../serverconf.js';

import globalStates from '../global-states.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BadgeIcon = ({icon}) => {
    return (
        <View style={styles.badgeIconBackdrop}>
            <Image style={styles.profileStatsBadge} source={icon} />
        </View>
    );
}

const StatCounter = ({title, value}) => {
    return (
        <View style={styles.profileStatsCounter}>
            <Text style={styles.profileStatsCounterTitle}>{title}</Text>
            <Text style={styles.profileStatsCounterValue}>{value}</Text>
        </View>
    );
}

const ProfileDescriptionStats = ({avatar_url, username, country_code, bio, numPosts, kudos}) => {
    if(bio == null) {
        bio = "User doesn't have a bio.";
    }

    if(country_code == null) {
        country_code = "blank";
    }

    return (
        <View style={styles.profileDescStatsContainer}>
            <View style={styles.profileDescription}>
                <Image style={GlobalStyles.avatarImage} source={{uri: avatar_url}} />
                <View style={styles.profileDescriptionTextContainer}>
                    <View style={styles.usernameFlagContainer}>
                        <Text style={styles.usernameText} numberOfLines={1}>{username}</Text>
                        <Image style={styles.flagImage} source={{uri: CDN_URL + 'assets/images/static/flags/' + country_code.toLowerCase() + '.png'}} />

                    </View>
                    <Text style={styles.bioText} numberOfLines={4}>{bio}</Text>
                </View>
            </View>
            <View style={styles.profileStats}>
                <View style={styles.profileStatsBadgeList}>
                    <BadgeIcon icon={require("../../assets/menu-icons/badge-icon.png")}/>
                    <BadgeIcon icon={require("../../assets/menu-icons/badge-icon.png")}/>
                    <BadgeIcon icon={require("../../assets/menu-icons/badge-icon.png")}/>
                    <BadgeIcon icon={require("../../assets/menu-icons/badge-icon.png")}/>
                </View>
                
                <View style={styles.profileStatsCounterList}>
                    <StatCounter title="Posts" value={numPosts} />
                    <StatCounter title="Kudos Recieved" value={kudos} />
                </View>

            </View>
        </View>
    );
}        

const Profile = ()  => {
    const [avatarUrl, setAvatarUrl] = React.useState(null);
    const [username, setUsername] = React.useState('');
    const [countryCode, setCountryCode] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [numPosts, setNumPosts] = React.useState(0);
    const [kudos, setKudos] = React.useState(0);

    const [imgs, setImgs] = React.useState([]);

    const [isProfileLoading, setIsProfileLoading] = React.useState(true);
    const [isImageGridLoading, setIsImageGridLoading] = React.useState(true);

    let imgUrls = [];

    useEffect(() => {
        //GET PROFILE DATA FROM API
        fetch(API_URL + 'users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': globalStates.token
            }
        }).then(response => response.json())
        .then(responseJson => {
            let profileData = responseJson;
            setAvatarUrl(profileData.avatar_url);
            setUsername(profileData.username);
            setBio(profileData.bio);

            //GET COUNTRY CODE
            fetch(API_URL + 'countries/' + profileData.country_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Token': globalStates.token
                }
            }).then(response => response.json())
            .then(responseJson => {
                let countryData = responseJson;
                setCountryCode(countryData.code);
                setIsProfileLoading(false);
            }
            ).catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
        
        // FETCH CURRENT USERS POSTS FROM SERVER
        fetch(API_URL + 'users/me/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': globalStates.token
            }
        })
        .then(response => response.json())
        .then(responseJson => {

            let postData = responseJson;
            let posts = postData.posts;

            console.log(posts.length);
            console.log(posts.length);

            setNumPosts(posts.length);

            // LOOP THOROUGH EACH POST GETTING THE IMAGE_URL AND KUDOS
            let kudosTotal = 0;
            for(let i = 0; i < posts.length; i++) {
                fetch(API_URL + 'posts/' + posts[i].post_id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Access-Token': globalStates.token
                    }
                })
                .then(response => response.json())
                .then(responseJson => {
                    let post = responseJson;

                    kudosTotal += post.upvotes;
                    setKudos(kudosTotal);

                    // GET IMAGE URL FROM THE PHOTO API
                    fetch(API_URL + 'photos/' + post.photo_id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Access-Token': globalStates.token
                        }
                    })
                    .then(response => response.json())
                    .then(responseJson => {
                        imgUrls.push(responseJson.url);

                        if(imgUrls.length == posts.length) {
                            setImgs(imgUrls);
                            setIsImageGridLoading(false);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                })
                .catch(error => {
                    console.error(error);
                }
                );
            }
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    

    

    if ( isProfileLoading && isImageGridLoading ) {
        return null;
    }

    return (
        <SafeAreaView style={GlobalStyles.centeredContainer}>
            <StatusBar style={statusBarTheme} />
            <Topbar />

            <ProfileDescriptionStats avatar_url={avatarUrl} username={username} country_code={countryCode} bio={bio} numPosts={numPosts} kudos={kudos} />
            
            <ImageGrid images={imgs} />

            <BottomBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    profileDescStatsContainer: {
        width: windowWidth,
        height: windowHeight * 0.3,

        paddingVertical: 15,

        overflow: 'hidden',
    },

    profileDescription: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },

    profileDescriptionTextContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    usernameText: {
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 'bold',
        color: textColor,
    },

    usernameFlagContainer: {
        width: windowWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    flagImage: {
        width: 20,
        height: 20,

        resizeMode: 'contain',

        paddingHorizontal: 30,
    },

    bioText: {
        fontFamily: 'Roboto',
        fontSize: 15,
        color: textColor,
    },

    profileStats: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },

    profileStatsBadgeList: {

        width: windowWidth * 0.5,

        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    badgeIconBackdrop: {
        backgroundColor: altColor2,

        width: windowHeight * 0.05,
        height: windowHeight * 0.05,

        borderRadius: windowHeight * 0.025 / 2,

        alignItems: 'center',
        justifyContent: 'center',
    },

    profileStatsBadge: {
        width: windowHeight * 0.04,
        height: windowHeight * 0.04,
        marginHorizontal: 5,
    },

    profileStatsCounterList: {
        width: windowWidth * 0.5,

        flex: 1,
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',

        paddingHorizontal: 20,
    },

    profileStatsCounter: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    profileStatsCounterTitle: {
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontSize: 15,
        color: textColor,

        textAlign: 'center',
    },

    profileStatsCounterValue: {
        fontFamily: 'Roboto',
        fontSize: 15,
        color: textColor,
    },
});

export default Profile;