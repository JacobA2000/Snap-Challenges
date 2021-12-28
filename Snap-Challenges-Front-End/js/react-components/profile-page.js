// REACT IMPORTS
import React from 'react';
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

const ProfileDescriptionStats = () => {
    return (
        <View style={styles.profileDescStatsContainer}>
            <View style={styles.profileDescription}>
                <Image style={GlobalStyles.avatarImage} source={{uri: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"}} />
                <View style={styles.profileDescriptionTextContainer}>
                    <View style={styles.usernameFlagContainer}>
                        <Text style={styles.usernameText} numberOfLines={1}>@username</Text>
                        <Image style={styles.flagImage} source={require("../../assets/flags/gb.png")} />
                    </View>
                    <Text style={styles.bioText} numberOfLines={4}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero sem, posuere vel massa vestibulum, maximus rutrum nisl. Nam sed orci dui. Praesent at mi efficitur, volutpat tortor tincidunt, molestie nulla. Nulla vel ultricies nibh, ac tempor sem. Morbi elementum quam ut eros dapibus, eget maximus libero malesuada. Phasellus lobortis feugiat erat, sit amet fermentum mi. Sed rhoncus gravida turpis eu rutrum. Aliquam placerat elementum orci, tempor faucibus lorem sagittis in. Curabitur malesuada, est non ornare ornare, orci quam efficitur neque, vel efficitur dui lorem id est. Vestibulum elit leo, pretium ac erat et, mollis dignissim enim.</Text>
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
                    <StatCounter title="Posts" value="0" />
                    <StatCounter title="Kudos Recieved" value="0" />
                </View>

            </View>
        </View>
    );
}        

const Profile = ()  => {
    let image_path = "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60";

    let imgs = [image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path, image_path]
    //let imgs = [];

    return (
        <SafeAreaView style={GlobalStyles.centeredContainer}>
            <StatusBar style={statusBarTheme} />
            <Topbar />

            <ProfileDescriptionStats />
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