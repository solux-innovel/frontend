// src/screens/MY/myscreen.tsx

// MyScreen.tsx 파일에서
// MyScreen.tsx
// MyScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NaverLogin from '@react-native-seoul/naver-login';
import { AuthContext } from '../../navigation/AppNavigator'; // AuthContext 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';

const profileImage = require('../../img/My/Profile.png');
const faceImage = require('../../img/My/Face.png');
const arrowIcon = require('../../img/My/Arrow.png');

type RootStackParamList = {
  ProfileScreen: undefined;
  MyNovel: undefined;
  LoginScreen: undefined; // 수정된 이름
  // 다른 화면도 여기에 추가할 수 있습니다.
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useContext(AuthContext); // AuthContext에서 logout 함수 가져오기

  // 사용자명 상태 변수
  const [userName, setUserName] = useState<string | null>(null);

  // AsyncStorage에서 사용자명 불러오기
  useEffect(() => {
    const loadUserName = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userNickname');
        if (storedUserName) {
          setUserName(storedUserName);
        } else {
          setUserName('눈송이'); // 기본값 설정
        }
      } catch (error) {
        console.error('Failed to load the user name.', error);
      }
    };

    loadUserName();
  }, []); // 빈 배열을 넣으면 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.

  const handleLogout = async () => {
    try {
      // 네이버 로그아웃 처리
      await NaverLogin.logout();

      // 카카오 로그아웃 처리
      await logout();

      //로그아웃 되면 없어져야 됨
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userNickname');
      await AsyncStorage.removeItem('userEmail');
      
      Alert.alert('로그아웃 성공', '로그아웃이 완료되었습니다.');
      logout(); // AuthContext를 이용해 로그인 상태를 업데이트
      navigation.navigate('LoginScreen'); // 로그인 화면으로 네비게이션
    } catch (err) {
      console.error(err);
      Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <Image source={faceImage} style={styles.faceImage} />
        <Text style={styles.nameText}>{userName}님</Text>
        <TouchableOpacity style={styles.arrowContainer} onPress={() => navigation.navigate('ProfileScreen')}>
          <Image source={arrowIcon} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.separator}/>
      <Text style={styles.headerText}>회원정보 관리</Text>
      <Text style={styles.menuText}>회원정보 수정</Text>
      <Text style={styles.menuText}>비밀번호 수정</Text>

      <View style={styles.separator}/>
      <Text style={styles.headerText}>나의 창작</Text>
      <TouchableOpacity onPress={() => navigation.navigate('MyNovel')}>
        <Text style={styles.menuText}>내가 창작한 소설</Text>
      </TouchableOpacity>

      <View style={styles.separator}/>
      <Text style={styles.headerText}>고객센터</Text>
      <Text style={styles.menuText}>운영정책</Text>
      <Text style={styles.menuText}>문의하기</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.menuText}>로그아웃</Text>
      </TouchableOpacity>
      <Text style={styles.menuText}>회원탈퇴</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  profileContainer: {
    width: '100%',
    height: '25%',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  faceImage: {
    position: 'absolute',
    left: '10%',
    top: '18%',
    width: 100,
    height: 100,
  },
  nameText: {
    position: 'absolute',
    left: '40%',
    top: '40%',
    fontSize: 18,
    color: '#000000',
  },
  arrowContainer: {
    position: 'absolute',
    right: '5%',
    top: '35%',
  },
  arrowIcon: {
    width: 50,
    height: 50,
  },
  separator: {
    width: '90%',
    height: 1,
    backgroundColor: '#B1B1B1',
    alignSelf: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 16,
    color: '#B1B1B1',
  },
  menuText: {
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 16,
    color: '#000000',
  },
});

export default MyScreen;
