import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchEntry {
  query: string;
  date: string;
  type: string; // 검색 유형 (예: 'user' 또는 'title')
}

const searchImage = require('../../img/searchImage.png');
const magnifierImage = require('../../img/magnifier.png');

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'user' | 'title'>('user');
  const [recentSearches, setRecentSearches] = useState<SearchEntry[]>([]);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const searches = await AsyncStorage.getItem('recentSearches');
        if (searches) {
          setRecentSearches(JSON.parse(searches));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecentSearches();
  }, []);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      return;
    }

    const date = new Date();
    const searchEntry: SearchEntry = {
      query,
      date: `${date.getMonth() + 1}.${date.getDate()}`,
      type: searchType, // 현재 검색 유형을 추가
    };

    try {
      const existingSearches = await AsyncStorage.getItem('recentSearches');
      let searches: SearchEntry[] = existingSearches
        ? JSON.parse(existingSearches)
        : [];
      searches.push(searchEntry);

      if (searches.length > 5) {
        searches = searches.slice(-5);
      }

      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
      setRecentSearches(searches);
    } catch (error) {
      console.error(error);
    }

    setSearchQuery('');
  };

  const getRecentSearchWrapperStyle = () => ({
    borderRadius: 10,
    borderWidth: recentSearches.length > 0 ? 2 : 0, // 최소 한 개 이상일 때만 테두리가 보이도록
    borderColor: '#BDB9FE',
    padding: 10,
  });

  return (
    <View style={styles.container}>
      {/* 검색 유형 선택 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, searchType === 'user' && styles.activeTab]}
          onPress={() => setSearchType('user')}>
          <Text style={searchType === 'user' ? styles.activeTabText : styles.tabText}>유저 검색</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, searchType === 'title' && styles.activeTab]}
          onPress={() => setSearchType('title')}>
          <Text style={searchType === 'title' ? styles.activeTabText : styles.tabText}>제목 검색</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity>
          <Image source={magnifierImage} style={styles.magnifierImage} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder={`소설 ${searchType === 'title' ? '제목' : '유저 이름'}을 검색해주세요`}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          onSubmitEditing={() => handleSearch(searchQuery)}
        />
      </View>

      <View style={getRecentSearchWrapperStyle()}>
        <FlatList
          data={recentSearches}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity>
              <View style={styles.recentSearchItem}>
                <Text>{item.query}</Text>
                <View style={styles.dateAndTypeWrapper}>
                  <Text style={styles.searchTypeText}>
                    {item.type === 'user' ? '유저 이름' : '제목'}
                  </Text>
                  <Text>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#BDB9FE',
  },
  activeTab: {
    borderBottomColor: '#4B3FFF',
  },
  tabText: {
    fontSize: 16,
    color: '#BDB9FE',
  },
  activeTabText: {
    color: '#4B3FFF',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BDB9FE',
    padding: 1,
  },
  magnifierImage: {
    width: 24,
    height: 24,
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingLeft: 0,
  },
  recentSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#BDB9FE',
    borderBottomWidth: 1,
  },
  dateAndTypeWrapper: {
    flexDirection: 'row', // 날짜와 검색 유형을 수평으로 배치
    alignItems: 'center',
  },
  searchTypeText: {
    color: '#BDB9FE', // 연한 회색으로 텍스트 스타일링
    marginRight: 10, // 날짜와 검색 유형 간의 간격 조정
  },
});

export default SearchScreen;
