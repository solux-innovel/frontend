// src/screens/Create/create_8.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const imageSource = require('../../img/Create/Create8-1_image.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 비동기 함수로 AI로부터 추천받은 소설을 가져오기
const fetchRecommendedNovel = async (concept: string, topic: string, background: string, character: string, plot: string) => {
  // AI 또는 서버에서 추천받은 줄거리를 비동기적으로 가져옴
  // 이 부분을 실제 AI API 호출로 대체
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('새로운 AI 추천 소설');
    }, 1000); // 1초 후에 소설 반환
  });
};

const Create_8 = ({ route }) => {
  const navigation = useNavigation();
  const { novelId } = route.params;  //전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  // 저장된 데이터 변수
  const [savedConcept, setSavedConcept] = useState('');
  const [savedTopic, setSavedTopic] = useState('');
  const [savedBackground, setSavedBackground] = useState('');
  const [savedCharacter, setSavedCharacter] = useState('');
  const [savedPlot, setSavedPlot] = useState('');

  //선택한 소설 상태 변수
  const [recommendedNovel, setRecommendedNovel] = useState('추천된 소설을 먼저 확인해주세요');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 앞에서 저장된 데이터 호출
        const concept = await AsyncStorage.getItem(`novelConcept_${novelId}`);
        const topic = await AsyncStorage.getItem(`novelTopic_${novelId}`);
        const background = await AsyncStorage.getItem(`novelBackground_${novelId}`)
        const character = await AsyncStorage.getItem(`novelCharacter_${novelId}`)
        const plot = await AsyncStorage.getItem(`novelPlot_${novelId}`)

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

        if (character !== null) {
          setSavedCharacter(character);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Character:', character);
        }

        if (plot !== null) {
          setSavedPlot(plot);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Plot:', plot);
        }
      } catch (error) {
          console.error('Failed to load data.', error);
      }
    };

    fetchData();
  }, []);

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton1 = async () => {
    setButtonColor1("#000000");
    setTimeout(async () => {
      setButtonColor1("#9B9AFF");
      // 저장된 데이터를 사용하여 AI로부터 추천 받은 소설을 가져옴
      try {
        const newRecommendedNovel = await fetchRecommendedNovel(savedConcept, savedTopic, savedBackground, savedCharacter, savedPlot);
        setRecommendedNovel(newRecommendedNovel);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('Failed to fetch recommended novel.', error);
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
    //선택한 소설을 저장
    try {
      await AsyncStorage.setItem(`finalNovel_${novelId}`, recommendedNovel);
      setIsModalVisible2(false);
      navigation.navigate('Create_9', { novelId });
    } catch (e) {
      console.error('Failed to save novel.', e);
    }
  }

  const onPressText = async () => {
    //선택한 소설을 저장
    try {
      await AsyncStorage.setItem(`finalNovel_${novelId}`, recommendedNovel);
      setIsModalVisible2(false);
      navigation.navigate('Create_9', { novelId });
    } catch (e) {
      console.error('Failed to save novel.', e);
    }
  }

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'눈송이 창작자님을 위한\n소설이 완성되었습니다!'}</Text>
        <Image source={imageSource} style={styles.image}/>
        <Text style={styles.bottomText}>{'지금까지 수고하셨습니다!\n눈송이 창작자님은 이노블과 함께\n소설을 창작하는 데에 성공하셨습니다!'}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1, bottom: 100,}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>소설을 확인하고 싶어요</Text>
      </TouchableOpacity>

      {/* 두번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor2}]} onPress={handlePressButton2}>
        <Text style={styles.buttonText}>소설이 마음에 들어요</Text>
      </TouchableOpacity>

      {/* 첫번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <TouchableOpacity onPress={onPressText}>
              <Text style={styles.modalTextStyle}>{recommendedNovel}</Text>
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
                <Text style={styles.novelText}>{recommendedNovel}</Text>
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
    width: 320,
    height: 300,
    margin: 15,
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
    height: 350,
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
  novelText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Create_8;
