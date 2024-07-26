// src/screens/Create/create_9.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 이미지들을 배열로 관리
const imagePaths = [
  require('../../img/Create/Create9-1_image.png'),
  require('../../img/Create/Create9-2_image.png'),
  // 추가 이미지 경로를 여기에 추가
];

const Create_9 = () => {
  const navigation = useNavigation();

  const [buttonColor1, setButtonColor1] = useState("#9B9AFF");
  const [buttonColor2, setButtonColor2] = useState("#9B9AFF");

  // 현재 이미지의 인덱스를 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {

  }, []);

  // 첫 번째 버튼 색상 변경 함수
  const handlePressButton1 = () => {
    setButtonColor1("#000000");
    setTimeout(() => {
      setButtonColor1("#9B9AFF");
      // 새로 생성한 이미지 추가
      //addNewImage();
      // 현재 이미지 인덱스를 업데이트
      if (currentImageIndex < imagePaths.length -1 ) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        // 이미지가 더 이상 없으면 알림
        alert('더 이상 이미지가 없습니다.');
      }
    }, 50); // 버튼 색상 복구
  };

  // 두 번째 버튼 색상 변경 함수
  const handlePressButton2 = () => {
    setButtonColor2("#000000");
    setTimeout(() => {
      setButtonColor2("#9B9AFF");
      navigation.navigate('Create_10');
    }, 50); // 버튼 색상 복구
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.topText}>{'거의 다 왔습니다!\n소설의 표지를 추천해드릴게요!'}</Text>
        <Image source={imagePaths[currentImageIndex]} style={styles.image}/>
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
