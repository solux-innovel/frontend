// MyNovel.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const thumbnailImage = require('../../img/My/Thumbnail.png');

const MyNovel = () => {
  const [novels, setNovels] = useState([]);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const novelKeys = keys.filter(key => key.startsWith('novelData_'));

        const novelData = await Promise.all(novelKeys.map(async (key) => {
          const data = await AsyncStorage.getItem(key);
          return JSON.parse(data);
        }));

        setNovels(novelData);
      } catch (error) {
        console.error('Failed to load novels.', error);
      }
    };

    fetchNovels();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {novels.map((novel, index) => (
          <View key={novel.id || index} style={styles.novelContainer}>
            <Image source={novel.thumbnail ? { uri: novel.thumbnail } : thumbnailImage} style={styles.thumbnail}/>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{novel.topic}</Text>
              <Text style={styles.genre} numberOfLines={1} ellipsizeMode='tail'>{novel.concept}</Text>
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
    alignItems: 'center',
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
});

export default MyNovel;