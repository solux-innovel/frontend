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
  FlatList,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {OPENAI_API_KEY} from '@env';

const initialImageSource = require('../../img/Create/Create4-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 비동기 함수로 AI로부터 추천받은 주제들을 가져오기
const fetchRecommendedTopics = async (idea: string, genre: string) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: 'You are a helpful assistant.'},
          {
            role: 'user',
            content: `아이디어 "${idea}"와 장르 "${genre}"를 바탕으로 3가지 창의적인 주제를 추천해 주세요. 주제는 한 줄씩 나열해 주세요.`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`, // Use environment variable
        },
      },
    );

    // 응답에서 주제 추출 (줄바꿈 기준으로 분리)
    const suggestedTopics = response.data.choices[0].message.content
      .split('\n')
      .filter(Boolean);
    return suggestedTopics.slice(0, 3); // 3개의 주제만 반환
  } catch (error) {
    console.error('Failed to fetch recommended topics.', error);
    throw new Error('Failed to fetch recommended topics.');
  }
};

const Create_4 = ({route}) => {
  const navigation = useNavigation();
  const {novelId} = route.params; // 전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState('#9B9AFF');
  const [buttonColor2, setButtonColor2] = useState('#9B9AFF');
  const [okayButtonColor, setOkayButtonColor] = useState('#9B9AFF');

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const [savedIdea, setSavedIdea] = useState('');
  const [savedGenre, setSavedGenre] = useState('');

  const [topic, setTopic] = useState('');
  const [recommendedTopics, setRecommendedTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [buttonText, setButtonText] = useState('주제를 추천받고 싶어요');
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState(
    '작성 해주신 키워드와 장르를 바탕으로\n주제를 3가지 추천해드립니다',
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
        if (idea !== null) {
          setSavedIdea(idea);
        }
        if (genre !== null) {
          setSavedGenre(genre);
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
        const newRecommendedTopics = await fetchRecommendedTopics(
          savedIdea,
          savedGenre,
        );
        setRecommendedTopics(newRecommendedTopics);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('Failed to fetch recommended topics.', error);
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

  const onPressModalClose1 = () => {
    setIsModalVisible1(false);
    setButtonText('주제를 다시 추천받고 싶어요');
    setImage(againImage);
    setBottomText(
      '추천받은 주제가 마음에 들지 않는다면\n주제를 다시 추천해드릴 수 있습니다\n창작자가 주제를 직접 작성할 수도 있습니다',
    );
  };

  const onPressModalClose2 = async () => {
    try {
      await AsyncStorage.setItem(`novelTopic_${novelId}`, topic);
      setIsModalVisible2(false);
      navigation.navigate('Create_5', {novelId});
    } catch (e) {
      console.error('Failed to save topic.', e);
    }
  };

  const onPressOkayButton = async () => {
    setOkayButtonColor('#000000');
    setTimeout(async () => {
      setOkayButtonColor('#9B9AFF');

      if (selectedTopic) {
        try {
          await AsyncStorage.setItem(`novelTopic_${novelId}`, selectedTopic);
          setIsModalVisible1(false);
          navigation.navigate('Create_5', {novelId});
        } catch (e) {
          console.error('Failed to save topic.', e);
        }
      } else {
        Alert.alert('경고', '주제를 선택해주세요.');
      }
    }, 50);
  };

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  const handleTopicPress = (topic: string) => {
    setSelectedTopic(topic);
  };

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={[
        styles.topicButton,
        selectedTopic === item && styles.selectedTopicButton,
      ]}
      onPress={() => handleTopicPress(item)}>
      <Text style={styles.topicButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text
          style={
            styles.topText
          }>{`${userName} 창작자님의 소설은\n어떤 주제이길 원하나요?`}</Text>
        <Image source={image} style={styles.image} />
        <Text style={styles.bottomText}>{bottomText}</Text>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: buttonColor1}]}
          onPress={handlePressButton1}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: buttonColor2}]}
          onPress={handlePressButton2}>
          <Text style={styles.buttonText}>직접 작성하기</Text>
        </TouchableOpacity>
      </View>

      {/* 모달 1 */}
      <Modal
        visible={isModalVisible1}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible1(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>추천된 주제</Text>
            <FlatList
              data={recommendedTopics}
              renderItem={renderItem}
              keyExtractor={item => item}
            />
            <TouchableOpacity
              style={[styles.okayButton, {backgroundColor: okayButtonColor}]}
              onPress={onPressOkayButton}>
              <Text style={styles.okayButtonText}>선택하기</Text>
            </TouchableOpacity>
            <Pressable onPress={onPressModalClose1}>
              <Image source={closeImage} style={styles.closeImage} />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 모달 2 */}
      <Modal
        visible={isModalVisible2}
        transparent
        animationType="slide"
        onRequestClose={onPressBackButton}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>주제를 직접 작성하기</Text>
            <TextInput
              style={styles.textInput}
              placeholder="주제를 입력하세요"
              value={topic}
              onChangeText={setTopic}
            />
            <TouchableOpacity
              style={[styles.saveButton, {backgroundColor: okayButtonColor}]}
              onPress={onPressModalClose2}>
              <Text style={styles.saveButtonText}>저장하기</Text>
            </TouchableOpacity>
            <Pressable onPress={onPressBackButton}>
              <Image source={backButtonImage} style={styles.closeImage} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 200,
    marginVertical: 20,
  },
  bottomText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  topicButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedTopicButton: {
    backgroundColor: '#9B9AFF',
  },
  topicButtonText: {
    fontSize: 16,
  },
  okayButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  okayButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  saveButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  closeImage: {
    width: 30,
    height: 30,
    marginTop: 10,
  },
});

export default Create_4;
