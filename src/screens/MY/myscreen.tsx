// src/screens/MY/myscreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const profileImage = require('../../img/My/Profile.png');
const faceImage = require('../../img/My/Face.png');
const arrowIcon = require('../../img/My/Arrow.png');

const MyScreen = ({ navigation }) => {
  //사용자명 상태 변수
  const [userName, setUserName] = useState('눈송이');

  // 사용자명 저장하기
  useEffect(() => {
    const saveUserName = async () => {
      try {
        await AsyncStorage.setItem('userName', userName);
      } catch (error) {
        console.error('Failed to save the user name.', error);
      }
    };

    saveUserName();
  }, [userName]); // userName 상태가 변경될 때마다 실행

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

      {/* 회원정보 관리 */}
      <View style={styles.separator} />
      <Text style={styles.headerText}>회원정보 관리</Text>
      <Text style={styles.menuText}>회원정보 수정</Text>
      <Text style={styles.menuText}>비밀번호 수정</Text>

      {/* 나의 창작 */}
      <View style={styles.separator} />
      <Text style={styles.headerText}>나의 창작</Text>
      <TouchableOpacity onPress={() => navigation.navigate('MyNovel')}>
        <Text style={styles.menuText}>내가 창작한 소설</Text>
      </TouchableOpacity>

      {/* 고객센터 */}
      <View style={styles.separator} />
      <Text style={styles.headerText}>고객센터</Text>
      <Text style={styles.menuText}>운영정책</Text>
      <Text style={styles.menuText}>문의하기</Text>
      <Text style={styles.menuText}>로그아웃</Text>
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
  }
});

export default MyScreen;