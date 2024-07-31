// src/navigation/AppNavigator.tsx

import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import Home from '../screens/Home/homescreen';
import Search from '../screens/Search/searchscreen';
import My from '../screens/MY/myscreen';
import Create from '../screens/Create/createscreen';
import Genre from '../screens/Novel/GenreScreen'; // Genre 화면 추가
import RecentViewedScreen from '../screens/RecentViewed/RecentViewedScreen'; // RecentViewedScreen 화면 추가
import RecommendedScreen from '../screens/Recommended/RecommendedScreen'; // RecommendedScreen 화면 추가 (필요시)

// 로그인 관련 화면들
import LoginScreen from '../screens/Login/LoginScreen';
import FindIDScreen from '../screens/Login/FindIDScreen';
import FindPasswordScreen from '../screens/Login/FindPasswordScreen';
import SignUpScreen from '../screens/Login/SignUpScreen';

// My 관련 화면들
import ProfileScreen from '../screens/MY/profilescreen';
import MyNovel from '../screens/MY/mynovel';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Main screen with BottomTabNavigator */}
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator} // Ensure BottomTabNavigator is a separate screen
          options={{headerShown: false}}
        />
        {/* Other screens */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="My" component={My} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="Genre" component={Genre} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export {AppNavigator};
export default AppNavigator;
