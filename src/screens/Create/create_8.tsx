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
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {OPENAI_API_KEY} from '@env'; // .env에서 API 키를 가져옴

// 이미지 파일 경로 설정
const initialImageSource = require('../../img/Create/Create8-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 첫 번째 호출: 기본 제목 추천
const fetchInitialRecommendedTitle = async (
  idea,
  genre,
  selectedTopic,
  character,
  plot,
  novel,
) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `다음 정보를 기반으로 소설 제목을 제안해 주세요:\n\n아이디어: ${idea}\n장르: ${genre}\n주제: ${selectedTopic}\n캐릭터: ${character}\n줄거리: ${plot}\n소설: ${novel}
            제목 단어만을 호출하며, '새로운 제목', '새로운 제안' 등의 키워드가 포함되는 것은 금지합니다`,
          },
        ],
        max_tokens: 30,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // API 호출 결과에서 제목을 추출합니다.
    const initialTitle =
      response.data.choices[0]?.message?.content?.trim() ||
      '새로운 AI 추천 제목';
    return initialTitle;
  } catch (error) {
    console.error('제목 추천 요청에 실패했습니다.', error);
    return '새로운 AI 추천 제목';
  }
};

// 두 번째 호출: 첫 번째 추천 제목을 기반으로 더 관련성 높은 제목 추천
const fetchImprovedTitle = async (
  initialTitle,
  idea,
  genre,
  selectedTopic,
  character,
  plot,
  novel,
) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `다음 정보를 기반으로 제목을 개선해 주세요:\n\n기본 제목: ${initialTitle}\n아이디어: ${idea}\n장르: ${genre}\n주제: ${selectedTopic}\n캐릭터: ${character}\n줄거리: ${plot}\n소설: ${novel}
            제목 단어만을 호출하며, '새로운 제목', '새로운 제안' 등의 키워드가 포함되는 것은 금지합니다`,
          },
        ],
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // API 호출 결과에서 제목을 추출합니다.
    const improvedTitle =
      response.data.choices[0]?.message?.content?.trim() ||
      '새로운 AI 추천 제목';
    return improvedTitle;
  } catch (error) {
    console.error('제목 개선 요청에 실패했습니다.', error);
    return '새로운 AI 추천 제목';
  }
};

