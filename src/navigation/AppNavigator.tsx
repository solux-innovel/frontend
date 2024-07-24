// src/navigation/AppNavigator.tsx
//0723 수정 버전

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/Login/LoginScreen'; // 로그인 화면 컴포넌트 추가
import Home from '../screens/Home/homescreen';
import Search from '../screens/Search/searchscreen';
import My from '../screens/MY/myscreen';
import Create from '../screens/Create/createscreen';
import FindIDScreen from '../screens/Login/FindIDScreen';
import FindPasswordScreen from '../screens/Login/FindPasswordScreen';
import SignUpScreen from '../screens/Login/SignUpScreen';

// My 관련 추가 내용
import ProfileScreen from '../screens/MY/profilescreen';
import MyNovel from '../screens/MY/mynovel';

// 로그인 상태를 관리하는 Context (예시)
const AuthContext = React.createContext({ isLoggedIn: false, login: () => {}, logout: () => {} });

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // 상태를 통해 로그인 상태를 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태를 변경하는 함수
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            // 로그인된 상태일 때
            <>
              <Stack.Screen
                name="Main"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Search" component={Search} />
              <Stack.Screen name="My" component={My} />
              <Stack.Screen name="Create" component={Create} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="MyNovel" component={MyNovel} />
              
            </>
          ) : (
            // 로그인되지 않은 상태일 때
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
              <Stack.Screen name="FindID" component={FindIDScreen} />
              <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export { AppNavigator, AuthContext };
export default AppNavigator;
