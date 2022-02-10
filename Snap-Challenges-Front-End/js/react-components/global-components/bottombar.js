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

import { useNavigation } from '@react-navigation/native';

import { API_URL } from '../../serverconf.js';
import globalStates from '../../global-states.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BottomBar = ()  => {
    const [isLoading, setIsLoading] = useState(true);
    const [avatar_url, setAvatarUrl] = useState('');

    const navigation = useNavigation();

    React.useEffect(() => {
        // GET TOKEN AND PUBLIC ID FROM GLOBAL STATE
        let public_id = globalStates.public_id;
        let token = globalStates.token;

        if (public_id && token) {
            // FETCH USER DATA FROM API AND CATCH ANY ERRORS
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
            })
            .catch(error => {
                console.log(error);
            });
        }
    }, []);

    function handleChallengesButtonClick() {
        navigation.navigate('Challenges');
    }

    function handleBadgesButtonClick() {
        //navigation.navigate('Badges');
        alert('Not implemented yet');
    }

    function handleProfileButtonClick() {
        navigation.navigate('Profile', globalStates.public_id);
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