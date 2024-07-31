// MyNovel.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Pressable, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const thumbnailImage = require('../../img/My/Thumbnail.png');
const closeImage = require('../../img/Create/CloseSquare.png');

const MyNovel = () => {
  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [concept, setConcept] = useState('');
  const [novelContent, setNovelContent] = useState('');

  useEffect(() => {
    fetchNovels(); // 처음 로딩 시 소설 목록을 가져옵니다.
  }, []);

  const fetchNovels = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const novelKeys = keys.filter(key => key.startsWith('novelData_'));

      const novelData = await Promise.all(novelKeys.map(async (key) => {
      const data = await AsyncStorage.getItem(key);
      const parsedData = JSON.parse(data);

      // concept 값이 JSON 문자열일 경우 배열로 변환
      if (typeof parsedData.concept === 'string') {
        try {
          parsedData.concept = JSON.parse(parsedData.concept);
        } catch (error) {
          // JSON 파싱 실패 시 문자열 그대로 사용
          parsedData.concept = parsedData.concept;
        }
      }

      return parsedData;
      }));

      setNovels(novelData);
      console.log('Fetched novels:', novelData);  // 상태 로그
    } catch (error) {
      console.error('Failed to load novels.', error);
    }
  };


  const handlePress = (novel) => {
    setSelectedNovel(novel);
    setTitle(novel.title);
    //setConcept(novel.concept);
    // 배열을 문자열로 변환하여 설정
    setConcept(Array.isArray(novel.concept) ? novel.concept.join(', ') : novel.concept || '');
    setNovelContent(novel.novel);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNovel(null);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      const updatedNovel = { ...selectedNovel, title, concept: concept.split(',').map(c => c.trim()), novel: novelContent };
      await AsyncStorage.setItem(`novelData_${selectedNovel.id}`, JSON.stringify(updatedNovel));
      console.log('Saving novel and fetching novels again...');
      await fetchNovels();
      closeModal();
    } catch (error) {
      console.error('Failed to save the novel.', error);
    }
  };

  const handleDelete = async () => {
    try {
    const novelKey = `novelData_${selectedNovel.id}`;
    await AsyncStorage.removeItem(novelKey);

    // 삭제 후 확인
    const itemAfterDeletion = await AsyncStorage.getItem(novelKey);
    if (itemAfterDeletion === null) {
      console.log(`Novel with key ${novelKey} successfully deleted.`);
    } else {
      console.error(`Failed to delete novel with key ${novelKey}. Item still exists:`, itemAfterDeletion);
    }

    // 소설 목록을 다시 가져와서 상태를 업데이트합니다.
    console.log('Deleting novel and fetching novels again...');
    await fetchNovels();
    closeModal();
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
              <Image source={novel.thumbnail ? { uri: novel.thumbnail } : thumbnailImage} style={styles.thumbnail}/>
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{novel.title}</Text>
              <Text style={styles.genre} numberOfLines={1} ellipsizeMode='tail'>{Array.isArray(novel.concept) ? novel.concept.join(', ') : novel.concept}</Text>
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
                    <TextInput
                      style={styles.input}
                      value={concept}
                      onChangeText={setConcept}
                      placeholder="컨셉"
                    />
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
                    <Text style={styles.modalGenre}>{Array.isArray(selectedNovel.concept) ? selectedNovel.concept.join(', ') : selectedNovel.concept}</Text>
                    <View style={styles.modalTextContainer}>
                      <Text style={styles.modalText}>{selectedNovel.novel}</Text>
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