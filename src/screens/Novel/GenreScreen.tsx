import React, {useEffect} from 'react';
import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

const GenreScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {genre} = route.params;

  useEffect(() => {
    // Set header options dynamically based on the genre
    navigation.setOptions({
      title: genre, // This sets the title to the genre
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
});

export default GenreScreen;
