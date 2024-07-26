// src/screens/Create/create_10.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

const imageSource = require('../../img/Create/Create10_image.png');

const Create_10 = () => {
  const navigation = useNavigation();

  const [buttonColor, setButtonColor] = useState("#9B9AFF");

  useEffect(() => {

  }, []);

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton = () => {
    setButtonColor("#000000");
    setTimeout(() => {
      setButtonColor("#9B9AFF");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Main', state: { routes: [{ name: 'Home' }] } },
          ],
        })
      );
    }, 50); // 버튼 색상 복구
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'눈송이 창작자님이 창작한\n소설을 발행하는 데에 성공했습니다!'}</Text>
        <Image source={imageSource} style={styles.image}/>
        <Text style={styles.bottomText}>{'소설을 발행하신 것을 축하드립니다!\n앞으로도 눈송이 창작자님의 소설 창작을\n이노블이 열심히 응원하고 돕겠습니다'}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor}]} onPress={handlePressButton}>
        <Text style={styles.buttonText}>홈 화면으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 40,
    color: '#000000',
    fontWeight: 'bold',
  },
  bottomText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
  },
  image: {
    width: 320,
    height: 300,
    margin: 40,
  },
  button: {
    bottom: 30,
    position: 'absolute',
    height: 60,
    width: '90%',
    borderRadius: 15,
    backgroundColor: "#9B9AFF",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default Create_10;
