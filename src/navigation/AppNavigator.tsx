import React, {useState, createContext} from 'react';
import {Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import your screens
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import Home from '../screens/Home/homescreen';
import Search from '../screens/Search/searchscreen';
import RecentViewedScreen from '../screens/Home/RecentViewedScreen';
import RecommendedScreen from '../screens/Home/RecommendedScreen';
import My from '../screens/MY/myscreen';
import GenreScreen from '../screens/Novel/GenreScreen';
import FindIDScreen from '../screens/Login/FindIDScreen';
import FindPasswordScreen from '../screens/Login/FindPasswordScreen';
import SignUpScreen from '../screens/Login/SignUpScreen';
import ProfileScreen from '../screens/MY/profilescreen';
import MyNovel from '../screens/MY/mynovel';
import Create_1 from '../screens/Create/create_1';
import Create_2 from '../screens/Create/create_2';
import Create_3 from '../screens/Create/create_3';
import Create_4 from '../screens/Create/create_4';
import Create_5 from '../screens/Create/create_5';
import Create_6 from '../screens/Create/create_6';
import Create_7 from '../screens/Create/create_7';
import Create_8 from '../screens/Create/create_8';
import Create_9 from '../screens/Create/create_9';
import Create_10 from '../screens/Create/create_10';

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{isLoggedIn, login, logout}}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name="Main"
                component={BottomTabNavigator}
                options={{headerShown: false}}
              />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Search" component={Search} />
              <Stack.Screen name="My" component={My} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="MyNovel" component={MyNovel} />
              <Stack.Screen name="Genre" component={GenreScreen} />
              <Stack.Screen
                name="RecentViewed"
                component={RecentViewedScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Recommended"
                component={RecommendedScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Create_1"
                component={Create_1}
                options={{title: 'Create'}}
              />
              {/* Add the rest of your Create screens here */}
            </>
          ) : (
            <>
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen name="FindID" component={FindIDScreen} />
              <Stack.Screen
                name="FindPassword"
                component={FindPasswordScreen}
              />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export {AppNavigator, AuthContext};
export default AppNavigator;
