// REACT IMPORTS
import React from 'react';
import { 
  Dimensions, 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  Platform,
  TouchableHighlight,
} from 'react-native';

import countriesJSON from '../../assets/countries.json';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HideableView from './global-components/hideableview';

// STYLE IMPORTS
import GlobalStyles from '../global-styles.js';
import { textColor, altColor1, statusBarTheme, backgroundColor, colorScheme} from '../theme-handler.js';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { API_URL } from '../serverconf';
import { NavigationContainer } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUp = ({ navigation })  => {

  // DROP DOWN PICKER
  let data = '';
  const countriesItemsList = countriesJSON.map(i => (
     data = {label: i.Name, value: i.Code}
  ));
  const [countriesOpen, setCountriesOpen] = React.useState(false);
  const [countries, setCountries] = React.useState(countriesItemsList);

  // DATE PICKER
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  // USER DATA STATES
  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [passwordConf, setPasswordConf] = React.useState(null);
  const [selectedDOB, setSelectedDOB] = React.useState(null);
  const [textDob, setTextDob] = React.useState(null);
  const [selectedCountry, setSelectedCountry] = React.useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDOB(date);
    hideDatePicker();
  };

  // SIGN UP BUTTON CLICK
  function handleSignupButtonClick() {
    let user_dob = "";
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      console.log('First Name: ' + firstName + '\n' + 'Last Name: ' + lastName + '\n' + 'Email: ' + email + '\n' + 'Username: ' + username + '\n' + 'Password: ' + password + '\n' + 'Password Confirmation: ' + passwordConf + '\n' + 'Date of Birth: ' + selectedDOB + '\n' + 'Country: ' + selectedCountry);  
      user_dob = selectedDOB
    } else {
      console.log('First Name: ' + firstName + '\n' + 'Last Name: ' + lastName + '\n' + 'Email: ' + email + '\n' + 'Username: ' + username + '\n' + 'Password: ' + password + '\n' + 'Password Confirmation: ' + passwordConf + '\n' + 'Date of Birth: ' + textDob + '\n' + 'Country: ' + selectedCountry);
      
      let date = textDob.split('/');
      let month = date[1] - 1;

      user_dob = new Date(date[2], month, date[0], 12,0,0).toISOString().split('T')[0]
    }

    let country_id = null;

    if (password === passwordConf) {
      fetch (API_URL + 'countries/code/' + selectedCountry, {
        method: 'GET',
      })
      .then(response => {
        response.json().then(data => ({
          data: data,
          status: response.status
        }))
        
        .then(res => {
          country_id = res.data.id;

          fetch (API_URL + 'register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "username": username,
              "password": password,
              "email": email,
              "country_id": country_id,
              "given_name": firstName,
              "family_name": lastName,
              "date_of_birth": user_dob,
            })
          })

          .then(response => {
            response.json().then(data => ({
              data: data,
              status: response.status
            })).then(res => {

              if (res.status === 201) {
                console.log('Successfully registered user');
                
                navigation.navigate('Login');
              } else {
                console.log('Failed to register user');
              }

            });
          })

          .catch(error => {
            console.log(error);
          });

        });
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      alert('Passwords do not match');
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.centeredContainer}>
        <StatusBar style={statusBarTheme} />
        <Text style={styles.tagLine}>SIGN UP!</Text>
        <View style={styles.inputContainer}>
          <View style={styles.rowInputs}>
            <TextInput style={styles.signupTextBox} placeholder="First Name" placeholderTextColor={textColor} onChangeText={firstName => setFirstName(firstName)}/>
            <TextInput style={styles.signupTextBox} placeholder="Last Name" placeholderTextColor={textColor} onChangeText={lastName => setLastName(lastName)} />
          </View>
          <TextInput style={styles.signupTextBox} placeholder="Email" placeholderTextColor={textColor} onChangeText={email => setEmail(email)} />
          <TextInput style={styles.signupTextBox} placeholder="Username" placeholderTextColor={textColor} onChangeText={username => setUsername(username)}/>
          <View style={styles.rowInputs}>
            <TextInput style={styles.signupTextBox} placeholder="Password" secureTextEntry={true} placeholderTextColor={textColor} onChangeText={password => setPassword(password)} />
            <TextInput style={styles.signupTextBox} placeholder="Confirm Password" secureTextEntry={true} placeholderTextColor={textColor} onChangeText={passwordConf => setPasswordConf(passwordConf)} />
          </View>

          <HideableView visible={Platform.OS === 'android' || Platform.OS === 'ios' ? true : false}>
       
            <TouchableHighlight style={styles.dobTextBox} onPress={showDatePicker}>
              <Text style={styles.dobText}>DOB: {selectedDOB !== null ? selectedDOB.toLocaleDateString() : 'Select a Date'}</Text>
            </TouchableHighlight>
            
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              style={styles.datePicker}
            />
          </HideableView>
          
          <HideableView visible={Platform.OS === 'android' || Platform.OS === 'ios' ? false : true}>
            <TextInput style={styles.signupTextBox} placeholder="DOB" placeholderTextColor={textColor} onChangeText={dob => setTextDob(dob)} />
          </HideableView>

          <DropDownPicker
            open={countriesOpen}
            value={selectedCountry}
            items={countries}
            setOpen={setCountriesOpen}
            setValue={setSelectedCountry}
            setItems={setCountries}

            containerStyle={styles.dropDownContainer}
            listItemContainerStyle={styles.dropDownListItemContainer}
            listItemLabelStyle={styles.dropDownListItemLabel}
            textStyle={styles.dropDownText}

            placeholder="Country"

            showArrowIcon={false}
            showTickIcon={false}

            zIndex={1000}
            zIndexInverse={4000}
          />

          <TouchableHighlight style={styles.signupButton} onPress={() => handleSignupButtonClick()}>
            <Text style={styles.signupButtonText}>SIGN UP</Text>
          </TouchableHighlight>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: windowHeight * 0.5,
    height: windowHeight * 0.5,
  },

  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  signupTextBox: {
    height: windowHeight * 0.075,
    width: windowWidth * 0.4,
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

  dobText: {
    fontSize: 15,
    fontFamily: 'Roboto',
    color: textColor,
  },

  dobTextBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    height: windowHeight * 0.075,
    width: windowWidth * 0.4,
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

  tagLine: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: textColor,

    width: windowWidth * 0.75,
    paddingVertical: 25
  },

  dropDownContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth * 0.4,
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

  datePicker: {
    width: 0,
    height: 0,
  },

  signupButton: {
    width: windowWidth * 0.8,
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

  signupButtonText: {
    fontSize: 20,
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontWeight: 'bold',
    color: textColor,
  },
});

export default SignUp;