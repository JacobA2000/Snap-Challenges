// REACT IMPORTS
import React from 'react';
import { Dimensions, View } from 'react-native';

// RERACT NAVIGATION IMPORTS
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// STYLE IMPORTS
import GlobalStyles from './js/global-styles.js';

// COMPONENT IMPORTS
import Login from './js/react-components/login.js';
import SignUpDetailsForm from './js/react-components/sign-up-details-form.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpDetailsForm" component={SignUpDetailsForm} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}