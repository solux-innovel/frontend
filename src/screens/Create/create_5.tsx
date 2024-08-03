// src/screens/Create/create_5.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialImageSource = require('../../img/Create/Create5-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 비동기 함수로 AI로부터 추천받은 등장인물을 가져오기
const fetchRecommendedCharacters = async (idea: string, genre: string, topic: string) => {
  // AI 또는 서버에서 추천받은 등장인물을 비동기적으로 가져옴
  // 이 부분을 실제 AI API 호출로 대체
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          role: '주연(주인공)',
          name: 'AI 추천 주연',
          age: '25',
          gender: '남자',
          occupation: '전사',
          characteristics: '용감하고, 진지하며, 정의감이 강하다.'
        },
        {
          role: '주연(상대역)',
          name: 'AI 추천 주연(상대역)',
          age: '24',
          gender: '여자',
          occupation: '마법사',
          characteristics: '지혜롭고, 신비로운 성격을 가지며, 전투에서 강하다.'
        },
        {
          role: '조연',
          name: 'AI 추천 조연',
          age: '30',
          gender: '남자',
          occupation: '상인',
          characteristics: '재치있고, 교활하며, 사업적 감각이 뛰어나다.'
        }
      ]);
    }, 1000); // 1초 후에 등장인물 반환
  });
};

