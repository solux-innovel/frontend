import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {OPENAI_API_KEY} from '@env'; // 수정된 부분

const initialImageSource = require('../../img/Create/Create6-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 비동기 함수로 AI로부터 추천받은 줄거리를 가져오기
const fetchRecommendedPlot = async (
  idea: string,
  genre: string,
  selectedTopic: string,
  character: string,
) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `아이디어: ${idea}\n장르: ${genre}\n주제: ${selectedTopic}\n등장인물: ${character}\n이 정보를 바탕으로 소설의 줄거리를 완전한 문장으로 작성해줘.`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error(
      'Failed to fetch recommended plot from AI:',
      error.response ? error.response.data : error.message,
    );
    throw new Error('Failed to fetch recommended plot from AI');
  }
};

const Create_6 = ({route}: {route: any}) => {
  const navigation = useNavigation();
  const {novelId} = route.params;

  const [buttonColor1, setButtonColor1] = useState('#9B9AFF');
  const [buttonColor2, setButtonColor2] = useState('#9B9AFF');
  const [okayButtonColor, setOkayButtonColor] = useState('#9B9AFF');

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const [savedIdea, setSavedIdea] = useState('');
  const [savedGenre, setSavedGenre] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [savedCharacter, setSavedCharacter] = useState('');

  const [plot, setPlot] = useState('');
  const [recommendedPlot, setRecommendedPlot] = useState('추천 받은 줄거리');

  const [buttonText, setButtonText] = useState('줄거리를 추천받고 싶어요');
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState(
    '지금까지의 정보들을 바탕으로\n최종적인 줄거리를 추천해드립니다',
  );

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
    const interval = setInterval(fetchUserName, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idea = await AsyncStorage.getItem(`novelIdea_${novelId}`);
        const genre = await AsyncStorage.getItem(`novelGenre_${novelId}`);
        const topic = await AsyncStorage.getItem(`novelTopic_${novelId}`);
        const character = await AsyncStorage.getItem(
          `novelCharacter_${novelId}`,
        );

        if (idea !== null) {
          setSavedIdea(idea);
        }
        if (genre !== null) {
          setSavedGenre(genre);
        }
        if (topic !== null) {
          setSelectedTopic(topic);
        }
        if (character !== null) {
          setSavedCharacter(character);
        }
      } catch (error) {
        console.error('Failed to load data.', error);
      }
    };

    fetchData();
  }, [novelId]);

  const handlePressButton1 = async () => {
    setButtonColor1('#000000');
    setTimeout(async () => {
      setButtonColor1('#9B9AFF');
      try {
        const newRecommendedPlot = await fetchRecommendedPlot(
          savedIdea,
          savedGenre,
          selectedTopic,
          savedCharacter,
        );
        setRecommendedPlot(newRecommendedPlot);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('Failed to fetch recommended plot.', error);
      }
    }, 50);
  };

  const handlePressButton2 = () => {
    setButtonColor2('#000000');
    setTimeout(() => {
      setButtonColor2('#9B9AFF');
      setIsModalVisible2(true);
    }, 50);
  };

  const onPressModalClose1 = async () => {
    setIsModalVisible1(false);

    setButtonText('줄거리를 다시 추천받고 싶어요');
    setImage(againImage);
    setBottomText(
      '추천받은 줄거리가 마음에 들지 않는다면\n줄거리를 다시 추천해드릴 수 있습니다\n창작자가 줄거리를 직접 작성할 수도 있습니다',
    );

    try {
      const newRecommendedPlot = await fetchRecommendedPlot(
        savedIdea,
        savedGenre,
        selectedTopic,
        savedCharacter,
      );
      setRecommendedPlot(newRecommendedPlot);
    } catch (error) {
      console.error('Failed to fetch new recommended plot.', error);
    }
  };

  const onPressModalClose2 = async () => {
    try {
      await AsyncStorage.setItem(`novelPlot_${novelId}`, plot);
      setIsModalVisible2(false);
      navigation.navigate('Create_7', {novelId});
    } catch (e) {
      console.error('Failed to save plot.', e);
    }
  };

  const onPressOkayButton = async () => {
    setOkayButtonColor('#000000');
    setTimeout(async () => {
      setOkayButtonColor('#9B9AFF');
      try {
        await AsyncStorage.setItem(`novelPlot_${novelId}`, recommendedPlot);
        setIsModalVisible1(false);
        navigation.navigate('Create_7', {novelId});
      } catch (e) {
        console.error('Failed to save plot.', e);
      }
    }, 50);
  };

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text
          style={
            styles.topText
          }>{`${userName} 창작자님의 소설을 위한\n줄거리를 완성해보았어요!`}</Text>
        <Image source={image} style={styles.image} />
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: buttonColor1, bottom: 100}]}
        onPress={handlePressButton1}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: buttonColor2, bottom: 30}]}
        onPress={handlePressButton2}>
        <Text style={styles.buttonText}>줄거리 직접 작성하기</Text>
      </TouchableOpacity>

      {/* 첫 번째 모달 */}
      <Modal visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>이노블이 추천하는 줄거리</Text>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} style={styles.closeButtonImage} />
            </Pressable>
            <ScrollView style={styles.plotContainer}>
              <Text style={styles.plotText}>{recommendedPlot}</Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.okayButton, {backgroundColor: okayButtonColor}]}
              onPress={onPressOkayButton}>
              <Text style={styles.buttonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 두 번째 모달 */}
      <Modal visible={isModalVisible2} transparent={true}>
        <View style={styles.modalBackground2}>
          <View style={styles.modalView2}>
            <Pressable style={styles.backButton} onPress={onPressBackButton}>
              <Image source={backButtonImage} style={styles.backButtonImage} />
            </Pressable>
            <Text style={styles.modalText}>
              작성된 줄거리를 확인한 후 저장할 수 있습니다.
            </Text>
            <TextInput
              style={styles.plotInput}
              multiline={true}
              numberOfLines={10}
              placeholder="줄거리를 입력하세요"
              value={plot}
              onChangeText={setPlot}
            />
            <TouchableOpacity
              style={[styles.okayButton, {backgroundColor: okayButtonColor}]}
              onPress={onPressModalClose2}>
              <Text style={styles.buttonText}>확정</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centeredContent: {
    alignItems: 'center',
  },
  topText: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000000',
    marginTop: 40,
    fontWeight: 'bold',
  },
  image: {
    marginTop: 30,
    width: 300,
    height: 240,
  },
  bottomText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000000',
    marginTop: 30,
    marginBottom: 30,
  },
  button: {
    height: 60,
    width: '90%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{translateX: -185}], // 버튼을 가운데로 이동
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold', // 폰트 굵게 설정
  },
  modalBackground1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    maxHeight: '80%', // 모달의 최대 높이 설정
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between', // 하단 버튼을 위쪽으로 밀어내기 위한 스타일
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#000000',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 10,
  },
  closeButtonImage: {
    width: 40,
    height: 40,
  },
  plotContainer: {
    marginTop: 20,
    width: '100%',
  },
  plotText: {
    fontSize: 16,
    textAlign: 'center',
  },
  okayButton: {
    height: 40,
    width: '30%',
    padding: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView2: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonImage: {
    width: 20,
    height: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  plotInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
  },
});

export default Create_6;
