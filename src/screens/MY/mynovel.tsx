// MyNovel.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const thumbnailImage = require('../../img/My/Thumbnail.png');

const MyNovel = () => {
  const novels=[
    { id: 1, title: '제목1', genre: '장르1' },
    { id: 2, title: '제목2', genre: '장르2' },
    { id: 3, title: '제목3', genre: '장르3' },
    { id: 4, title: '제목4', genre: '장르4' },
    { id: 5, title: '제목5', genre: '장르5' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {novels.map((novel) => (
        <View key={novel.id} style={styles.novelContainer}>
          <Image source={thumbnailImage} style={styles.thumbnail}/>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{novel.title}</Text>
            <Text style={styles.genre}>{novel.genre}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  novelContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 25,
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
  },
  genre: {
    fontSize: 16,
    color: '#000000',
  },
});

export default MyNovel;