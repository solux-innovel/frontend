// src/screens/Create/create_10.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const imageSource = require('../../img/Create/Create10_image.png');

const Create_10 = ({ route }) => {
  const navigation = useNavigation();
  const { novelId } = route.params;  //전달받은 소설 id

  const [buttonColor, setButtonColor] = useState("#9B9AFF");

  // 저장된 데이터 변수
  const [savedConcept, setSavedConcept] = useState('');
  const [savedTopic, setSavedTopic] = useState('');
  const [savedCharacter, setSavedCharacter] = useState('');
  const [savedPlot, setSavedPlot] = useState('');
  const [savedNovel, setSavedNovel] = useState('');
  const [savedTitle, setSavedTitle] = useState('');
  const [savedThumbnail, setSavedThumbnail] = useState('');

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
        // 앞에서 저장된 데이터 호출
        const concept = await AsyncStorage.getItem(`novelConcept_${novelId}`);
        const topic = await AsyncStorage.getItem(`novelTopic_${novelId}`);
        const character = await AsyncStorage.getItem(`novelCharacter_${novelId}`)
        const plot = await AsyncStorage.getItem(`novelPlot_${novelId}`)
        const novel = await AsyncStorage.getItem(`finalNovel_${novelId}`)
        const title = await AsyncStorage.getItem(`novelTitle_${novelId}`)
        const thumbnail = await AsyncStorage.getItem(`novelThumbnail_${novelId}`)

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

        if (thumbnail !== null) {
          const parsedThumbnail = JSON.parse(thumbnail);
          setSavedThumbnail(parsedThumbnail);
          //AI 추천 기능에 사용하고 싶다면 여기에서 AI 호출
          //console.log('Saved Thumbnail:', parsedThumbnail);
        }
      } catch (error) {
          console.error('Failed to load data.', error);
      }
    };

    fetchData();
  }, [novelId]);

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton = async () => {
    setButtonColor("#000000");
    setTimeout(async () => {
      setButtonColor("#9B9AFF");
      // 전달할 데이터 객체 생성
      const novelData = {
        id: novelId,
        concept: savedConcept,
        topic: savedTopic,
        character: savedCharacter,
        plot: savedPlot,
        novel: savedNovel,
        title: savedTitle,
        thumbnail: savedThumbnail,
      };
      try {
        // 데이터 저장
        await AsyncStorage.setItem(`novelData_${novelId}`, JSON.stringify(novelData));

        // currentNovelId 초기화
        await AsyncStorage.removeItem('currentNovelId');

        // 홈 화면으로 이동
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Main', state: { routes: [{ name: 'Home' }] } },
            ],
          })
        );
      } catch (error) {
        console.error('Failed to save novel data.', error);
      }
    }, 50); // 버튼 색상 복구
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{`${userName} 창작자님이 창작한\n소설을 발행하는 데에 성공했습니다!`}</Text>
        <Image source={imageSource} style={styles.image}/>
        <Text style={styles.bottomText}>{`소설을 발행하신 것을 축하드립니다!\n앞으로도 ${userName} 창작자님의 소설 창작을\n이노블이 열심히 응원하고 돕겠습니다`}</Text>
      </View>

      {/* 첫번째 버튼 */}
      <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor}]} onPress={handlePressButton}>
        <Text style={styles.buttonText}>저장하고 홈 화면으로 돌아가기</Text>
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
    width: 320,
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
});

export default Create_10;
