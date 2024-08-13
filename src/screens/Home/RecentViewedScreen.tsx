import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import { API_URL } from '@env';

const defaultThumbnail = require('../../img/My/Thumbnail.png');

const RecentViewedScreen = ({route}) => {
  const navigation = useNavigation(); // Navigation 훅 추가
  const [recentViewed, setRecentViewed] = useState(route.params?.recentViewed || []); // 상태 관리 추가

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState(null);

  {/*
  //서버 안될때 대비해서 만든 예시 리스트
  const recentViewed = [
    {
      id: 1,
      title: '추천하는 작품 제목 1',
      author: '작가 이름 1',
      episode: '회차 번호 1',
      image: require('../../img/book1.png'),
    },
    {
      id: 2,
      title: '추천하는 작품 제목 2',
      author: '작가 이름 2',
      episode: '회차 번호 2',
      image: require('../../img/book2.png'),
    },
    {
      id: 3,
      title: '추천하는 작품 제목 3',
      author: '작가 이름 3',
      episode: '회차 번호 3',
      image: require('../../img/book3.png'),
    },
    {
      id: 4,
      title: '추천하는 작품 제목 4',
      author: '작가 이름 4',
      episode: '회차 번호 4',
      image: require('../../img/book4.png'),
    },
  ];


  useEffect(() => {
    // 서버에서 최근 읽은 게시물 목록을 가져오는 함수
    const fetchRecentViewed = async () => {
      try {
        const response = await fetch(`https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/posts/recent-read/list`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched recent viewed data:', data); // 서버에서 받은 데이터 출력
        setRecentViewed(data); // 응답의 게시물 목록을 상태에 저장
      } catch (error) {
        console.error('Error fetching recent viewed data:', error);
      }
    };

    fetchRecentViewed();


    // 변경을 감지하기 위한 interval 설정
    const interval = setInterval(fetchRecentViewed, 1000); // 1초마다 업데이트 체크

    // 컴포넌트 언마운트 시 interval 클리어
    return () => clearInterval(interval);

  }, []);
  */}

  const openModal = (novel) => {
    setSelectedNovel(novel);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNovel(null);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={require('../../img/ArrowLeft.png')} // 뒤로 가기 아이콘 이미지 경로
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>최근 본 작품</Text>
      </View>
      <ScrollView style={styles.container}>
        {recentViewed.map(item => (
          <View key={item.id} style={styles.item}>
            <Image
              source={item.thumbnail ? { uri: item.thumbnail } : defaultThumbnail}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.genre}>{item.genre}</Text>
              {/*<Text style={styles.episode}>{item.episode}</Text>*/}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => openModal(item)}>
                <Text style={styles.buttonText}>이어보기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowRightButton} onPress={() => openModal(item)}>
                <Image
                  source={require('../../img/ArrowRight.png')} // 오른쪽 화살표 이미지 경로
                  style={styles.arrowRightIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedNovel && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Image source={require('../../img/Create/CloseSquare.png')} />
              </Pressable>
              <ScrollView>
                <Image
                  source={selectedNovel.thumbnail ? { uri: selectedNovel.thumbnail } : defaultThumbnail}
                  style={styles.modalThumbnail}
                />
                <Text style={styles.modalTitle}>{selectedNovel.title}</Text>
                <Text style={styles.modalGenre}>{selectedNovel.genre}</Text>
                <Text style={styles.modalText}>
                  {selectedNovel.content || '내용이 없습니다.'}
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 0, // 줄 제거
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  author: {
    fontSize: 14,
    color: '#000',
  },
  episode: {
    fontSize: 12,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 8, // 간격 좁히기
    paddingVertical: 4,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
  },
  arrowRightButton: {
    marginLeft: 4, // 간격 좁히기
  },
  arrowRightIcon: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 1,
    right: 1,
    zIndex: 1,
  },
  modalThumbnail: {
    width: 200,
    height: 270,
    marginTop: 20,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  modalGenre: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 15,
  },
});

export default RecentViewedScreen;
