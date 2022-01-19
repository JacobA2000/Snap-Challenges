// REACT IMPORTS
import React from 'react';
import { 
  Dimensions, 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  Image,
  Platform,
  Button,
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUp = ()  => {

  // DROP DOWN PICKER
  let data = '';
  const countriesItemsList = countriesJSON.map(i => (
     data = {label: i.Name, value: i.Code}
  ));
  const [countriesOpen, setCountriesOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(null);
  const [countries, setCountries] = React.useState(countriesItemsList);

  // DATE PICKER
  let currentDate = new Date();
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [selectedDOB, setSelectedDOB] = React.useState(null);

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

  return (
    <SafeAreaView style={GlobalStyles.centeredContainer}>
        <StatusBar style={statusBarTheme} />
        <Text style={styles.tagLine}>SIGN UP!</Text>
        <View style={styles.inputContainer}>
          <View style={styles.rowInputs}>
            <TextInput style={styles.signupTextBox} placeholder="First Name" placeholderTextColor={textColor} />
            <TextInput style={styles.signupTextBox} placeholder="Last Name" placeholderTextColor={textColor} />
          </View>
          <TextInput style={styles.signupTextBox} placeholder="Email" placeholderTextColor={textColor} />
          <TextInput style={styles.signupTextBox} placeholder="Username" placeholderTextColor={textColor} />
          <View style={styles.rowInputs}>
            <TextInput style={styles.signupTextBox} placeholder="Password" secureTextEntry={true} placeholderTextColor={textColor} />
            <TextInput style={styles.signupTextBox} placeholder="Confirm Password" secureTextEntry={true} placeholderTextColor={textColor}  />
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

            zIndex={1000}
            zIndexInverse={4000}
          />
        
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
  },

  datePicker: {
    width: 0,
    height: 0,
  },

});

export default SignUp;