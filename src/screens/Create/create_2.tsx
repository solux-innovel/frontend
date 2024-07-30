// src/screens/Create/create_2.tsx

import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const imageSource = require('../../img/Create/Create2_image.png');

const Create_2 = () => {
  const navigation = useNavigation();

  const [buttonColor, setButtonColor] = useState("#9B9AFF");

  // 사용자명 상태 변수
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        if (storedUserName) {
          setUserName(storedUserName);
        }
      } catch (error) {
        console.error('Failed to fetch user name.', error);
      }
    };

    fetchUserName();
    // 사용자명 변경을 감지하기 위한 interval 설정
    const interval = setInterval(fetchUserName, 1000); // 1초마다 업데이트 체크

    // 컴포넌트 언마운트 시 interval 클리어
    return () => clearInterval(interval);
  }, []);

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
        <Text style={styles.topText}>{`${userName} 창작자님 소설의\n아이디어를 마구마구 떠올려 봅시다`}</Text>
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
    backgroundColor: '#FFFFFF',
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
