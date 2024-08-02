import React, {useEffect} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import styles from '../../styles/Novel/genreScreenStyles';

const GenreScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {genre} = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: genre,
      headerTitleAlign: 'center',
      color: '#000000',
      fontSize: 18,
      fontWeight: 'bold',
    });
  }, [navigation, genre]);

  const items = Array.from({length: 12}, (_, i) => ({
    title: `제목 ${i + 1}`,
    author: `작가 이름 ${i + 1}`,
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={require('../../img/homescreenBanner.png')}
          style={styles.bannerImage}
        />
      </View>
      <View style={styles.content}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.thumbnail} />
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemAuthor}>{item.author}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default GenreScreen;
