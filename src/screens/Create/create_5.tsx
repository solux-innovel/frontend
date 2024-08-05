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
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {OPENAI_API_KEY} from '@env'; // .env에서 API 키를 가져옵니다.

const initialImageSource = require('../../img/Create/Create5-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// API 호출로 추천 주제 가져오기
const fetchRecommendedTopics = async (idea, genre) => {
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
          Authorization: `Bearer ${OPENAI_API_KEY}`, // .env에서 가져온 API 키를 사용합니다.
        },
      },
    );

    const topicsText = response.data.choices[0].message.content.trim();
    const topics = topicsText
      .split('\n')
      .map(topicText => topicText.trim())
      .filter(text => text.length > 0);
    return topics;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Request Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return [];
  }
};

// API 호출로 등장인물 프로필 추출하기
const extractCharacterProfiles = async (story, topic) => {
  try {
    // 5번 API 호출을 준비합니다.
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(
        axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {role: 'system', content: 'You are a helpful assistant.'},
              {
                role: 'user',
                content: `다음 이야기를 바탕으로 등장인물의 프로필을 단답형으로 제공해 주세요. 각 프로필은 다음 형식으로 출력되어야 합니다:\n이름: [이름]\n나이: [나이]\n성별: [성별]\n직업: [직업]\n특징: [특징]\n\n줄거리를 포함하지 말고, 단답형으로만 작성해 주세요.\n\n이야기:\n\n${story}\n\n주제: ${topic}\n\n아이디어, 장르, 주제, 스토리와 관련이 깊은 등장인물 3명을 추천해 주세요.`,
              },
            ],
            max_tokens: 300, // 각 응답이 충분히 포함할 수 있도록 적절한 토큰 수 설정
            temperature: 0.7, // 창의적인 응답을 유도하기 위한 온도 설정
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`, // .env에서 가져온 API 키를 사용합니다.
              'Content-Type': 'application/json',
            },
          },
        ),
      );
    }

    // 모든 요청을 병렬로 실행하고 응답을 기다립니다.
    const responses = await Promise.all(requests);

    // 응답에서 프로필 추출
    const profiles = responses.flatMap(response => {
      const profilesText = response.data.choices[0].message.content.trim();
      return profilesText
        .split('\n\n')
        .map(profileText => {
          const lines = profileText.split('\n');
          if (lines.length === 5) {
            // 프로필 형식이 정확한지 확인
            return {
              name: lines[0]?.replace('이름: ', '').trim() || '',
              age: lines[1]?.replace('나이: ', '').trim() || '',
              gender: lines[2]?.replace('성별: ', '').trim() || '',
              occupation: lines[3]?.replace('직업: ', '').trim() || '',
              characteristics: lines[4]?.replace('특징: ', '').trim() || '',
            };
          }
          return null;
        })
        .filter(profile => profile !== null);
    });

    // 중복된 프로필 제거 및 최대 3개의 프로필 반환
    const uniqueProfiles = Array.from(
      new Set(profiles.map(profile => JSON.stringify(profile))),
    ).map(profile => JSON.parse(profile));
    return uniqueProfiles.slice(0, 3); // 최대 3개의 프로필 반환
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Request Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return [];
  }
};

const Create_5 = ({route}) => {
  const navigation = useNavigation();
  const {novelId} = route.params;

  const [buttonColor1, setButtonColor1] = useState('#9B9AFF');
  const [buttonColor2, setButtonColor2] = useState('#9B9AFF');
  const [okayButtonColor, setOkayButtonColor] = useState('#9B9AFF');

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const [story, setStory] = useState('');
  const [idea, setIdea] = useState('');
  const [genre, setGenre] = useState('');
  const [topic, setTopic] = useState('');
  const [recommendedCharacters, setRecommendedCharacters] = useState([]);

  const [characterName, setCharacterName] = useState('');
  const [characterAge, setCharacterAge] = useState('');
  const [characterGender, setCharacterGender] = useState('');
  const [characterOccupation, setCharacterOccupation] = useState('');
  const [characterCharacteristics, setCharacterCharacteristics] = useState('');

  const [buttonText, setButtonText] = useState('등장인물을 추천받고 싶어요');
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState(
    '키워드, 장르, 주제를 바탕으로\n소설에 어울릴 만한 등장인물을 추천해드립니다',
  );

  const [userName, setUserName] = useState('눈송이'); // 더미 데이터로 '눈송이' 사용

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
        const story = await AsyncStorage.getItem(`novelStory_${novelId}`);
        const idea = await AsyncStorage.getItem(`novelIdea_${novelId}`);
        const genre = await AsyncStorage.getItem(`novelGenre_${novelId}`);
        const topics = await fetchRecommendedTopics(idea, genre);

        if (story !== null) {
          setStory(story);
        }
        setIdea(idea || '');
        setGenre(genre || '');
        setTopic(topics[0] || ''); // 여러 개의 주제를 다루는 경우 추가 처리 필요
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
        const newRecommendedCharacters = await extractCharacterProfiles(
          story,
          topic,
        );
        setRecommendedCharacters(newRecommendedCharacters);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('Failed to fetch recommended character.', error);
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

    // 버튼 텍스트와 이미지 업데이트
    setButtonText('등장인물을 다시 추천받고 싶어요');
    setImage(againImage);
    setBottomText(
      '추천받은 등장인물이 마음에 들지 않는다면\n등장인물을 다시 추천해드릴 수 있습니다\n창작자가 등장인물을 직접 작성할 수도 있습니다',
    );

    // 버튼 색상은 동작하지 않으므로 그대로 둡니다.
  };

  const onPressModalClose2 = async () => {
    setIsModalVisible2(false);
  };

  const onPressOkayButton = async () => {
    setOkayButtonColor('#000000');
    setTimeout(async () => {
      setOkayButtonColor('#9B9AFF');

      try {
        if (recommendedCharacters.length > 0) {
          await AsyncStorage.setItem(
            `novelCharacter_${novelId}`,
            JSON.stringify(recommendedCharacters),
          );
          setIsModalVisible1(false);
          navigation.navigate('Create_6', {novelId});
        } else {
          Alert.alert('경고', '추천받은 등장인물이 없습니다.');
        }
      } catch (e) {
        console.error('Failed to save character.', e);
      }
    }, 50);
  };

  const onPressSaveEditButton = async () => {
    setOkayButtonColor('#000000');
    setTimeout(async () => {
      setOkayButtonColor('#9B9AFF');

      try {
        if (recommendedCharacters.length > 0) {
          await AsyncStorage.setItem(
            `novelCharacter_${novelId}`,
            JSON.stringify(recommendedCharacters),
          );
          setIsModalVisible1(false);
          navigation.navigate('Create_6', {novelId});
        } else {
          Alert.alert('경고', '추천받은 등장인물이 없습니다.');
        }
      } catch (e) {
        console.error('Failed to save character.', e);
      }
    }, 50);
  };

  const handleSaveCharacter = () => {
    const newCharacter = {
      name: characterName,
      age: characterAge,
      gender: characterGender,
      occupation: characterOccupation,
      characteristics: characterCharacteristics,
    };

    setRecommendedCharacters([...recommendedCharacters, newCharacter]);
    setCharacterName('');
    setCharacterAge('');
    setCharacterGender('');
    setCharacterOccupation('');
    setCharacterCharacteristics('');
    setIsModalVisible2(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {userName} 창작자님 소설에{'\n'}등장하는 친구들이 궁금해요!
      </Text>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </View>
      <Text style={styles.bottomText}>{bottomText}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: buttonColor1}]}
          onPress={handlePressButton1}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: buttonColor2}]}
          onPress={handlePressButton2}>
          <Text style={styles.buttonText}>
            등장인물을 직접 작성하고 싶어요.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal 1 */}
      <Modal
        visible={isModalVisible1}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible1(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {recommendedCharacters.length > 0 ? (
                recommendedCharacters.map((character, index) => (
                  <View key={index} style={styles.characterProfile}>
                    <Text>이름: {character.name}</Text>
                    <Text>나이: {character.age}</Text>
                    <Text>성별: {character.gender}</Text>
                    <Text>직업: {character.occupation}</Text>
                    <Text>특징: {character.characteristics}</Text>
                  </View>
                ))
              ) : (
                <Text>추천받은 등장인물이 없습니다.</Text>
              )}
            </ScrollView>
            <Pressable
              style={[styles.okayButton, {backgroundColor: okayButtonColor}]}
              onPress={onPressOkayButton}>
              <Text style={styles.okayButtonText}>저장</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} style={styles.closeImage} />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal 2 */}
      <Modal
        visible={isModalVisible2}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible2(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>등장인물을 작성해 주세요</Text>
            <TextInput
              placeholder="이름을 입력하세요"
              value={characterName}
              onChangeText={setCharacterName}
              style={styles.input}
            />
            <TextInput
              placeholder="나이를 입력하세요"
              value={characterAge}
              onChangeText={setCharacterAge}
              style={styles.input}
            />
            <TextInput
              placeholder="성별을 입력하세요"
              value={characterGender}
              onChangeText={setCharacterGender}
              style={styles.input}
            />
            <TextInput
              placeholder="직업을 입력하세요"
              value={characterOccupation}
              onChangeText={setCharacterOccupation}
              style={styles.input}
            />
            <TextInput
              placeholder="특징을 입력하세요"
              value={characterCharacteristics}
              onChangeText={setCharacterCharacteristics}
              style={styles.input}
            />
            <Pressable
              style={[styles.okayButton, {backgroundColor: okayButtonColor}]}
              onPress={handleSaveCharacter}>
              <Text style={styles.okayButtonText}>저장하고 수정하기</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={onPressModalClose2}>
              <Image source={closeImage} style={styles.closeImage} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 40,
    color: '#000000',
    fontWeight: 'bold',
    padding: 10,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    marginTop: 10,
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
  buttonContainer: {
    flexDirection: 'column', // 버튼을 세로로 배열합니다.
    alignItems: 'center', // 버튼들을 가로 중앙에 위치시킵니다.
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    height: 60,
    width: '100%', // 버튼 너비를 80%로 조정하여 중앙 정렬을 개선합니다.
    borderRadius: 15,
    backgroundColor: '#9B9AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10, // 버튼 간의 간격을 조정합니다.
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000000',
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
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  characterProfile: {
    marginBottom: 10,
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
  okayButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeImage: {
    width: 40,
    height: 40,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#9B9AFF',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
});

export default Create_5;
