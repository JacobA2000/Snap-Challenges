// REACT IMPORTS
import React, { Component, useEffect } from 'react';

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

// MY SCRIPT IMPORTS
import { getToken } from './js/flask-api-token.js';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      isLoading: true,
      initRoute: 'Login',
    };
  }

  componentDidMount() {
    getToken().then(token => {
      this.setState({
        token: token,
        isLoading: false,
      });

      if (token) {
        this.setState({
          initRoute: 'Challenges',
        });

        
        // TODO - REFRESH TOKEN

      }
    });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    return (
      <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={this.state.initRoute}>
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
}

// export default function App() {

//   const [loading, setLoading] = useState(true);

//   let initRoute = null;
//   let token = '';

//   useEffect(() => {
//     setLoading(true);
//     getToken().then(res => {
//       token = res;

//       if (token !== null) {
//         initRoute = 'Challenges';
//       } else {
//         initRoute = 'Login';
//       }

//       setLoading(false);
//     }
//     );
//   }, []);

//   return (
//     {!loading ? <Loading/> 
//       :
//         <SafeAreaProvider>
//           <NavigationContainer>
//             <Stack.Navigator initialRouteName={initRoute}>
//               <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//               <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
//               <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
//               <Stack.Screen name="Challenges" component={Challenges} options={{ headerShown: false }} />

//               {/* TEST PAGE FOR DEBUGGING PURPOSES ONLY - REMOVE BEFORE RELEASE */}
//               <Stack.Screen name="TestP" component={TestPage} options={{ headerShown: false }} />
//             </Stack.Navigator>
//           </NavigationContainer>
//         </SafeAreaProvider>
//     }
//   );
// }