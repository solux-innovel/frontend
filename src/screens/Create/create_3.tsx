// src/screens/Create/create_3.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialImageSource = require('../../img/Create/Create3-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 비동기 함수로 AI로부터 추천받은 컨셉을 가져오기
const fetchRecommendedConcepts = async () => {
  // AI 또는 서버에서 추천받은 컨셉을 비동기적으로 가져옴
  // 이 부분을 실제 AI API 호출로 대체
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['AI 추천 컨셉 1', 'AI 추천 컨셉 2', 'AI 추천 컨셉 3', 'AI 추천 컨셉 4', 'AI 추천 컨셉 5']);
    }, 1000); // 1초 후에 컨셉 반환
  });
};

// 고유 ID 생성기
const generateUniqueId = () => {
  return 'novel_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
};

const Create_3 = () => {
  const navigation = useNavigation();

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");
  const [okayButtonColor, setOkayButtonColor] = useState("#9B9AFF");

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  // 소설 ID 상태 변수 추가
  const [novelId, setNovelId] = useState('');

  //입력한 컨셉과 선택한 컨셉 상태 변수
  const [concept, setConcept] = useState('');
  const [recommendedConcepts, setRecommendedConcepts] = useState([]);
  const [selectedConcepts, setSelectedConcepts] = useState([]);

  // 최초 화면 상태 변수
  const [buttonText, setButtonText] = useState("컨셉을 추천받고 싶어요");
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState('작성 해주신 아이디어 키워드를\n바탕으로 컨셉을 추천해드립니다');

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

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton1 = async () => {
    setButtonColor1("#000000");
    setTimeout(async () => {
      setButtonColor1("#9B9AFF");

      // AI로부터 추천 받은 컨셉을 가져옴
      try {
        const newRecommendedConcepts = await fetchRecommendedConcepts();
        setRecommendedConcepts(newRecommendedConcepts);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('Failed to fetch recommended concepts.', error);
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

    // 다시 추천받기 버튼, 이미지, 텍스트로 변경
    setButtonText("컨셉을 다시 추천받고 싶어요");
    setImage(againImage);
    setBottomText('추천받은 컨셉이 마음에 들지 않는다면\n컨셉을 다시 추천해드릴 수 있습니다\n창작자가 컨셉을 직접 작성할 수도 있습니다');
  }

  const onPressModalClose2 = async () => {
    //입력한 컨셉 저장
    try {
      await AsyncStorage.setItem(`novelConcept_${novelId}`, concept); //id와 함께 저장
      setIsModalVisible2(false);
      navigation.navigate('Create_4', { novelId }); //id 전달
    } catch (e) {
      console.error('Failed to save concept.', e);
    }
  }

  const onPressOkayButton = async () => {
    setOkayButtonColor("#000000");
    setTimeout(async () => {
      setOkayButtonColor("#9B9AFF");

      // 선택된 컨셉 저장
      try {
        if (selectedConcepts.length > 0) {
          await AsyncStorage.setItem(`novelConcept_${novelId}`, JSON.stringify(selectedConcepts)); // id와 함께 저장
          setIsModalVisible1(false);
          navigation.navigate('Create_4', { novelId }); // id 전달
        } else {
          Alert.alert('경고','컨셉을 최소 하나 이상 선택해주세요.');
        }
      } catch (e) {
        console.error('Failed to save concept.', e);
      }
    }, 50); // 버튼 색상 복구
  }

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  const handleConceptSelect = (concept) => {
    setSelectedConcepts((prevSelected) => {
      if (prevSelected.includes(concept)) {
        return prevSelected.filter((item) => item !== concept);
      } else if (prevSelected.length < 3) {
        return [...prevSelected, concept];
      } else {
        return prevSelected;
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{`${userName} 창작자님의 소설은\n어떤 컨셉이길 원하나요?`}</Text>
        <Image source={image} style={styles.image}/>
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1, bottom: 100,}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      {/* 두번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor2}]} onPress={handlePressButton2}>
        <Text style={styles.buttonText}>컨셉을 직접 작성하고 싶어요</Text>
      </TouchableOpacity>

      {/* 첫번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <View style={styles.conceptContainer}>
            {recommendedConcepts.map((concept, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.conceptButton,
                  selectedConcepts.includes(concept) && styles.selectedConceptButton,
                ]}
                onPress={() => handleConceptSelect(concept)}
              >
                <Text style={styles.conceptButtonText}>{concept}</Text>
              </TouchableOpacity>
            ))}
            </View>
            {/* 세번째 버튼 (추천 내용 확정) */}
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.okayButton, {backgroundColor: okayButtonColor}]} onPress={onPressOkayButton}>
              <Text style={styles.buttonText}>확정</Text>
            </TouchableOpacity>
            </View>
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
            <TextInput style={styles.textInput} placeholder="컨셉을 직접 작성해주세요" placeholderTextColor="#FFFFFF" maxLength={100} value={concept} onChangeText={setConcept}/>
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
    margin: 20,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  modalView2: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTextStyle: {
    marginTop: 55,
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
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
    zIndex: 1,
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
  conceptContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  conceptButton: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedConceptButton: {
    backgroundColor: '#A2A2A2',
  },
  conceptButtonText: {
    color: '#000000',
    fontSize: 16,
  },
});

export default Create_3;
