import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/Home/homescreenStyles';

const Home = () => {
  const [userName, setUserName] = useState('눈송이'); // 기본값 설정
  const navigation = useNavigation();
  const genres = [
    '전체',
    '로맨스',
    '판타지',
    '로판',
    '현판',
    '무협',
    '미스터리',
    'SF',
    '라이트노벨',
    '자유장르',
  ];

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

    fetchUserName();
  }, []);

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
          {genres.map((genre, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.genreItem,
                index === genres.length - 1 && { marginRight: 16 },
              ]}
              onPress={() => navigation.navigate('Genre', { genre })}
            >
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{userName}님이 최근 본 작품</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RecentViewed')}>
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
          {[
            require('../../img/book1.png'),
            require('../../img/book2.png'),
            require('../../img/book3.png'),
            require('../../img/book4.png'),
          ].map((image, index) => (
            <TouchableOpacity key={index} style={styles.contentItem}>
              <Image source={image} style={styles.contentThumbnail} />
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
          {[
            require('../../img/book5.png'),
            require('../../img/book6.png'),
            require('../../img/book7.png'),
            require('../../img/book8.png'),
          ].map((image, index) => (
            <TouchableOpacity key={index} style={styles.contentItem}>
              <Image source={image} style={styles.contentThumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 여기에 빈 View를 추가하여 하단 여유 공간 확보 */}
      <View style={{ height: 16 }} />
    </ScrollView>
  );
};

export default Home;