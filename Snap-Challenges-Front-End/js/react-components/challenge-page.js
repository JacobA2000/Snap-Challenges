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

import { StatusBar } from 'expo-status-bar';

import { SafeAreaView } from 'react-native-safe-area-context';

// STYLE IMPORTS
import GlobalStyles from '../global-styles.js';
import { statusBarTheme } from '../theme-handler.js';

import TopBar from './global-components/topbar.js';
import BottomBar from './global-components/bottombar.js';
import ChallengeList from './global-components/challengeslist.js';

import { API_URL } from '../serverconf.js';

import globalStates from '../global-states.js';
import ChallengeCard from './global-components/challengecard.js';
import ImageGrid from './global-components/imagegrid.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChallengePage = ({ route })  => {

    //GET THE CHALLENGE DATA FROM THE ROUTE
    const challengeId = route.params.id;
    const challengeTitle = route.params.title;
    const challengeDesc = route.params.desc;
    const challengeEndDate = route.params.end_date;
    const challengeTimesCompleted = route.params.timesCompleted;

    const [isLoading, setIsLoading] = React.useState(true);

    const [images, setImages] = React.useState([]);

    useEffect(() => {
        fetch(API_URL + 'challenges/' + challengeId + '/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': globalStates.token
            }
        }).then(response => {
            response.json().then(data => ({
                data: data,
                status: response.status
            }))
            .then(res => {
                if (res.status === 200) {
                    let posts = res.data.posts;
                    let postsData = [];
                    let postsImages = [];

                    if (posts.length === 0) {
                        setIsLoading(false);
                    }
                    
                    posts.forEach(post => {
                        let postId = post.post_id;

                        fetch(API_URL + 'posts/' + postId, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-access-token': globalStates.token
                            }
                        }).then(response => {
                            response.json().then(data => ({
                                data: data,
                                status: response.status
                            }))
                            .then(res => {

                                if (res.status === 200) {
                                    postsData.push(res.data);
                                    
                                    // GET PHOTO DATA FROM API
                                    fetch(API_URL + 'photos/' + res.data.photo_id, {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'x-access-token': globalStates.token
                                        }
                                    }).then(response => {
                                        response.json().then(data => ({
                                            data: data,
                                            status: response.status
                                        }))
                                        .then(res => {
                                            if (res.status === 200) {
                                                postsImages.push({post_id: postId, url: res.data.url, upvotes: res.data.upvotes});
                                            
                                                setImages(postsImages);

                                                //Check if the last image has been added
                                                if (postsImages.length === posts.length) {
                                                    setIsLoading(false);
                                                }
                                            }
                                        })
                                    })
                                }
                            })
                        })
                    });
                }
            })
        })

        
        

    }, [])

    if (isLoading) {
        return null
    }

    return (
        <SafeAreaView style={ GlobalStyles.listContainer }>
            <StatusBar style={ statusBarTheme } />
            <TopBar />
            
            <View style={ GlobalStyles.centeredContainer }>
                <ChallengeCard id={ challengeId } title={ challengeTitle } desc={ challengeDesc } end_date={ challengeEndDate } timesCompleted={ challengeTimesCompleted } />
                
                <ImageGrid
                    images={images}
                />
            </View>

            <BottomBar />

        </SafeAreaView>
    );
}

export default ChallengePage;