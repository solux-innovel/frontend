// src/screens/LoginScreen.tsx

import React, {useContext} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../navigation/AppNavigator'; // 로그인 상태를 가져올 Context
import {login as kakaoLogin, getProfile} from '@react-native-seoul/kakao-login';

type RootStackParamList = {
  Main: undefined;
  FindID: undefined;
  FindPassword: undefined;
  SignUp: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {login} = useContext(AuthContext);

  const handleLogin = async (platform: string) => {
    try {
      if (platform === 'Kakao') {
        // 카카오 로그인 수행
        const result = await kakaoLogin();
        console.log('카카오 로그인 성공:', result);

        // 카카오 사용자 프로필 정보 가져오기
        const profile = await getProfile();
        console.log('카카오 사용자 정보:', profile);

        // 사용자 정보 출력
        const nickname = profile?.properties?.nickname || 'Unnamed';
        const email = profile?.kakao_account?.email || 'No Email';

        console.log('닉네임:', nickname);
        console.log('이메일:', email);

        // 로그인 성공 후 필요한 처리 추가
        login(); // 로그인 상태 업데이트
        navigation.replace('Main'); // 로그인 성공 후 메인 화면으로 이동
      } else {
        console.log(`${platform} 로그인 버튼 클릭됨`);
        // 다른 플랫폼 로그인 처리 (예: 네이버)
      }
    } catch (err) {
      console.error(`${platform} 로그인 실패:`, err);
    }
  };

  return (
    <View style={styles.container}>
      {/* 로고 이미지 */}
      <Image source={require('../../img/mainlogo.png')} style={styles.logo} />

      {/* 카카오와 네이버 로그인 버튼 */}
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

      {/* 아이디 찾기, 비밀번호 찾기, 회원가입 버튼을 한 줄로 배치 */}
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
