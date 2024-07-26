// src/screens/Create/create_5.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const imageSource = require('../../img/Create/Create5-1_image.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

const Create_5 = () => {
  const navigation = useNavigation();

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  useEffect(() => {

  }, []);

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton1 = () => {
    setButtonColor1("#000000");
    setTimeout(() => {
      setButtonColor1("#9B9AFF");
      setIsModalVisible1(true);
    }, 50); // 버튼 색상 복구
  };

  // 두 번째 버튼 색상 변경 함수
  const handlePressButton2 = () => {
    setButtonColor2("#000000");
    setTimeout(() => {
      setButtonColor2("#9B9AFF");
      setIsModalVisible2(true);
    }, 50); // 버튼 색상 복구
  };

  const onPressModalClose1 = () => {
    setIsModalVisible1(false);
  }

  const onPressModalClose2 = () => {
    //입력한 배경 저장하는 코드 추가
    setIsModalVisible2(false);
    navigation.navigate('Create_6');
  }

  const onPressText = () => {
    //선택한 배경 저장하는 코드 추가
    setIsModalVisible1(false);
    navigation.navigate('Create_6');
  }

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'눈송이 창작자님의 소설은\n어떤 배경이길 원하나요?'}</Text>
        <Image source={imageSource} style={styles.image}/>
        <Text style={styles.bottomText}>{'키워드, 컨셉, 주제를 바탕으로\n소설에 어울릴 만한 배경을 추천해드립니다'}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1, bottom: 100,}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>배경을 추천받고 싶어요</Text>
      </TouchableOpacity>

      {/* 두번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor2}]} onPress={handlePressButton2}>
        <Text style={styles.buttonText}>배경을 직접 작성하고 싶어요</Text>
      </TouchableOpacity>

      {/* 첫번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <TouchableOpacity onPress={onPressText}>
              <Text style={styles.modalTextStyle}>추천 받은 배경</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 두번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible2} transparent={true}>
        <View style={styles.modalBackground2}>
          <View style={styles.modalView2}>
            <Pressable style={styles.backButton} onPress={onPressBackButton}>
              <Image source={backButtonImage} />
            </Pressable>
            <Pressable style={styles.saveButton} onPress={onPressModalClose2}>
              <Text style={styles.saveButtonText}>저장</Text>
            </Pressable>
            <TextInput style={styles.textInput} placeholder="배경을 직접 작성해주세요" placeholderTextColor="#FFFFFF"  maxLength={300} />
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
  modalBackground1: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalBackground2: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  modalView: {
    margin: 35,
    height: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView2: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTextStyle: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
  },
  backButton: {
    position: 'absolute',
    top: 7,
    left: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
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
    width: '65%',
    padding: 6,
  },
});

export default Create_5;
