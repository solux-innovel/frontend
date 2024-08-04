// MyNovel.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Pressable, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { API_URL } from '@env';

const thumbnailImage = require('../../img/My/Thumbnail.png');
const closeImage = require('../../img/Create/CloseSquare.png');

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

const MyNovel = () => {
  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [novelContent, setNovelContent] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        //유저 아이디
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('Stored User ID:', storedUserId); // 추가된 로그
        if (storedUserId) {
          setUserId(storedUserId);
          fetchNovels(storedUserId);
        }
      } catch (error) {
        console.error('Failed to load user ID.', error);
      }
    };

    fetchUserId(); // 처음 로딩 시 userId를 가져오고 소설 목록을 가져옵니다.
  }, []);

  const fetchNovels = async (userId: string) => {
    try {
      const response = await fetch(`https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/mypage/mypost?socialId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (response.ok) {
        setNovels(responseData.posts);
      } else {
        console.error('Failed to fetch novels from backend');
      }
    } catch (error) {
      console.error('Failed to load novels.', error);
    }
  };

  {/*
  const fetchNovels = async (userId: string) => {
    try {
      // 기존 AsyncStorage에서 소설 목록 가져오기
      const keys = await AsyncStorage.getAllKeys();
      const novelKeys = keys.filter(key => key.startsWith('novelData_'));

      const novelData = await Promise.all(novelKeys.map(async (key) => {
        const data = await AsyncStorage.getItem(key);
        const parsedData = JSON.parse(data);


        // genre 값이 JSON 문자열일 경우 배열로 변환
        if (typeof parsedData.genre === 'string') {
          try {
            parsedData.genre = JSON.parse(parsedData.genre);
          } catch (error) {
            // JSON 파싱 실패 시 문자열 그대로 사용
            parsedData.genre = parsedData.genre;
          }
        }

        return parsedData;
      }));

      setNovels(novelData);
      console.log('Fetched novels:', novelData); // 상태 로그

      // 백엔드로 userId 전송
      await sendUserIdToBackend(userId);
    } catch (error) {
      console.error('Failed to load novels.', error);
    }
  };

  const sendUserIdToBackend = async (userId: string) => {
    try {//백엔드 엔드포인트 변경 필요
      const response = await fetch(`http://10.101.38.18:8080/innovel/mypage/mypost?socialId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify({ userId }),
      });

      const responseData=await response.json();
      console.log('Response Data:', responseData)

      if (!response.ok) {
        throw new Error('Failed to send user ID to backend');
      }

      console.log('User ID sent to backend successfully.');
    } catch (error) {
      console.error('Error sending user ID to backend:', error);
    }
  };
  */}


  const handlePress = async (novel) => {
    setSelectedNovel(novel);

    console.log('Selected Novel:', novel); // novel 객체 전체 출력
    console.log('Novel ID:', novel.id); // novel.id 출력
    //setTitle(novel.title);
    // 배열을 문자열로 변환하여 설정

    //setGenre(Array.isArray(novel.genre) ? novel.genre.join(', ') : novel.genre || '');
    //setNovelContent(novel.novel);
    setModalVisible(true);


  try {
    const response = await fetch(`https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/posts/${novel.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    console.log('Detailed Novel Data:', responseData);

    if (response.ok) {
      // 상세 소설 데이터를 상태에 설정
      setTitle(responseData.title);
      setGenre(Array.isArray(responseData.genre) ? responseData.genre.join(', ') : responseData.genre || '');
      setNovelContent(responseData.content);

            // 최근 읽은 소설로 추가
            if (novel.id) {
                await addRecentPost(novel.id);
            }
    } else {
      console.error('Failed to fetch detailed novel data from backend');
    }
  } catch (error) {
    console.error('Failed to load detailed novel data.', error);
  }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNovel(null);
    setEditMode(false);
  };

  {/*
  const handleSave = async () => {
    try {
      const updatedNovel = { ...selectedNovel, title, genre: genre.split(',').map(c => c.trim()), novel: novelContent };
      await AsyncStorage.setItem(`novelData_${selectedNovel.id}`, JSON.stringify(updatedNovel));
      console.log('Saving novel and fetching novels again...');
      if (userId) {
        await fetchNovels(userId); // userId를 사용하여 소설 목록을 다시 가져옵니다.
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save the novel.', error);
    }
  };
  */}

const handleSave = async () => {
  try {
    // 업데이트된 소설 데이터 생성
    const updatedNovel = {
      title: title,
      content: novelContent
    };

    // 소설 데이터를 백엔드에 전송
    const response = await fetch(`https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/mypage/mypost/${selectedNovel.id}`, {
      method: 'PUT', // 데이터 업데이트를 위한 HTTP 메서드
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNovel), // JSON 형식으로 변환
    });

    if (response.ok) {
      console.log('Novel updated successfully');
      if (userId) {
        await fetchNovels(userId); // 업데이트 후 소설 목록 다시 가져오기
      }
      closeModal(); // 모달 닫기
    } else {
      console.error('Failed to update the novel.', await response.text()); // 에러 메시지 출력
    }
  } catch (error) {
    console.error('Failed to save the novel.', error);
  }
};

  const handleDelete = async () => {
  try {
    // Delete request to the backend with the novel ID
    const response = await fetch(`https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/mypage/mypost/${selectedNovel.id}`, {
      method: 'DELETE', // DELETE method for deleting resources
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Novel deleted successfully');
      if (userId) {
        await fetchNovels(userId); // Fetch the updated list of novels
      }
      closeModal(); // Close the modal
    } else {
      console.error('Failed to delete the novel.', await response.text());
    }
  } catch (error) {
    console.error('Failed to delete the novel.', error);
  }
};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {novels.map((novel, index) => (
          <View key={novel.id || index} style={styles.novelContainer}>
            <TouchableOpacity onPress={() => handlePress(novel)}>
              <Image source={novel.thumbnail ? { uri: novel.thumbnail } : thumbnailImage} style={styles.thumbnail} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{novel.title}</Text>
              <Text style={styles.genre} numberOfLines={1} ellipsizeMode="tail">{Array.isArray(novel.genre) ? novel.genre.join(', ') : novel.genre}</Text>

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
                <Image source={closeImage}/>
              </Pressable>
              <View style={styles.modalHeader}>
                <View style={styles.buttonContainer}>
                  <Button title="수정" onPress={() => setEditMode(true)} />
                  <Button title="삭제" onPress={() => {
                    Alert.alert(
                      "경고",
                      "소설을 정말로 삭제하시겠습니까?",
                      [
                        { text: "네", onPress: handleDelete },
                        { text: "아니오", style: "cancel" }
                      ]
                    );
                  }} color="red" />
                </View>
              </View>
              <ScrollView>
                <Image source={selectedNovel.thumbnail ? { uri: selectedNovel.thumbnail } : thumbnailImage} style={styles.modalThumbnail} />
                {editMode ? (
                  <View>
                    <TextInput
                      style={styles.input}
                      value={title}
                      onChangeText={setTitle}
                      placeholder="제목"
                    />
                    {/*
                    <TextInput
                      style={styles.input}
                      value={genre}
                      onChangeText={setGenre}
                      placeholder="장르"
                    />
                    */}
                    <Text style={styles.input}>{Array.isArray(selectedNovel.genre) ? selectedNovel.genre.join(', ') : selectedNovel.genre}</Text>
                    <TextInput
                      style={styles.input}
                      value={novelContent}
                      onChangeText={setNovelContent}
                      placeholder="소설 내용"
                      multiline
                    />
                    <Button title="저장" onPress={handleSave} />
                  </View>
                ) : (
                  <View>
                    <Text style={styles.modalTitle}>{selectedNovel.title}</Text>
                    <Text style={styles.modalGenre}>{Array.isArray(selectedNovel.genre) ? selectedNovel.genre.join(', ') : selectedNovel.genre}</Text>
                    <View style={styles.modalTextContainer}>
                      <Text style={styles.modalText}>{novelContent}</Text>
                    </View>
                  </View>
                )}
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
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  scrollContainer: {
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  novelContainer: {
    flexDirection: 'column',
    width: '25%',
    padding: 8,
    marginBottom: 5,
  },
  thumbnail: {
    width: 80,
    height: 100,
    borderRadius: 5,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    marginTop: 10,
    color: '#000000',
    fontWeight: 'bold',
  },
  genre: {
    fontSize: 16,
    color: '#000000',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  modalThumbnail: {
    width: 200,
    height: 270,
    marginTop: 15,
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
  modalTextContainer: {
    marginTop: 10,
  },
  modalText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
  },
});

export default MyNovel;