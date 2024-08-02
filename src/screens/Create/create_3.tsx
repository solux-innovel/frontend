// src/screens/Create/create_3.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialImageSource = require('../../img/Create/Create3-1_image.png');
const againImage = require('../../img/Create/Create_again.png');
const closeImage = require('../../img/Create/CloseSquare.png');
const backButtonImage = require('../../img/Create/BackSquare.png');

// 장르 5가지 가져오기
const fetchGenre = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['판타지', '로맨스', '일상', '스릴러', 'SF']);
    }, 1000); // 1초 후에 장르 반환
  });
};

const Create_3 = ({ route }) => {
  const navigation = useNavigation();
  const { novelId } = route.params; //전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [okayButtonColor, setOkayButtonColor] = useState("#9B9AFF");

  const [isModalVisible1, setIsModalVisible1] = useState(false);

  //선택한 장르 상태 변수
  const [genre, setGenre] = useState([]); // 초기값을 빈 배열로 설정
  const [selectedGenre, setSelectedGenre] = useState('');

  // 최초 화면 상태 변수
  const [buttonText, setButtonText] = useState("장르를 선택하고 싶어요");
  const [image, setImage] = useState(initialImageSource);
  const [bottomText, setBottomText] = useState('작성해주신 아이디어 키워드를\n바탕으로 장르를 선택해주세요');

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

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton1 = async () => {
    setButtonColor1("#000000");
    setTimeout(async () => {
      setButtonColor1("#9B9AFF");

      // 장르를 가져옴
      try {
        const newGenre = await fetchGenre();
        setGenre(newGenre);
        setIsModalVisible1(true);
      } catch (error) {
        console.error('Failed to fetch genre.', error);
      }
    }, 50); // 버튼 색상 복구
  };

  const onPressModalClose1 = () => {
    setIsModalVisible1(false);
  }

  const onPressOkayButton = async () => {
    setOkayButtonColor("#000000");
    setTimeout(async () => {
      setOkayButtonColor("#9B9AFF");

      // 선택된 장르 저장
      try {
        if (selectedGenre.length > 0) {
          await AsyncStorage.setItem(`novelGenre_${novelId}`, selectedGenre); // id와 함께 저장
          setIsModalVisible1(false);
          navigation.navigate('Create_4', { novelId }); // id 전달
        } else {
          Alert.alert('경고','장르를 선택해주세요.');
        }
      } catch (e) {
        console.error('Failed to save genre.', e);
      }
    }, 50); // 버튼 색상 복구
  }

  const onPressBackButton = () => {
    setIsModalVisible2(false);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre((prevSelected) => (prevSelected === genre ? '' : genre));
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{`${userName} 창작자님의 소설은\n어떤 장르이길 원하나요?`}</Text>
        <Image source={image} style={styles.image}/>
        <Text style={styles.bottomText}>{bottomText}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      {/* 첫번째 모달 */}
      <Modal animationType="slide" visible={isModalVisible1} transparent={true}>
        <View style={styles.modalBackground1}>
          <View style={styles.modalView}>
            <Pressable style={styles.closeButton} onPress={onPressModalClose1}>
              <Image source={closeImage} />
            </Pressable>
            <View style={styles.genreContainer}>
            {genre.map((genre, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.genreButton,
                  selectedGenre.includes(genre) && styles.selectedGenreButton,
                ]}
                onPress={() => handleGenreSelect(genre)}
              >
                <Text style={styles.genreButtonText}>{genre}</Text>
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
    margin: 40,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
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
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  genreButton: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedGenreButton: {
    backgroundColor: '#A2A2A2',
  },
  genreButtonText: {
    color: '#000000',
    fontSize: 16,
  },
});

export default Create_3;