const Create_5 = ({ route }) => {
  const navigation = useNavigation();
  const { novelId } = route.params; //전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");
  const [okayButtonColor, setOkayButtonColor] = useState("#9B9AFF");

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  // 저장된 데이터 변수
  const [savedIdea, setSavedIdea] = useState('');
  const [savedGenre, setSavedGenre] = useState('');
  const [savedTopic, setSavedTopic] = useState('');

  //입력한 등장인물과 선택한 등장인물 상태 변수
  const [character, setCharacter] = useState('');
  const [recommendedCharacters, setRecommendedCharacters] = useState([]);

  // 최초 화면 상태 변수
  const [buttonText, setButtonText] = useState("등장인물을 추천받고 싶어요");
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState('키워드, 장르, 주제를 바탕으로\n소설에 어울릴 만한 등장인물을 추천해드립니다');

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
        const newRecommendedCharacters = await fetchRecommendedCharacters(savedIdea, savedGenre, savedTopic);
        setRecommendedCharacters(newRecommendedCharacters);
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

    // 다시 추천받기 버튼, 이미지, 텍스트로 변경
    setButtonText("등장인물을 다시 추천받고 싶어요");
    setImage(againImage);
    setBottomText('추천받은 등장인물이 마음에 들지 않는다면\n등장인물을 다시 추천해드릴 수 있습니다\n창작자가 등장인물을 직접 작성할 수도 있습니다');
  }

  const onPressModalClose2 = async () => {
    setIsModalVisible2(false);
  }

  const onPressOkayButton = async () => {
    setOkayButtonColor("#000000");
    setTimeout(async () => {
      setOkayButtonColor("#9B9AFF");

      // 선택한 등장인물 저장
      try {
        if (recommendedCharacters.length > 0) {
          await AsyncStorage.setItem(`novelCharacter_${novelId}`, JSON.stringify(recommendedCharacters)); // id와 함께 저장
          setIsModalVisible1(false);
          navigation.navigate('Create_6', { novelId }); // id 전달
        } else {
          Alert.alert('경고', '추천받은 등장인물이 없습니다.');
        }
      } catch (e) {
        console.error('Failed to save character.', e);
      }
    }, 50); // 버튼 색상 복구
  }

  const onPressSaveEditButton = async () => {
    setOkayButtonColor("#000000");
    setTimeout(async () => {
      setOkayButtonColor("#9B9AFF");

      // 선택한 등장인물 저장
      try {
        if (recommendedCharacters.length > 0) {
          await AsyncStorage.setItem(`novelCharacter_${novelId}`, JSON.stringify(recommendedCharacters)); // id와 함께 저장
          setIsModalVisible2(false);
          navigation.navigate('Create_6', { novelId }); // id 전달
        } else {
          Alert.alert('경고', '추천받은 등장인물이 없습니다.');
        }
      } catch (e) {
        console.error('Failed to save character.', e);
      }
    }, 50); // 버튼 색상 복구
  }

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  const handleCharacterChange = (index: number, field: string, value: string) => {
    const updatedCharacters = [...recommendedCharacters];
    updatedCharacters[index] = { ...updatedCharacters[index], [field]: value };
    setRecommendedCharacters(updatedCharacters);
  };

  const handleAddCharacter = () => {
    const newCharacter = {
      role: '',
      name: '',
      age: '',
      gender: '',
      occupation: '',
      characteristics: '',
    };
    setRecommendedCharacters([...recommendedCharacters, newCharacter]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{`${userName} 창작자님의 소설에\n등장하는 친구들이 궁금해요!`}</Text>
        <Image source={image} style={styles.image}/>
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1, bottom: 100,}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>{buttonText}</Text>
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
            <ScrollView style={styles.characterContainer}>
              {recommendedCharacters.map((character, index) => (
                <View key={index} style={styles.characterItem}>
                  <Text style={styles.characterRole}>{character.role}</Text>
                  <Text style={styles.characterLabel}>이름: {character.name}</Text>
                  <Text style={styles.characterLabel}>나이: {character.age}</Text>
                  <Text style={styles.characterLabel}>성별: {character.gender}</Text>
                  <Text style={styles.characterLabel}>직업: {character.occupation}</Text>
                  <Text style={styles.characterLabel}>특징: {character.characteristics}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.okayButton, {backgroundColor: okayButtonColor}]} onPress={onPressOkayButton}>
              <Text style={styles.buttonText}>확정</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 두번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible2} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose2}>
              <Image source={closeImage} />
            </Pressable>
            <ScrollView style={styles.characterContainer}>
              {recommendedCharacters.map((character, index) => (
                <View key={index} style={styles.characterContainer}>
                  <TextInput
                    style={styles.characterRole}
                    placeholder="역할"
                    value={character.role}
                    onChangeText={(text) => handleCharacterChange(index, 'role', text)}
                  />
                  <Text style={styles.inputLabel}>이름 : </Text>
                  <TextInput
                    style={styles.textInput}
                    value={character.name}
                    onChangeText={(text) => handleCharacterChange(index, 'name', text)}
                    placeholder="이름"
                    maxLength={20}
                  />
                  <Text style={styles.inputLabel}>나이 : </Text>
                  <TextInput
                    style={styles.textInput}
                    value={character.age}
                    onChangeText={(text) => handleCharacterChange(index, 'age', text)}
                    placeholder="나이"
                    keyboardType="numeric"
                    maxLength={3} // 숫자 길이 제한
                  />
                  <Text style={styles.inputLabel}>성별 : </Text>
                  <TextInput
                    style={styles.textInput}
                    value={character.gender}
                    onChangeText={(text) => handleCharacterChange(index, 'gender', text)}
                    placeholder="성별"
                    maxLength={10}
                  />
                  <Text style={styles.inputLabel}>직업 : </Text>
                  <TextInput
                    style={styles.textInput}
                    value={character.occupation}
                    onChangeText={(text) => handleCharacterChange(index, 'occupation', text)}
                    placeholder="직업"
                    maxLength={20}
                  />
                  <Text style={styles.inputLabel}>특징 : </Text>
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    value={character.characteristics}
                    onChangeText={(text) => handleCharacterChange(index, 'characteristics', text)}
                    placeholder="특징"
                    multiline={true}
                    maxLength={300}
                  />
                </View>
              ))}
              <TouchableOpacity onPress={handleAddCharacter}>
                <Text style={styles.addButton}>+ 등장인물 추가</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={[styles.okayButton, {backgroundColor: okayButtonColor}]} onPress={onPressSaveEditButton}>
              <Text style={styles.buttonText}>수정 완료</Text>
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
    height: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 35,
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
  okayButton: {
    bottom: 20,
    position: 'absolute',
    height: 40,
    width: '40%',
    borderRadius: 15,
    backgroundColor: "#9B9AFF",
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    color: '#000000',
    fontSize: 18,
    borderColor: '#A2A2A2',
    borderBottomWidth: 1,
    padding: 5,
  },
  inputLabel: {
    fontSize: 18,
    color: '#000000',
  },
  characterContainer: {
    marginBottom: 30,
  },
  characterItem: {
    marginBottom: 15,
  },
  characterRole: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
    marginTop: 5,
  },
  characterLabel: {
    fontSize: 18,
    color: '#000000',
    margin: 5,
  },
  addButton: {
    fontSize: 18,
    color: '#9B9AFF',
    marginBottom: 10,
  },
});

export default Create_5;
