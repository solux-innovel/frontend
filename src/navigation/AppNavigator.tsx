// src/navigation/AppNavigator.tsx

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import Home from '../screens/Home/homescreen';
import Search from '../screens/Search/searchscreen';
import My from '../screens/MY/myscreen';
import Create from '../screens/Create/createscreen';

//My 관련 추가 내용
import ProfileScreen from '../screens/MY/profilescreen';
import MyNovel from '../screens/MY/mynovel';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="My" component={My} />
        <Stack.Screen name="Create" component={Create} />

        {/* My 관련 추가 내용 */}
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="MyNovel" component={MyNovel} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
