// src/screens/Create/create_1.tsx

import React, { useState } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const imageSource = require('../../img/Create/Create1_image.png');

const Create_1 = () => {
  const navigation = useNavigation();

  const [buttonColor, setButtonColor] = useState("#9B9AFF");

  // 버튼 색상 변경 함수
  const handlePress = () => {
    setButtonColor("#000000");
    setTimeout(() => {
      setButtonColor("#9B9AFF");
      navigation.navigate('Create_2');
    }, 50); // 버튼 색상 복구
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'눈송이 창작자님,\n반가워요🙌'}</Text>
        <Image source={imageSource} style={styles.image}/>
        <Text style={styles.bottomText}>{'지금부터 이노블과 함께\n소설 창작하기를 시작해볼까요?'}</Text>
      </View>
      <TouchableOpacity  style={[styles.button, {backgroundColor: buttonColor}]} onPress={handlePress}>
        <Text style={styles.buttonText}>소설 창작 시작하기</Text>
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
    margin: 35,
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

export default Create_1;
