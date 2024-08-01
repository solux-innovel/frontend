// App.tsx
import React, {useEffect} from 'react';
import {KakaoLogins} from '@react-native-seoul/kakao-login';
import AppNavigator from './src/navigation/AppNavigator';

// 카카오 SDK 초기화
const initializeKakao = async () => {
  try {
    // 'YOUR_KAKAO_APP_KEY'를 실제 앱 키로 교체하세요
    KakaoLogins.initialize('450a91574469267bdc7bfd6bea6050dd');
    console.log('Kakao SDK 초기화 성공');
  } catch (error) {
    console.error('Kakao SDK 초기화 실패:', error);
  }
};

const App = () => {
  useEffect(() => {
    // 앱 초기화 시 카카오 SDK를 초기화합니다
    initializeKakao();
  }, []);

  return <AppNavigator />;
};

export default App;
