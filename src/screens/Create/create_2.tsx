// src/screens/Create/create_2.tsx

import React, { useState } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const imageSource = require('../../img/Create/Create2_image.png');

const Create_2 = () => {
  const navigation = useNavigation();

  const [buttonColor, setButtonColor] = useState("#9B9AFF");

  // 버튼 색상 변경 함수
  const handlePress = () => {
    setButtonColor("#000000");
    setTimeout(() => {
      setButtonColor("#9B9AFF");
      navigation.navigate('Create_3');
    }, 50); // 버튼 색상 복구
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'눈송이 창작자님 소설의\n아이디어를 마구마구 떠올려 봅시다'}</Text>
        <Image source={imageSource} style={styles.image}/>
        <Text style={styles.bottomText}>{'아이디어를 다 떠올리셨나요?\n아이디어를 키워드로 작성해주세요!\n아이디어는 구체적일수록\n앞으로의 창작에 큰 도움이 됩니다!'}</Text>
      </View>
      <TouchableOpacity  style={[styles.button, {backgroundColor: buttonColor}]} onPress={handlePress}>
        <Text style={styles.buttonText}>아이디어 키워드를 작성하고 싶어요</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
  },
  bottomText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
  },
  image: {
    width: 300,
    height: 300,
    margin: 30,
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

export default Create_2;
