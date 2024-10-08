import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/homescreen';
import Search from '../screens/Search/searchscreen';
import My from '../screens/MY/myscreen';
import Create from '../screens/Create/create_1';

const homeIcon = require('../img/home.png');
const searchIcon = require('../img/search.png');
const myIcon = require('../img/my.png');
const createIcon = require('../img/create.png');
const logoTitle = require('../img/logoTitle.png');

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = homeIcon;
          } else if (route.name === 'Search') {
            iconSource = searchIcon;
          } else if (route.name === 'My') {
            iconSource = myIcon;
          } else if (route.name === 'Create') {
            iconSource = createIcon;
          }

          return (
            <Image
              source={iconSource}
              style={{width: size, height: size, tintColor: color}}
            />
          );
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerTitle: () => (
          <Image
            source={logoTitle}
            style={{width: 150, height: 50}}
            resizeMode="contain"
          />
        ),
        headerTitleAlign: 'center',
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Create" component={Create} />
      <Tab.Screen name="My" component={My} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;