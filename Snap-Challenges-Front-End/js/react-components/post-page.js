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
    Platform,
    SafeAreaView
} from 'react-native';

import TopBar from './global-components/topbar.js';
import BottomBar from './global-components/bottombar.js';

// STYLE IMPORTS
import { altColor1, altColor2, textColor } from '../theme-handler.js';
import globalStyles from '../global-styles.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VoteComponent = ({kudos, downvotes}) => {
    return (
        <View style={styles.voteContainer}>
            <View style={styles.kudosContainer}>
                <View style={styles.kudosIconContainer}>
                    <Image style={styles.kudosImage} source={require('../../assets/menu-icons/kudos.png')} />
                </View>
                <Text style={styles.kudosText}> {kudos} </Text>
            </View>
            <View style={styles.downvotesContainer}>
                <View style={styles.downvotesIconContainer}>
                    <Image style={styles.downvoteImage} source={require('../../assets/menu-icons/downvote.png')} />
                </View>
                <Text style={styles.downvotesText}> {downvotes} </Text>
            </View>
        </View>
    );
}

const PostPage = ({post_id})  => {
    const [isLoading, setIsLoading] = React.useState(true);

    const [post_image_url, setPostImageURL] = React.useState('');
    const [post_description, setPostDescription] = React.useState('');

    //GET POST DATA FROM API

    return (
        <SafeAreaView style={globalStyles.centeredContainer}>
            <TopBar />
            <ScrollView contentContainerStyle={globalStyles.listContainer}>
                <Image style={globalStyles.postImage} source={{uri: post_image_url}} />
                <VoteComponent kudos={0} downvotes={0} />
                <Text style={globalStyles.postDescription}>{post_description}</Text>

            </ScrollView>
            <BottomBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    voteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
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
        color: altColor1,
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
        color: altColor1,
    },

    postImage: {
        width: windowWidth,
        height: windowWidth,
    },

    postDescription: {
        fontSize: 20,
        color: textColor,
        marginTop: 10,
        marginBottom: 10,
    },
});

export default PostPage;