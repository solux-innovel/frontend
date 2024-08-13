import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, Pressable} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
//import { API_URL } from '@env';

const defaultThumbnail = require('../../img/My/Thumbnail.png');

const GenreScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { genre, isAll } = route.params;
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [allPosts, setAllPosts] = useState([]); // 상태 변수 추가
  const [genrePosts, setGenrePosts] = useState([]); // 상태 변수 추가

  useEffect(() => {
    // Set header options dynamically based on the genre
    const headerTitle = isAll ? 'ALL' : genre;

    navigation.setOptions({
      //title: genre, // This sets the title to the genre
      title: headerTitle, // This sets the title to the genre or "ALL"
      headerTitleAlign: 'center',
      headerTintColor: '#000000', // Text color
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      headerStyle: {
        backgroundColor: '#FFFFFF', // White background
        elevation: 0, // Remove shadow on Android
        shadowOpacity: 0, // Remove shadow on iOS
        borderBottomWidth: 0, // Remove bottom border
        borderBottomColor: 'transparent', // Ensure bottom border color is transparent
      },
    });

        const fetchPosts = async () => {
            try {
                const data = await fetchAllPosts(page);
                setAllPosts(data.content);
            } catch (error) {
                console.error('Error fetching posts:', error.message);
            }
        };

    fetchPosts();
  }, [navigation, genre, isAll, page]);

  const fetchAllPosts = async () => {
    try {
      const response = await fetch(`https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/posts/all/list/${page}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch all posts:', response.statusText);
        console.error('Error Response Text:', errorText);
        throw new Error('Failed to fetch all posts from backend');
      }

      const responseText = await response.text();
      console.log('Raw response for all posts:', responseText);

      try {
        return JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError.message);
        throw new Error('Invalid JSON format');
      }
    } catch (error) {
      console.error('Error fetching all posts from backend:', error.message);
      return { content: [] };
    }
  };

    useEffect(() => {
        if (isAll) {
            setGenrePosts(allPosts);
        } else {
            const filteredPosts = allPosts.filter(post => post.genre === genre);
            setGenrePosts(filteredPosts);
        }
    }, [allPosts, genre, isAll]);

  const openModal = (novel) => {
    setSelectedNovel(novel);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNovel(null);
  };


  // Determine which posts to display based on isAll
  const postsToDisplay = isAll ? allPosts : genrePosts;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={require('../../img/homescreenBanner.png')}
          style={styles.bannerImage}
        />
      </View>
      <View style={styles.content}>
        {postsToDisplay.length > 0 ? (
          postsToDisplay.map((post, index) => (
            <TouchableOpacity key={index} style={styles.item} onPress={() => openModal(post)}>
              <Image
                source={post.thumbnail ? { uri: post.thumbnail } : defaultThumbnail}
                style={styles.thumbnail}
              />
              <Text style={styles.itemTitle}>{post.title}</Text>
              <Text style={styles.itemGenre}>{post.genre}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Loading</Text> // 표시할 내용이 없을 때
      )}
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  banner: {
    width: '100%',
    height: 240,
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%', // Use '100%' to fill the width of the parent
    height: 230,
    resizeMode: 'cover',
    borderRadius: 0,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  item: {
    width: '23%', // Adjust width to fit 4 items per row with some spacing
    marginBottom: 16,
    alignItems: 'center',
  },
  thumbnail: {
    width: 88,
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  itemAuthor: {
    fontSize: 14,
    color: '#555',
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

export default GenreScreen;
