// REACT IMPORTS
import React from 'react';

// RERACT NAVIGATION IMPORTS
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// PAGE COMPONENT IMPORTS
import Login from './js/react-components/login-page.js';
import SignUp from './js/react-components/sign-up-page.js';
import Profile from './js/react-components/profile-page.js';
import Challenges from './js/react-components/challenges-page.js';

import TestPage from './js/react-components/test-page.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Challenges">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="Challenges" component={Challenges} options={{ headerShown: false }} />

          {/* TEST PAGE FOR DEBUGGING PURPOSES ONLY - REMOVE BEFORE RELEASE */}
          <Stack.Screen name="TestP" component={TestPage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}