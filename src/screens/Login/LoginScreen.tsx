// src/screens/LoginScreen.tsx

import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import {AuthContext} from '../../navigation/AppNavigator';
import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import {
  login as kakaoLogin,
  getProfile as getKakaoProfile,
} from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const androidKeys = {
  consumerKey: 'Wx_9q1TN5D2SRBHpzqTt',
  consumerSecret: 'Xh0LFFTMgY',
  appName: 'innovel',
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
  const {login} = useContext(AuthContext);

  useEffect(() => {
    NaverLogin.initialize(initials);
  }, []);

  const handleKakaoLogin = async () => {
    try {
      const token = await kakaoLogin();
      console.log('Kakao login success:', token);

      const profile = await getKakaoProfile();
      console.log('Kakao profile:', profile);

      const id = profile.id || 'No ID';
      const nickname = profile.nickname || 'Unnamed';
      const email = profile.email || 'No Email';

      console.log('id:', id);
      console.log('nickname:', nickname);
      console.log('email:', email);

      // 백엔드 서버에 사용자 정보 전송
      const response = await fetch('https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          body: JSON.stringify({
            id: id,
            nickname: nickname,
            email: email,
          }),

        },
      );

      await AsyncStorage.setItem('userId', String(id));
      await AsyncStorage.setItem('userNickname', nickname);
      await AsyncStorage.setItem('userEmail', email);

      const responseData = await response.json();
      if (response.ok) {
        console.log('Server response:', responseData);
        login(); // 로그인 상태 업데이트
        navigation.replace('Main'); // 로그인 성공 후 메인 화면으로 이동
      } else {
        console.error('Server error:', responseData);
      }
    } catch (err) {
      console.error('Kakao login failed:', err);
    }
  };

  const handleNaverLogin = async () => {
    try {
      const result: NaverLoginResponse | null = await NaverLogin.login();
      console.log('네이버 로그인 결과:', result);

      if (result && result.isSuccess && result.successResponse) {
        const profile: GetProfileResponse = await NaverLogin.getProfile(
          result.successResponse.accessToken,
        );
        console.log('사용자 프로필:', profile);

        // 사용자 프로필을 백엔드로 전송, 이 부분 url 업데이트 필요
        const response = await fetch('https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/users/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: profile.response.id,
              nickname: profile.response.nickname, // nickname 추가
              email: profile.response.email,
            }),
          },
        );

        await AsyncStorage.setItem('userId', String(profile.response.id));
        await AsyncStorage.setItem(
          'userNickname',
          String(profile.response.nickname),
        );
        await AsyncStorage.setItem('userEmail', profile.response.email);

        if (response.status === 200) {
          Alert.alert('로그인 성공', '백엔드로 사용자 프로필 전송 성공');
          login();
          navigation.replace('Main');
        } else {
          Alert.alert('로그인 실패', '백엔드로 사용자 프로필 전송 실패');
        }
      } else if (result && result.failureResponse) {
        Alert.alert(
          '로그인 실패',
          `실패 이유: ${result.failureResponse.message}`,
        );
      } else {
        Alert.alert('로그인 실패', '인가 코드를 받지 못했습니다.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('로그인 실패', '네이버 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogin = (platform: string) => {
    if (platform === 'Naver') {
      handleNaverLogin();
    } else if (platform === 'Kakao') {
      handleKakaoLogin();
    } else {
      console.log(`${platform} 로그인 버튼 클릭됨`);
      login();
      navigation.replace('Main');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../img/mainlogo.png')} style={styles.logo} />

      <TouchableOpacity
        onPress={() => handleLogin('Kakao')}
        style={styles.button}>
        <Image
          source={require('../../img/kakaobutton.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleLogin('Naver')}
        style={styles.button}>
        <Image
          source={require('../../img/naverbutton.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => handleLogin('임시 로그인')}>
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
    width: '90%',
    height: 60,
    marginVertical: 8,
    borderRadius: 40,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
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
