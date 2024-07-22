import React from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/Home/homescreenStyles';

const Home = () => {
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
              style={styles.genreItem}
              onPress={() => navigation.navigate('Genre', {genre})}>
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>눈송이님이 최근 본 작품</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RecentViewedScreen')}>
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
          {[1, 2, 3, 4].map((item, index) => (
            <TouchableOpacity key={index} style={styles.contentItem}>
              <View style={styles.contentThumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            눈송이님에게 이노블이 추천하는 작품
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RecommendedScreen')}>
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
          {[1, 2, 3, 4].map((item, index) => (
            <TouchableOpacity key={index} style={styles.contentItem}>
              <View style={styles.contentThumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Home;
