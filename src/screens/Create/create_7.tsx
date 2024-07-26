// src/screens/Create/create_7.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const imageSource = require('../../img/Create/Create7-1_image.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

const Create_7 = () => {
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
    //입력한 줄거리 저장하는 코드 추가
    setIsModalVisible2(false);
    navigation.navigate('Create_8');
  }

  const onPressText = () => {
    //선택한 줄거리 저장하는 코드 추가
    setIsModalVisible1(false);
    navigation.navigate('Create_8');
  }

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'눈송이 창작자님의 소설을 위한\n줄거리를 완성해보았어요!'}</Text>
        <Image source={imageSource} style={styles.image}/>
        <Text style={styles.bottomText}>{'지금까지의 정보들을 바탕으로\n최종적인 줄거리를 추천해드립니다'}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1, bottom: 100,}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>줄거리를 확인하고 싶어요</Text>
      </TouchableOpacity>

      {/* 두번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor2}]} onPress={handlePressButton2}>
        <Text style={styles.buttonText}>줄거리를 직접 작성하고 싶어요</Text>
      </TouchableOpacity>

      {/* 첫번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <TouchableOpacity onPress={onPressText}>
              <Text style={styles.modalTextStyle}>추천 받은 줄거리</Text>
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
            <View style={styles.innerModalView}>
              <ScrollView showsVerticalScrollIndicator={true}>
                <TextInput style={styles.textInput} placeholder="줄거리를 직접 작성해주세요" placeholderTextColor="#E2E1FF" maxLength={2000} multiline />
              </ScrollView>
            </View>
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
    alignItems: 'center',
  },
  modalView: {
    margin: 35,
    height: '50%',
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
  innerModalView: {
    width: 350,
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    padding: 20,
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
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Create_7;
