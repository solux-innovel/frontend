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

async function addRecentPost(postId) {
    try {
        const response = await fetch('https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/posts/recent-read/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                postId: postId
            }).toString() // URLSearchParams를 문자열로 변환
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to add recent read:', response.statusText);
            console.error('Error Response Text:', errorText);
            throw new Error('Failed to add recent read');
        }

        // 요청이 성공했음을 알리고 상태 업데이트
        console.log('Successfully added recent read');
    } catch (error) {
        console.error('Error adding recent read:', error.message);
    }
}

const RecommendedScreen = () => {
  const navigation = useNavigation();
  const [recentViewed, setRecentViewed] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState(null);

  {/*
  //서버 안될때 대비해서 만든 예시 리스트
  const recommended = [
    {
      id: 1,
      title: '추천하는 작품 제목 5',
      author: '작가 이름 5',
      episode: '회차 번호 5',
      image: require('../../img/book5.png'),
    },
    {
      id: 2,
      title: '추천하는 작품 제목 6',
      author: '작가 이름 6',
      episode: '회차 번호 6',
      image: require('../../img/book6.png'),
    },
    {
      id: 3,
      title: '추천하는 작품 제목 7',
      author: '작가 이름 7',
      episode: '회차 번호 7',
      image: require('../../img/book7.png'),
    },
    {
      id: 4,
      title: '추천하는 작품 제목 8',
      author: '작가 이름 8',
      episode: '회차 번호 8',
      image: require('../../img/book8.png'),
    },
  ];
  */}

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch(`https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/main`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched recent&recommended data:', data); // 서버에서 받은 데이터 출력
          const [recent, recommendedPosts] = data;
          setRecentViewed(recent);
          setRecommended(recommendedPosts);
        } else {
          console.error('Failed to fetch recent&recommended data:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch recent&recommended data:', error);
      }
    };

    fetchRecommended();

    {/*
    // 변경을 감지하기 위한 interval 설정
    const interval = setInterval(fetchRecommended, 1000); // 1초마다 업데이트 체크

    // 컴포넌트 언마운트 시 interval 클리어
    return () => clearInterval(interval);
    */}
  }, []);

  const openModal = async (novel) => {
    try {
        setSelectedNovel(novel);
        setModalVisible(true);

        // 현재 최근 본 작품 목록에서 선택된 소설의 ID가 있는지 확인
        const isAlreadyViewed = recentViewed.some(item => item.id === novel.id);

        if (!isAlreadyViewed) {
            // 서버에 최근 본 게시물 추가 요청
            await addRecentPost(novel.id);

            // 요청 성공 후 상태 업데이트
            const updatedRecentViewed = [...recentViewed, novel];
            setRecentViewed(updatedRecentViewed);
        } else {
            console.log('The novel is already in the recent viewed list.');
        }
    } catch (error) {
        console.error('Error handling modal open:', error.message);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNovel(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={require('../../img/ArrowLeft.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>추천하는 작품</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {recommended.map(item => (
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
                <Text style={styles.buttonText}>감상하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowRightButton} onPress={() => openModal(item)}>
                <Image
                  source={require('../../img/ArrowRight.png')}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 0,
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
  scrollView: {
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
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
  },
  arrowRightButton: {
    marginLeft: 4,
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

export default RecommendedScreen;