const Create_8 = ({route}) => {
  const navigation = useNavigation();
  const {novelId} = route.params; // 전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState('#9B9AFF');
  const [buttonColor2, setButtonColor2] = useState('#9B9AFF');
  const [okayButtonColor, setOkayButtonColor] = useState('#9B9AFF');

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  // 저장된 데이터 변수
  const [savedIdea, setSavedIdea] = useState('');
  const [savedGenre, setSavedGenre] = useState('');
  const [savedSelectedTopic, setSavedSelectedTopic] = useState('');
  const [savedCharacter, setSavedCharacter] = useState('');
  const [savedPlot, setSavedPlot] = useState('');
  const [savedNovel, setSavedNovel] = useState('');

  // 입력한 컨셉과 선택한 컨셉 상태 변수
  const [title, setTitle] = useState('');
  const [recommendedTitle, setRecommendedTitle] = useState('추천 받은 제목');
  const [isTitleSelected, setIsTitleSelected] = useState(false); // 상태 변수 추가

  // 최초 화면 상태 변수
  const [buttonText, setButtonText] = useState('제목을 추천받고 싶어요');
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState(
    '지금까지의 정보들을 바탕으로\n소설과 어울리는 제목을 추천합니다!',
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 앞에서 저장된 데이터 호출
        const idea = await AsyncStorage.getItem(`novelIdea_${novelId}`);
        const genre = await AsyncStorage.getItem(`novelGenre_${novelId}`);
        const selectedTopic = await AsyncStorage.getItem(
          `novelTopic_${novelId}`,
        );
        const character = await AsyncStorage.getItem(
          `novelCharacter_${novelId}`,
        );
        const plot = await AsyncStorage.getItem(`novelPlot_${novelId}`);
        const novel = await AsyncStorage.getItem(`finalNovel_${novelId}`);

        if (idea !== null) {
          setSavedIdea(idea);
        }
        if (genre !== null) {
          setSavedGenre(genre);
        }
        if (selectedTopic !== null) {
          setSavedSelectedTopic(selectedTopic);
        }
        if (character !== null) {
          setSavedCharacter(character);
        }
        if (plot !== null) {
          setSavedPlot(plot);
        }
        if (novel !== null) {
          setSavedNovel(novel);
        }
      } catch (error) {
        console.error('데이터 로드에 실패했습니다.', error);
      }
    };

    fetchData();
  }, [novelId]);

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton1 = async () => {
    setButtonColor1('#000000');
    setTimeout(async () => {
      setButtonColor1('#9B9AFF');

      // 저장된 데이터를 사용하여 AI로부터 추천 받은 제목을 가져옴
      try {
        const initialTitle = await fetchInitialRecommendedTitle(
          savedIdea,
          savedGenre,
          savedSelectedTopic,
          savedCharacter,
          savedPlot,
          savedNovel,
        );
        const improvedTitle = await fetchImprovedTitle(
          initialTitle,
          savedIdea,
          savedGenre,
          savedSelectedTopic,
          savedCharacter,
          savedPlot,
          savedNovel,
        );
        setRecommendedTitle(improvedTitle);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('제목 추천에 실패했습니다.', error);
      }
    }, 50); // 버튼 색상 복구
  };

  // 두 번째 버튼 색상 변경 함수
  const handlePressButton2 = () => {
    setButtonColor2('#000000');
    setTimeout(() => {
      setButtonColor2('#9B9AFF');
      setIsModalVisible2(true);
    }, 50); // 버튼 색상 복구
  };

  const onPressModalClose1 = async () => {
    setIsModalVisible1(false);

    // 다시 추천받기 버튼, 이미지, 텍스트로 변경
    setButtonText('제목을 다시 추천받고 싶어요');
    setImage(againImage);
    setBottomText(
      '추천받은 제목이 마음에 들지 않는다면\n제목을 다시 추천해드릴 수 있습니다\n창작자가 제목을 직접 작성할 수도 있습니다',
    );

    // 다시 추천받기 버튼 클릭 시 새로운 제목을 가져옵니다.
    try {
      const initialTitle = await fetchInitialRecommendedTitle(
        savedIdea,
        savedGenre,
        savedSelectedTopic,
        savedCharacter,
        savedPlot,
        savedNovel,
      );
      const improvedTitle = await fetchImprovedTitle(
        initialTitle,
        savedIdea,
        savedGenre,
        savedSelectedTopic,
        savedCharacter,
        savedPlot,
        savedNovel,
      );
      setRecommendedTitle(improvedTitle);
    } catch (error) {
      console.error('제목 추천에 실패했습니다.', error);
    }
  };

  const onPressModalClose2 = async () => {
    // 입력한 제목 저장
    try {
      await AsyncStorage.setItem(`novelTitle_${novelId}`, title); // id와 함께 저장
      setIsModalVisible2(false);
      navigation.navigate('Create_9', {novelId}); // id 전달
    } catch (e) {
      console.error('제목 저장에 실패했습니다.', e);
    }
  };

  const onPressOkayButton = async () => {
    setOkayButtonColor('#000000');
    setTimeout(async () => {
      setOkayButtonColor('#9B9AFF');

      // 선택된 제목 저장
      try {
        if (isTitleSelected) {
          await AsyncStorage.setItem(`novelTitle_${novelId}`, recommendedTitle); // id와 함께 저장
          setIsModalVisible1(false);
          navigation.navigate('Create_9', {novelId}); // id 전달
        } else {
          Alert.alert('경고', '제목을 선택해주세요.');
        }
      } catch (e) {
        console.error('제목 저장에 실패했습니다.', e);
      }
    }, 50); // 버튼 색상 복구
  };

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  const handleTitlePress = () => {
    setIsTitleSelected(prev => !prev); // 토글 기능
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>
          {'거의 다 왔습니다!\n소설의 제목을 추천해드릴게요!'}
        </Text>
        <Image source={image} style={styles.image} />
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>

      {/* 첫 번째 버튼 */}
      <TouchableOpacity
        style={[styles.button, {backgroundColor: buttonColor1, bottom: 100}]}
        onPress={handlePressButton1}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      {/* 두 번째 버튼 */}
      <TouchableOpacity
        style={[styles.button, {backgroundColor: buttonColor2}]}
        onPress={handlePressButton2}>
        <Text style={styles.buttonText}>제목을 직접 작성할래요</Text>
      </TouchableOpacity>
      {/* 첫 번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <Text style={styles.modalTitle}>이노블이 추천하는 제목</Text>
            <TouchableOpacity
              style={[
                styles.titleButton,
                {backgroundColor: isTitleSelected ? '#A2A2A2' : '#E0E0E0'},
              ]}
              onPress={handleTitlePress}>
              <Text style={styles.titleButtonText}>{recommendedTitle}</Text>
            </TouchableOpacity>
            {/* 세 번째 버튼 (추천 내용 확정) */}
            <TouchableOpacity
              style={[styles.okayButton, {backgroundColor: okayButtonColor}]}
              onPress={onPressOkayButton}>
              <Text style={styles.buttonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 두 번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible2} transparent={true}>
        <View style={styles.modalBackground2}>
          <View style={styles.modalView2}>
            <Pressable style={styles.backButton} onPress={onPressBackButton}>
              <Image source={backButtonImage} />
            </Pressable>
            <Pressable style={styles.saveButton} onPress={onPressModalClose2}>
              <Text style={styles.saveButtonText}>저장</Text>
            </Pressable>
            <TextInput
              style={styles.textInput}
              placeholder="제목을 직접 작성해주세요"
              placeholderTextColor="#FFFFFF"
              maxLength={30}
              value={title}
              onChangeText={setTitle}
            />
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
    fontSize: 18,
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
    backgroundColor: '#9B9AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginTop: 20, // 모달 상단과 제목 사이의 공간
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
    margin: '10%',
    height: 300,
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
  okayButton: {
    bottom: 20,
    position: 'absolute',
    height: 40,
    width: '40%',
    borderRadius: 15,
    backgroundColor: '#9B9AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
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
  titleButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    marginTop: 40,
    marginBottom: 20,
  },
  titleButtonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default Create_8;
