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
import FindIDScreen from '../screens/Login/FindIDScreen';
import FindPasswordScreen from '../screens/Login/FindPasswordScreen';
import SignUpScreen from '../screens/Login/SignUpScreen';

// My 관련 추가 내용
import ProfileScreen from '../screens/MY/profilescreen';
import MyNovel from '../screens/MY/mynovel';

//Create 관련 추가 내용
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
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="MyNovel" component={MyNovel} />

              {/* Create 관련 추가 내용 */}
              <Stack.Screen name="Create_1" component={Create_1} options={{ title: 'Create' }} />
              <Stack.Screen name="Create_2" component={Create_2} options={{ title: 'Create' }} />
              <Stack.Screen name="Create_3" component={Create_3} options={{ title: 'Create' }} />
              <Stack.Screen name="Create_4" component={Create_4} options={{ title: 'Create' }} />
              <Stack.Screen name="Create_5" component={Create_5} options={{ title: 'Create' }} />
              <Stack.Screen name="Create_6" component={Create_6} options={{ title: 'Create' }} />
              <Stack.Screen name="Create_7" component={Create_7} options={{ title: 'Create' }} />
              <Stack.Screen name="Create_8" component={Create_8} options={{ title: 'Create' }} />
              <Stack.Screen name="Create_9" component={Create_9} options={{ title: 'Create' }} />
              <Stack.Screen name="Create_10" component={Create_10} options={{ title: 'Create' }} />
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