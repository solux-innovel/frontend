// src/screens/LoginScreen.tsx
//0723 추가함

// LoginScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { AuthContext } from '../../navigation/AppNavigator';
import NaverLogin, { NaverLoginResponse, GetProfileResponse } from '@react-native-seoul/naver-login';

const androidKeys = {
  consumerKey: 'Wx_9q1TN5D2SRBHpzqTt',
  consumerSecret: 'Xh0LFFTMgY',
  appName: "innovel",
};

const initials = androidKeys;

type RootStackParamList = {
  Main: undefined;
  FindID: undefined;
  FindPassword: undefined;
  SignUp: undefined;
  LoginScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    NaverLogin.initialize(initials);
  }, []);

  const handleNaverLogin = async () => {
    try {
      const result: NaverLoginResponse | null = await NaverLogin.login();
      console.log("네이버 로그인 결과:", result);

      if (result && result.isSuccess && result.successResponse) {
        const profile: GetProfileResponse = await NaverLogin.getProfile(result.successResponse.accessToken);
        console.log("사용자 프로필:", profile);

        // 사용자 프로필을 백엔드로 전송 
        const response = await fetch('https://c285-115-143-35-238.ngrok-free.app/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: profile.response.id,
            nickname: profile.response.nickname, // nickname 추가
            email: profile.response.email,
          }),
        });

        if (response.status === 200) {
          Alert.alert('로그인 성공', '백엔드로 사용자 프로필 전송 성공');
          login();
          navigation.replace('Main');
        } else {
          Alert.alert('로그인 실패', '백엔드로 사용자 프로필 전송 실패');
        }
      } else if (result && result.failureResponse) {
        Alert.alert('로그인 실패', `실패 이유: ${result.failureResponse.message}`);
      } else {
        Alert.alert('로그인 실패', '인가 코드를 받지 못했습니다.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('로그인 실패', '네이버 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await NaverLogin.logout();
      Alert.alert('로그아웃 성공', '로그아웃이 완료되었습니다.');
      navigation.replace('LoginScreen');
    } catch (err) {
      console.error(err);
      Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleLogin = (platform: string) => {
    if (platform === 'Naver') {
      handleNaverLogin();
    } else {
      console.log(`${platform} 로그인 버튼 클릭됨`);
      login();
      navigation.replace('Main');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../img/mainlogo.png')} style={styles.logo} />

      <TouchableOpacity onPress={() => handleLogin('Kakao')} style={styles.button}>
        <Image source={require('../../img/kakaobutton.png')} style={styles.buttonImage} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLogin('Naver')} style={styles.button}>
        <Image source={require('../../img/naverbutton.png')} style={styles.buttonImage} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('FindID')}>
          <Text style={styles.text}>아이디 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FindPassword')}>
          <Text style={styles.text}>비밀번호 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.text}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  logo: {
    width: '95%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 100,
  },
  button: {
    width: '95%',
    height: 50,
    marginVertical: 10,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000000',
    marginHorizontal: 3,
  },
  separator: {
    fontSize: 16,
    color: '#000000',
    marginHorizontal: 3,
  },
});

export default LoginScreen;