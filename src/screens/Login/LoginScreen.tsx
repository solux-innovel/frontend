// src/screens/LoginScreen.tsx
//0723 추가함

import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AppNavigator'; // 로그인 상태를 가져올 Context


type RootStackParamList = {
    Main: undefined;
    FindID: undefined;
    FindPassword: undefined;
    SignUp: undefined;
};
  
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { login } = useContext(AuthContext);

    const handleLogin = (platform: string) => {
        // 플랫폼에 따라 로그인 처리 (카카오, 네이버 등)
        console.log(`${platform} 로그인 버튼 클릭됨`);
        login(); // 로그인 상태 업데이트
        navigation.replace('Main'); // 로그인 성공 후 메인 화면으로 이동
    };

    return (
        <View style={styles.container}>
            {/* 로고 이미지 */}
            <Image source={require('../../img/mainlogo.png')} style={styles.logo}/>

            {/* 카카오와 네이버 로그인 버튼 */}
            <TouchableOpacity onPress={() => handleLogin('Kakao')} style={styles.button}>
                <Image source={require('../../img/kakaobutton.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLogin('Naver')} style={styles.button}>
                <Image source={require('../../img/naverbutton.png')} style={styles.buttonImage} />
            </TouchableOpacity>

            {/* 아이디 찾기, 비밀번호 찾기, 회원가입 버튼을 한 줄로 배치 */}
            <View style={styles.textContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('FindID')}>
                    <Text style={styles.text}>아이디 찾기</Text>
                </TouchableOpacity>
                <Text style={styles.separator}>|</Text>
                <TouchableOpacity onPress={() => navigation.navigate('FindPassword')}>
                    <Text style={styles.text}>비밀번호 찾기</Text>
                </TouchableOpacity>
                <Text style={styles.separator}>|</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.text}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,//
    },
    logo: {
        width: '95%', // 부모 컨테이너의 100%를 사용
        height: undefined, // 높이를 자동으로 조정
        aspectRatio: 1, // 비율에 맞춰서 조정
        marginBottom: 100,
    },
    button: {
        width: '95%', // 부모 컨테이너의 95%를 사용
        height: 50, // 버튼의 높이를 명시적으로 설정
        marginVertical: 10,
    },
    buttonImage: {
        width: '100%', // 부모 컨테이너의 100%를 사용
        height: '100%', // 부모 컨테이너의 100%를 사용
    },
    textContainer: {
        flexDirection: 'row', // 버튼을 가로로 배치
        marginTop: 30,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#000000',
        marginHorizontal: 3, // 버튼 사이의 간격
    },
    separator: {
        fontSize: 16,
        color: '#000000',
        marginHorizontal: 3, // 구분 기호와 버튼 사이의 간격
    },
});

export default LoginScreen;