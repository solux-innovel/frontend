// src/screens/Create/create_6.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const imageSource = require('../../img/Create/Create6-1_image.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 비동기 함수로 AI로부터 추천받은 등장인물을 가져오기
const fetchRecommendedCharacter = async (concept: string, topic: string, background: string) => {
  // AI 또는 서버에서 추천받은 등장인물을 비동기적으로 가져옴
  // 이 부분을 실제 AI API 호출로 대체
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('새로운 AI 추천 등장인물');
    }, 1000); // 1초 후에 등장인물 반환
  });
};

const Create_6 = ({ route }) => {
  const navigation = useNavigation();
  const { novelId } = route.params; //전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  // 저장된 데이터 변수
  const [savedConcept, setSavedConcept] = useState('');
  const [savedTopic, setSavedTopic] = useState('');
  const [savedBackground, setSavedBackground] = useState('');

  //입력한 등장인물과 선택한 등장인물 상태 변수
  const [character, setCharacter] = useState('');
  const [recommendedCharacter, setRecommendedCharacter] = useState('추천 받은 등장인물');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 앞에서 저장된 데이터 호출
        const concept = await AsyncStorage.getItem(`novelConcept_${novelId}`);
        const topic = await AsyncStorage.getItem(`novelTopic_${novelId}`);
        const background = await AsyncStorage.getItem(`novelBackground_${novelId}`)

        if (concept !== null) {
          setSavedConcept(concept);
          // AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Concept:', concept);
        }

        if (topic !== null) {
          setSavedTopic(topic);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Topic:', topic);
        }

        if (background !== null) {
          setSavedBackground(background);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Background:', background);
        }
      } catch (error) {
          console.error('Failed to load data.', error);
      }
    };

    fetchData();
  }, [novelId]);

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton1 = async () => {
    setButtonColor1("#000000");
    setTimeout(async () => {
      setButtonColor1("#9B9AFF");

      // 저장된 데이터를 사용하여 AI로부터 추천 받은 등장인물을 가져옴
      try {
        const newRecommendedCharacter = await fetchRecommendedCharacter(savedConcept, savedTopic, savedBackground);
        setRecommendedCharacter(newRecommendedCharacter);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('Failed to fetch recommended character.', error);
      }
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

  const onPressModalClose2 = async () => {
    //입력한 등장인물 저장
    try {
      await AsyncStorage.setItem(`novelCharacter_${novelId}`, character);
      setIsModalVisible2(false);
      navigation.navigate('Create_7', { novelId });
    } catch (e) {
      console.error('Failed to save character.', e);
    }
  }

  const onPressText = async () => {
    //선택한 등장인물 저장
    try {
      await AsyncStorage.setItem(`novelCharacter_${novelId}`, recommendedCharacter);
      setIsModalVisible2(false);
      navigation.navigate('Create_7', { novelId });
    } catch (e) {
      console.error('Failed to save character.', e);
    }
  }

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'눈송이 창작자님의 소설에\n등장하는 친구들이 궁금해요!'}</Text>
        <Image source={imageSource} style={styles.image}/>
        <Text style={styles.bottomText}>{'키워드, 컨셉, 주제, 배경을 바탕으로\n소설에 어울릴 만한 등장인물을 추천해드립니다'}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1, bottom: 100,}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>등장인물을 추천받고 싶어요</Text>
      </TouchableOpacity>

      {/* 두번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor2}]} onPress={handlePressButton2}>
        <Text style={styles.buttonText}>등장인물을 직접 작성하고 싶어요</Text>
      </TouchableOpacity>

      {/* 첫번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <TouchableOpacity onPress={onPressText}>
              <Text style={styles.modalTextStyle}>{recommendedCharacter}</Text>
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
            <TextInput style={styles.textInput} placeholder="등장인물을 직접 작성해주세요" placeholderTextColor="#FFFFFF"  maxLength={300} value={character} onChangeText={setCharacter}/>
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
    width: 320,
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

export default Create_6;
