// src/screens/Create/create_4.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialImageSource = require('../../img/Create/Create4-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 비동기 함수로 AI로부터 추천받은 주제들을 가져오기
const fetchRecommendedTopics = async (concept: string) => {
  // AI 또는 서버에서 추천받은 주제들을 비동기적으로 가져옴
  // 이 부분을 실제 AI API 호출로 대체
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve([
        '새로운 AI 추천 주제1',
        '새로운 AI 추천 주제2',
        '새로운 AI 추천 주제3',
      ]);
    }, 1000); // 1초 후에 주제 배열 반환
  });
};

const Create_4 = ({ route }) => {
  const navigation = useNavigation();
  const { novelId } = route.params; //전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");
  const [okayButtonColor, setOkayButtonColor] = useState("#9B9AFF");

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  //저장된 데이터 변수
  const [savedConcept, setSavedConcept] = useState('');

  //입력한 주제와 선택한 주제 상태 변수
  const [topic, setTopic] = useState('');
  const [recommendedTopics, setRecommendedTopics] = useState<string[]>(['추천 받은 주제1', '추천 받은 주제2', '추천 받은 주제3',]);;
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // 최초 화면 상태 변수
  const [buttonText, setButtonText] = useState("주제를 추천받고 싶어요");
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState('작성 해주신 키워드와 컨셉을 바탕으로\n주제를 3가지 추천해드립니다');

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
    const fetchData = async () => {
      try {
        //앞에서 저장된 데이터 호출
        const concept = await AsyncStorage.getItem(`novelConcept_${novelId}`);
        if (concept !== null) {
          setSavedConcept(concept);
          // AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Concept:', concept);
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

      // 저장된 컨셉을 사용하여 AI로부터 추천 받은 주제 배열을 가져옴
      try {
        const newRecommendedTopics = await fetchRecommendedTopics(savedConcept);
        setRecommendedTopics(newRecommendedTopics);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('Failed to fetch recommended topics.', error);
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
    setButtonText("주제를 다시 추천받고 싶어요");
    setImage(againImage);
    setBottomText('추천받은 주제가 마음에 들지 않는다면\n주제를 다시 추천해드릴 수 있습니다\n창작자가 주제를 직접 작성할 수도 있습니다');
  }

  const onPressModalClose2 = async () => {
    //입력한 주제 저장
    try {
      await AsyncStorage.setItem(`novelTopic_${novelId}`, topic);
      setIsModalVisible2(false);
      navigation.navigate('Create_5', { novelId });
    } catch (e) {
      console.error('Failed to save topic.', e);
    }
  }

  const onPressOkayButton = async () => {
    setOkayButtonColor("#000000");
    setTimeout(async () => {
      setOkayButtonColor("#9B9AFF");

      if (selectedTopic) {
        //선택한 주제 저장
        try {
          await AsyncStorage.setItem(`novelTopic_${novelId}`, selectedTopic); //id와 함께 저장
          setIsModalVisible1(false);
          navigation.navigate('Create_5', { novelId }); //id 전달
        } catch (e) {
          console.error('Failed to save topic.', e);
        }
      } else {
        Alert.alert('경고','주제를 선택해주세요.');
      }
    }, 50); // 버튼 색상 복구
  }

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  const handleTopicPress = (topic: string) => {
    setSelectedTopic(topic);
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.topicButton, selectedTopic === item && styles.selectedTopicButton]}
      onPress={() => handleTopicPress(item)}
    >
      <Text style={styles.topicButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{`${userName} 창작자님의 소설은\n어떤 주제이길 원하나요?`}</Text>
        <Image source={image} style={styles.image}/>
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1, bottom: 100,}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      {/* 두번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor2}]} onPress={handlePressButton2}>
        <Text style={styles.buttonText}>주제를 직접 작성하고 싶어요</Text>
      </TouchableOpacity>

      {/* 첫번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <FlatList data={recommendedTopics} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} contentContainerStyle={styles.flatListContentContainer} />
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
            <TextInput style={styles.textInput} placeholder="주제를 직접 작성해주세요" placeholderTextColor="#FFFFFF"  maxLength={300}  value={topic} onChangeText={setTopic}/>
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
    width: 340,
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
    marginTop: 16,
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
    marginTop: 20,
  },
  flatListContentContainer: {
    alignItems: 'center', // 중앙 정렬
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
  topicButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  selectedTopicButton: {
    backgroundColor: '#A2A2A2',
  },
  topicButtonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default Create_4;
