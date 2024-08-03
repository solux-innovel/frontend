// src/screens/Create/create_7.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialImageSource = require('../../img/Create/Create7-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 비동기 함수로 AI로부터 추천받은 소설을 가져오기
const fetchRecommendedNovel = async (idea: string, genre: string, topic: string, character: string, plot: string) => {
  // AI 또는 서버에서 추천받은 소설을 비동기적으로 가져옴
  // 이 부분을 실제 AI API 호출로 대체
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('새로운 AI 추천 소설');
    }, 1000); // 1초 후에 소설 반환
  });
};

const Create_7 = ({ route }) => {
  const navigation = useNavigation();
  const { novelId } = route.params;  //전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");
  const [okayButtonColor, setOkayButtonColor] = useState("#9B9AFF");

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 수정 상태 추가

  // 저장된 데이터 변수
  const [savedIdea, setSavedIdea] = useState('');
  const [savedGenre, setSavedGenre] = useState('');
  const [savedTopic, setSavedTopic] = useState('');
  const [savedCharacter, setSavedCharacter] = useState('');
  const [savedPlot, setSavedPlot] = useState('');

  //선택한 소설 상태 변수
  const [recommendedNovel, setRecommendedNovel] = useState('추천된 소설을 먼저 확인해주세요');

  // 최초 화면 상태 변수
  const [buttonText, setButtonText] = useState("소설을 확인하고 싶어요");
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState("지금까지 수고하셨습니다!\n이제 창작자님은 이노블과 함께\n소설을 창작하는 데에 성공하셨습니다!");
  const [isInitialMode, setIsInitialMode] = useState(true); // 초기 화면 여부 상태 추가

  // 사용자명 상태 변수
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userNickname');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 앞에서 저장된 데이터 호출
        const idea = await AsyncStorage.getItem(`novelIdea_${novelId}`);
        const genre = await AsyncStorage.getItem(`novelGenre_${novelId}`);
        const topic = await AsyncStorage.getItem(`novelTopic_${novelId}`);
        const character = await AsyncStorage.getItem(`novelCharacter_${novelId}`)
        const plot = await AsyncStorage.getItem(`novelPlot_${novelId}`)

        if (idea !== null) {
          setSavedIdea(idea);
          // AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Idea:', idea);
        }

        if (genre !== null) {
          setSavedGenre(genre);
          // AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Genre:', genre);
        }

        if (topic !== null) {
          setSavedTopic(topic);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Topic:', topic);
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
      if (recommendedNovel === '추천된 소설을 먼저 확인해주세요') { // 처음 누를 때만 추천 소설을 가져옴
        try {
          const newRecommendedNovel = await fetchRecommendedNovel(savedIdea, savedGenre, savedTopic, savedCharacter, savedPlot);
          setRecommendedNovel(newRecommendedNovel);
          setIsModalVisible1(true);
        } catch (error) {
          console.error('Failed to fetch recommended novel.', error);
        }
      } else {
        setIsModalVisible1(true); // 이후에는 모달만 열기
      }
    }, 50); // 버튼 색상 복구
  };

  // 두 번째 버튼 색상 변경 함수
  const handlePressButton2 = async () => {
    setButtonColor2("#000000");
    setTimeout(async () => {
      setButtonColor2("#9B9AFF");
      try {
        await AsyncStorage.setItem(`finalNovel_${novelId}`, recommendedNovel); // id와 함께 저장
        navigation.navigate('Create_8', { novelId });
      } catch (e) {
        console.error('Failed to save novel.', e);
      }
    }, 50); // 버튼 색상 복구
  };

  const onPressModalClose1 = () => {
    setIsModalVisible1(false);

    // 다시 추천받기 버튼, 이미지, 텍스트로 변경
    setIsInitialMode(false); // 이후 화면으로 변경
    setButtonText("소설을 수정하고 싶어요");
    setImage(againImage);
    setBottomText('완성한 소설이 마음에 들지 않는다면\n창작자가 소설을 직접 수정할 수도 있습니다\n만족한다면 그대로 발행할 수 있습니다');
  }

  const onPressOkayButton = async () => {
    setOkayButtonColor("#000000");
    setTimeout(async () => {
      setOkayButtonColor("#9B9AFF");

      //선택한 소설 저장
      try {
        await AsyncStorage.setItem(`finalNovel_${novelId}`, recommendedNovel); //id와 함께 저장
        setIsModalVisible1(false);
        navigation.navigate('Create_8', { novelId }); //id 전달
      } catch (e) {
        console.error('Failed to save novel.', e);
      }
    }, 50); // 버튼 색상 복구
  }

  const onPressEditButton = () => {
    setButtonColor1("#000000");
    setTimeout(() => {
      setButtonColor1("#9B9AFF");
      setIsEditing(true);
      setIsModalVisible1(true);
    }, 50); // 버튼 색상 복구
  };

  const onPressSaveEdit = async () => {
    setOkayButtonColor("#000000");
    setTimeout(async () => {
      setOkayButtonColor("#9B9AFF");

      try {
        await AsyncStorage.setItem(`finalNovel_${novelId}`, recommendedNovel);
        setIsEditing(false);
        navigation.navigate('Create_8', { novelId });
      } catch (e) {
        console.error('Failed to save novel.', e);
      }
    }, 50); // 버튼 색상 복구
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{`${userName} 창작자님을 위한\n소설이 완성되었습니다!`}</Text>
        <Image source={image} style={styles.image}/>
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>

      {/* 첫번째 버튼 */}
      {isInitialMode && !isEditing ? (
        <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor1, bottom: 100 }]} onPress={handlePressButton1}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor1, bottom: 100 }]} onPress={onPressEditButton}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}

      {/* 두번째 버튼 */}
      <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor2 }]} onPress={handlePressButton2}>
        <Text style={styles.buttonText}>소설이 마음에 들어요</Text>
      </TouchableOpacity>

      {/* 첫번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <ScrollView showsVerticalScrollIndicator={true}>
              {isInitialMode && !isEditing ? (
                <Text style={styles.modalTextStyle}>{recommendedNovel}</Text>
              ) : (
                <TextInput
                  style={styles.modalTextStyle}
                  value={recommendedNovel}
                  onChangeText={setRecommendedNovel}
                  multiline
                />
              )}
            </ScrollView>
            <View style={styles.buttonContainer}>
              {isInitialMode && !isEditing ? (
                <TouchableOpacity style={[styles.okayButton, { backgroundColor: okayButtonColor }]} onPress={onPressOkayButton}>
                  <Text style={styles.buttonText}>확정</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.okayButton, { backgroundColor: okayButtonColor }]} onPress={onPressSaveEdit}>
                  <Text style={styles.buttonText}>수정 완료</Text>
                </TouchableOpacity>
              )}
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
  modalView: {
    margin: 35,
    height: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
  },
  modalTextStyle: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    zIndex: 1,
  },
  buttonContainer: {
    alignItems: 'center', // 중앙 정렬
    justifyContent: 'center',
    width: '100%',
  },
  okayButton: {
    height: 40,
    width: '40%',
    borderRadius: 15,
    backgroundColor: "#9B9AFF",
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Create_7;
