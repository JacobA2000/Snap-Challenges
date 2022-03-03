// REACT IMPORTS
import React, { useEffect } from 'react';
import { 
    Dimensions, 
    StyleSheet, 
    Text, 
    View, 
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { SafeAreaView } from 'react-native-safe-area-context';

// STYLE IMPORTS
import GlobalStyles from '../global-styles.js';
import { statusBarTheme, altColor1, backgroundColor, textColor } from '../theme-handler.js';

import TopBar from './global-components/topbar.js';
import BottomBar from './global-components/bottombar.js';

import DropDownPicker from 'react-native-dropdown-picker';

import { API_URL } from '../serverconf.js';

import globalStates from '../global-states.js';

import { Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddChallengePage = ({navigation})  => {

    //STATES
    const [title, setTitle] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [startDate, setStartDate] = React.useState(new Date());
    const [selectedDuration, setSelectedDuration] = React.useState(null);

    // DROP DOWN PICKER
    const durationsList = [
        {label: '1', value: 1},
        {label: '3', value: 3},
        {label: '7', value: 7},
    ];
    const [durationsOpen, setDurationOpen] = React.useState(false);
    const [durations, setDurations] = React.useState(durationsList);

    const handleSubmit = () => {
        console.log('SUBMITTING');

        //CALCULATE END DATE
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + selectedDuration);

        console.log(title)
        console.log(desc)
        console.log(endDate);

        //SEND REQUEST TO SERVER
        fetch(API_URL + 'challenges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': globalStates.token
            },
            body: JSON.stringify({
                title: title,
                description: desc,
                start_date: convertDateToSQLFormat(startDate),
                end_date: convertDateToSQLFormat(endDate)
            })
        }).then(response => {
            response.json().then(data => ({
                data: data,
                status: response.status
            }))
            .then(res => {
                if (res.status === 201) {
                    console.log('SUCCESS');
                    alert('Challenge created successfully!');
                    //GO BACK TO CHALLENGES PAGE
                    navigation.goBack();
                } else {
                    console.log('FAILURE');
                }
            })
        })
    }

    return (
        <SafeAreaView style={ GlobalStyles.listContainer }>
            <StatusBar style={ statusBarTheme } />
            <TopBar />
            
            <View style={ GlobalStyles.centeredContainer }>
                <Text style={ styles.titleText }>
                    Add a Challenge
                </Text>

                <TextInput
                    style={ styles.textInput }
                    placeholder="Title"
                    placeholderTextColor={textColor}
                    onChangeText={ (text) => setTitle(text) }
                />

                <TextInput
                    style={ styles.largeTextInput }
                    placeholder="Description"
                    placeholderTextColor={textColor}
                    onChangeText={ (text) => setDesc(text) }
                    multiline={true}
                />

                <DropDownPicker
                    open={durationsOpen}
                    value={selectedDuration}
                    items={durations}
                    setOpen={setDurationOpen}
                    setValue={setSelectedDuration}
                    setItems={setDurations}

                    containerStyle={styles.dropDownContainer}
                    listItemContainerStyle={styles.dropDownListItemContainer}
                    listItemLabelStyle={styles.dropDownListItemLabel}
                    textStyle={styles.dropDownText}

                    placeholder="Challenge Duration"

                    showArrowIcon={false}
                    showTickIcon={false}

                    zIndex={1000}
                    zIndexInverse={4000}
                />

                <TouchableOpacity
                    style={ styles.submitButton }
                    onPress={handleSubmit}
                >
                    <Text style={ styles.submitButtonText }>
                        Submit
                    </Text>
                </TouchableOpacity>


            </View>

            <BottomBar />

        </SafeAreaView>
    );
}

function convertDateToSQLFormat(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: textColor
    },
    textInput: {
        height: windowHeight * 0.075,
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
    dropDownContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: windowWidth * 0.85,
        height: windowHeight * 0.075,
    
        margin: 5,
      },
    
      dropDownListItemContainer: {
        backgroundColor: backgroundColor,
      },
    
      dropDownListItemLabel: {
        color: textColor,
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: 'bold',
      },
    
      dropDownText: {
        color: Platform.OS === 'android' ? 'black' : textColor,
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: 'bold',
    
        paddingLeft: 10,
        paddingRight: 10
      },

      submitButton: {
        width: windowWidth * 0.85,
        height: windowHeight * 0.1,
        backgroundColor: altColor1,
        textAlign: 'center',
        color: textColor,
        fontSize: 20,
        fontFamily: 'Roboto',
        borderRadius: 10,
        
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
    
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    
      submitButtonText: {
        fontSize: 20,
        fontFamily: 'Roboto',
        textAlign: 'center',
        fontWeight: 'bold',
        color: textColor,
      },

});

export default AddChallengePage;