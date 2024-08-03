import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, Text, Image, Alert } from 'react-native';
import { API_URL } from '@env';

interface SearchEntry {
  query: string;
  date: string;
  type: string; // 검색 유형 (예: 'user' 또는 'title')
}

const magnifierImage = require('../../img/magnifier.png');

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'user' | 'title'>('user');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearchLogs, setRecentSearchLogs] = useState<SearchEntry[]>([]); // 최근 검색 로그 상태 추가

  useEffect(() => {
    const fetchRecentSearchLogs = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert('Error', 'User ID not found');
          return;
        }

        const response = await fetch(`${API_URL}/innovel/search?id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response && response.ok) {
          const data = await response.json();
          setRecentSearchLogs(data); // 최근 검색 로그 상태에 저장
        } else {
          throw new Error('Failed to fetch recent search logs');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecentSearchLogs(); // 컴포넌트 마운트 시 최근 검색 로그 조회
  }, []);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      let response;
      if (searchType === 'title') {
        // 게시물 검색 API 호출
        response = await fetch(`${API_URL}/innovel/search/posts?id=${userId}&title=${query}&page=0`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (searchType === 'user') {
        // 사용자 검색 API 호출
        response = await fetch(`${API_URL}/innovel/search/users?username=${query}&page=0`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (response && response.ok) { // response가 정의되어 있고, 응답이 성공적일 때만 처리
        const data = await response.json();
        setSearchResults(data.content); // 검색 결과를 상태에 저장
      } else {
        throw new Error('Failed to fetch search results');
      }
    } catch (error) {
      console.error(error);
    }

    setSearchQuery('');
  };

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
          placeholder={`${searchType === 'title' ? '소설 제목' : '유저 이름'}을 검색해주세요`}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          onSubmitEditing={() => handleSearch(searchQuery)}
        />
      </View>

      {/* 최근 검색 로그 표시 부분 */}
      {recentSearchLogs.length > 0 && (
        <FlatList
          data={recentSearchLogs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.searchResultItem}>
              <Text style={styles.resultTitle}>{item.query}</Text>
              <Text>{item.date}</Text>
              <Text>{item.type}</Text>
            </View>
          )}
        />
      )}

      {/* 검색 결과를 보여주는 부분 */}
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.searchResultItem}>
              {searchType === 'title' ? (
                <>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text>{item.content}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.resultUsername}>{item.username}</Text>
                  <Text>{item.email}</Text>
                </>
              )}
            </View>
          )}
        />
      )}
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
  searchResultItem: {
    paddingVertical: 10,
    borderBottomColor: '#BDB9FE',
    borderBottomWidth: 1,
  },
  resultTitle: {
    fontWeight: 'bold',
  },
  resultUsername: {
    fontWeight: 'bold',
  },
});

export default SearchScreen;
