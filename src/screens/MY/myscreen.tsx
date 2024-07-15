// src/screens/MY/myscreen.tsx

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MyScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>My Screen</Text> */}
      <View style={styles.roundedBox}/>

      {/* 회원정보 관리 */}
      <View style={styles.separator}/>
      <Text style={styles.manageInfo}>회원정보 관리</Text>
      <Text style={styles.editInfo}>회원정보 수정</Text>
      <Text style={styles.editPW}>비밀번호 수정</Text>

      {/* 나의 창작 */}
      <View style={styles.separator}/>
      <Text style={styles.myCreate}>나의 창작</Text>
      <Text style={styles.myNovel}>내가 창작한 소설</Text>

      {/* 고객센터 */}
      <View style={styles.separator}/>
      <Text style={styles.service}>고객센터</Text>
      <Text style={styles.policy}>운영정책</Text>
      <Text style={styles.question}>문의하기</Text>
      <Text style={styles.logOut}>로그아웃</Text>
      <Text style={styles.quitMember}>회원탈퇴</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
  },
  text: {
    fontSize: 20,
  },
  roundedBox: {
    width: '100%',
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#B1B1B1',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  manageInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: '#B1B1B1',
  },
  editInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
  },
  editPW: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
  },
  myCreate: {
    fontSize: 16,
    marginBottom: 8,
    color: '#B1B1B1',
  },
  myNovel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
  },
  service: {
    fontSize: 16,
    marginBottom: 8,
    color: '#B1B1B1',
  },
  policy: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
  },
  question: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
  },
  logOut: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
  },
  quitMember: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
  }
});

export default MyScreen;
