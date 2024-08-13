import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Pressable, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/Home/homescreenStyles';
//import { API_URL } from '@env';

const genreMapping = {
  '판타지': 'FANTASY',
  '로맨스': 'ROMANCE',
  '일상': 'DAILY',
  '스릴러': 'THRILLER',
  'SF': 'SF'
};

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

const Home = () => {
  const [userName, setUserName] = useState('눈송이'); // 기본값 설정
  const [recentViewed, setRecentViewed] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const navigation = useNavigation();
  const genres = Object.keys(genreMapping); // 화면에 표시할 장르 목록

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userNickname');
        if (storedUserName) {
          setUserName(storedUserName);
        }
      } catch (error) {
        console.error('Failed to fetch user nickname from AsyncStorage', error);
      }
    };


    //서버 요청 -> 응답 최근 본 작품 4개, 전체 게시물 목록 4개
    const fetchData = async () => {
      try {
        const response = await fetch(`https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/main`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched home data:', data); // 서버에서 받은 데이터 출력
          const [recent, recommendedPosts] = data;
          setRecentViewed(recent);
          setRecommended(recommendedPosts);
        } else {
          console.error('Failed to fetch home data:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      }
    };

    fetchUserName();
    fetchData();

    {/*
    // 변경을 감지하기 위한 interval 설정
    const interval = setInterval(fetchData, 1000); // 1초마다 업데이트 체크

    // 컴포넌트 언마운트 시 interval 클리어
    return () => clearInterval(interval);
    */}
  }, []);

{/*
  const openModal = (novel) => {
    setSelectedNovel(novel);
    setModalVisible(true);
  };
*/}

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
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={require('../../img/homescreenBanner.png')}
          style={styles.bannerImage}
        />
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>장르 카테고리</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.genreScroll}>
          <TouchableOpacity
            style={styles.genreItem}
            onPress={() => navigation.navigate('Genre', { isAll: true })}
          >
            <Text style={styles.genreText}>전체</Text>
          </TouchableOpacity>
          {genres.map((genre, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.genreItem,
                index === genres.length - 1 && { marginRight: 16 },
              ]}
              onPress={() => navigation.navigate('Genre', { genre: genreMapping[genre] })}
            >
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{userName}님이 최근 본 작품</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RecentViewed', {recentViewed})}>
            <Image
              source={require('../../img/ArrowRight.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.contentScroll}>
          {recentViewed.map((item, index) => (
            <TouchableOpacity key={index} style={styles.contentItem} onPress={() => openModal(item)}>
              <Image source={item.thumbnail ? { uri: item.thumbnail } : defaultThumbnail} style={styles.contentThumbnail} />
              <Text style={styles.contentTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {userName}님에게 이노블이 추천하는 작품
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Recommended')}>
            <Image
              source={require('../../img/ArrowRight.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.contentScroll}>
          {recommended.map((item, index) => (
            <TouchableOpacity key={index} style={styles.contentItem} onPress={() => openModal(item)}>
              <Image source={item.thumbnail ? { uri: item.thumbnail } : defaultThumbnail} style={styles.contentThumbnail} />
              <Text style={styles.contentTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 여기에 빈 View를 추가하여 하단 여유 공간 확보 */}
      <View style={{ height: 16 }} />

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
    </ScrollView>
  );
};

export default Home;