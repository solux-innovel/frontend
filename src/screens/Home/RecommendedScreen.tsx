import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const RecommendedScreen = () => {
  const navigation = useNavigation();

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
            <Image source={item.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.episode}>{item.episode}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>감상하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowRightButton}>
                <Image
                  source={require('../../img/ArrowRight.png')}
                  style={styles.arrowRightIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
});

export default RecommendedScreen;
