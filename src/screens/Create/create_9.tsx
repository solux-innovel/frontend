// src/screens/Create/create_9.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AI로부터 추천받은 이미지를 가져오는 비동기 함수
const fetchAICoverImage = async (concept: string, topic: string, background: string, character: string, plot: string, novel: string) => {
  try {
    // AI 추천 이미지를 가져오는 API 호출
    // 여기서는 예시로 기존에 있던 이미지 URL을 사용
    // 실제 구현에서는 API 호출을 통해 이미지 URL을 받아와야 함
    //const response = await fetch('https://api.example.com/get-cover-image');
    //const data = await response.json();
    //const newImageUri = data.imageUri;

    // 예시로 로컬 이미지 추가
    const newImageUri = Image.resolveAssetSource(require('../../img/Create/Create9-2_image.png')).uri;

    // 이미지 경로를 업데이트
    //setImagePaths([...imagePaths, { uri: newImageUri }]);
    return newImageUri;
  } catch (error) {
    console.error('Failed to fetch AI image.', error);
    return null;
  }
};

const Create_9 = ({ route }) => {
  const navigation = useNavigation();
  const { novelId } = route.params;  //전달받은 소설 id

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");

  // 현재 이미지의 경로를 관리
  const [currentImagePath, setCurrentImagePath] = useState(null);

  // 저장된 데이터 변수
  const [savedConcept, setSavedConcept] = useState('');
  const [savedTopic, setSavedTopic] = useState('');
  const [savedBackground, setSavedBackground] = useState('');
  const [savedCharacter, setSavedCharacter] = useState('');
  const [savedPlot, setSavedPlot] = useState('');
  const [savedNovel, setSavedNovel] = useState('');
  const [savedTitle, setSavedTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 앞에서 저장된 데이터 호출
        const concept = await AsyncStorage.getItem(`novelConcept_${novelId}`);
        const topic = await AsyncStorage.getItem(`novelTopic_${novelId}`);
        const background = await AsyncStorage.getItem(`novelBackground_${novelId}`)
        const character = await AsyncStorage.getItem(`novelCharacter_${novelId}`)
        const plot = await AsyncStorage.getItem(`novelPlot_${novelId}`)
        const novel = await AsyncStorage.getItem(`finalNovel_${novelId}`)
        const title = await AsyncStorage.getItem(`novelTitle_${novelId}`)

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

        if (novel !== null) {
          setSavedNovel(novel);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Novel:', novel);
        }

        if (title !== null) {
          setSavedTitle(title);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Title:', title);
        }

        // 저장된 내용을 바탕으로 AI 추천 이미지를 가져와서 설정
        const initialImageUri = await fetchAICoverImage(savedConcept, savedTopic, savedBackground, savedCharacter, savedPlot, savedNovel);
        if (initialImageUri) {
          setCurrentImagePath(initialImageUri);
        } else {
          setCurrentImagePath(Image.resolveAssetSource(require('../../img/Create/Create9-1_image.png')).uri);
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
      const newImageUri = await fetchAICoverImage();
      if (newImageUri) {
        setCurrentImagePath(newImageUri);
      } else {
        // 이미지가 더 이상 없으면 알림
        alert('더 이상 이미지가 없습니다.');
      }
    }, 50); // 버튼 색상 복구
  };

  // 두 번째 버튼 색상 변경 함수
  const handlePressButton2 = async () => {
    setButtonColor2("#000000");
    setTimeout(async () => {
      setButtonColor2("#9B9AFF");
      try {
        if (currentImagePath) {
          await AsyncStorage.setItem(`novelThumbnail_${novelId}`, JSON.stringify(currentImagePath));
          //console.log(JSON.stringify(currentImagePath))
          navigation.navigate('Create_10', { novelId });
        } else {
          alert('이미지 저장 실패');
        }
      } catch (error) {
        console.error('Failed to save novel thumbnail.', error);
      }
    }, 50); // 버튼 색상 복구
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'거의 다 왔습니다!\n소설의 표지를 추천해드릴게요!'}</Text>
        {currentImagePath && <Image source={{ uri: currentImagePath }} style={styles.image}/>}
        <Text style={styles.bottomText}>{'소설과 어울리는 표지를 추천합니다!\n표지를 다시 추천받을 수도 있고\n마음에 든다면 그대로 발행할 수 있습니다'}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor1, bottom: 100,}]} onPress={handlePressButton1}>
        <Text style={styles.buttonText}>표지를 다시 추천받고 싶어요</Text>
      </TouchableOpacity>

      {/* 두번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor2}]} onPress={handlePressButton2}>
        <Text style={styles.buttonText}>소설을 발행하고 싶어요</Text>
      </TouchableOpacity>
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
    width: 210,
    height: 270,
    margin: 30,
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
});

export default Create_9;
