import React, {useContext} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../navigation/AppNavigator';
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

  const handleKakaoLogin = async () => {
    try {
      const token = await signInWithKakao();
      console.log('Kakao login success:', token);

      const profile = await getKakaoProfile();
      console.log('Kakao profile:', profile);

      const id = profile.id || 'No ID';
      const nickname = profile.nickname || 'Unnamed';
      const email = profile.email || 'No Email';

      console.log('id:', id);
      console.log('nickname:', nickname);
      console.log('email:', email);

      login(); // 로그인 상태 업데이트
      navigation.replace('Main'); // 로그인 성공 후 메인 화면으로 이동
    } catch (err) {
      console.error('Kakao login failed:', err);
    }
  };

  const signInWithKakao = async () => {
    return await kakaoLogin()
      .then(result => {
        return result;
      })
      .catch(error => {
        throw error;
      });
  };

  const getKakaoProfile = async () => {
    try {
      const result = await getProfile();
      console.log('getProfile result:', result); // 전체 응답을 출력하여 확인

      return {
        nickname: result.nickname || 'Unnamed', // 올바른 프로퍼티 접근
        email: result.email || 'No Email', // 올바른 프로퍼티 접근
        id: result.id || 'No ID', // 올바른 프로퍼티 접근
      };
    } catch (error) {
      console.error('Failed to get Kakao profile:', error);
      return {
        nickname: 'Unnamed',
        email: 'No Email',
        id: 'No ID',
      };
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../img/mainlogo.png')} style={styles.logo} />

      <TouchableOpacity onPress={handleKakaoLogin} style={styles.button}>
        <Image
          source={require('../../img/kakaobutton.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => console.log('Naver login clicked')}
        style={styles.button}>
        <Image
          source={require('../../img/naverbutton.png')}
          style={styles.buttonImage}
        />
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
