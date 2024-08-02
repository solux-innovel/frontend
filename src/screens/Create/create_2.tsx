// src/screens/Create/create_2.tsx

import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const imageSource = require('../../img/Create/Create2_image.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 고유 ID 생성기
const generateUniqueId = () => {
  return 'novel_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
};

const Create_2 = () => {
  const navigation = useNavigation();

  const [buttonColor, setButtonColor] = useState("#9B9AFF");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idea, setIdea] = useState('');

  // 소설 ID 상태 변수 추가
  const [novelId, setNovelId] = useState('');

  // 사용자명 상태 변수
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const initializeNovelId = async () => {
      try {
        let currentNovelId = await AsyncStorage.getItem('currentNovelId'); //현재 소설 id 불러옴
        if (!currentNovelId) {
          currentNovelId = generateUniqueId(); //id가 없을 경우 새로 생성
          await AsyncStorage.setItem('currentNovelId', currentNovelId);
        }
        setNovelId(currentNovelId);
      } catch (error) {
        console.error('Failed to initialize novel ID.', error);
      }
    };

    initializeNovelId();
  }, []);

  //고유 id 확인용 코드
  useEffect(() => {
    if (novelId) {
      //console.log('Saved NovelId:', novelId);
    }
  }, [novelId]);

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

  // 첫 번째 버튼 색상 변경 함수
  const handlePress = () => {
    setButtonColor("#000000");
    setTimeout(() => {
      setButtonColor("#9B9AFF");
      setIsModalVisible(true);
    }, 50); // 버튼 색상 복구
  };

  const handlePressSave = async () => {
    try {
      await AsyncStorage.setItem(`novelIdea_${novelId}`, idea);
      setIsModalVisible(false);
      navigation.navigate('Create_3', { novelId });
    } catch (error) {
      console.error('Failed to save idea.', error);
    }
  };

  const onPressBackButton = () => {
    setIsModalVisible(false);
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

      <Modal animationType="slide" visible={isModalVisible} transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Pressable style={styles.backButton} onPress={onPressBackButton}>
              <Image source={backButtonImage} />
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handlePressSave}>
              <Text style={styles.saveButtonText}>저장</Text>
            </Pressable>
            <TextInput style={styles.textInput} placeholder="아이디어 키워드를 직접 작성해주세요" placeholderTextColor="#FFFFFF" maxLength={100} value={idea} onChangeText={setIdea}/>
          </View>
        </View>
      </Modal>
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
  modalBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 7,
    left: 6,
  },
  saveButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    borderColor: '#FFFFFF',
    borderBottomWidth: 5,
    width: '80%',
    padding: 6,
  },
});

export default Create_2;
