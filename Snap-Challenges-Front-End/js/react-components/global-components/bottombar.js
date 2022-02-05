// REACT IMPORTS
import React, {useState} from 'react';

import { 
  Dimensions, 
  StyleSheet, 
  View, 
  Image,
  TouchableOpacity
} from 'react-native';

// STYLE IMPORTS
import { altColor1, altColor2 } from '../../theme-handler.js';

import { getMultipleValuesFromAsyncStorage } from '../../AsyncStorage-Handler.js';

import { API_URL } from '../../serverconf.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BottomBar = ({ navigation })  => {
    const [isLoading, setIsLoading] = useState(true);
    const [avatar_url, setAvatarUrl] = useState('');

    React.useEffect(() => {
        getMultipleValuesFromAsyncStorage(['@public_id', '@token']).then(storedData => {
            let public_id = storedData[0][1];
            let token = storedData[1][1];

            if (public_id) {
                fetch (API_URL + 'users/' + public_id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Access-Token': token
                    }
                }).then(response => {
                    response.json().then(data => ({
                        data: data,
                        status: response.status
                    }))
                    .then(res => {
                        if (res.status === 200) {
                            setAvatarUrl(res.data.avatar_url);
                            setIsLoading(false);
                        }
                    });
                });
            }
        });
    }, []);

    function handleChallengesButtonClick() {
        navigation.navigate('Challenges');
    }

    function handleBadgesButtonClick() {
        //navigation.navigate('Badges');
        alert('Not implemented yet');
    }

    function handleProfileButtonClick() {
        navigation.navigate('Profile');
    }

    if (isLoading) {
        return null;
    }

    return (
        <View style={styles.bottomBarContainer}>
            <View style={styles.bottomBarNavList}>
                <TouchableOpacity style={styles.bottomBarNavButton} title="Challenges" onPress={() => {handleChallengesButtonClick()}}>
                    <Image style={styles.bottomBarNavButtonImage} source={require('../../../assets/menu-icons/challenge-icon.png')}/>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.bottomBarNavButton} title="Badges" onPress={() => {handleBadgesButtonClick()}}>
                    <Image style={styles.bottomBarNavButtonImage} source={require('../../../assets/menu-icons/badge-icon.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarNavButton} title="Profile" onPress={() => {handleProfileButtonClick()}}>
                    <Image style={styles.bottomBarNavButtonProfileImage} source={{uri: avatar_url}}/>
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