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

const RecentViewedScreen = () => {
  const navigation = useNavigation(); // Navigation 훅 추가

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
            <Image source={item.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.episode}>{item.episode}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>이어보기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowRightButton}>
                <Image
                  source={require('../../img/ArrowRight.png')} // 오른쪽 화살표 이미지 경로
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
});

export default RecentViewedScreen;
