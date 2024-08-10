//search screen.tsx
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, Text, Image, Alert } from 'react-native';

const magnifierImage = require('../../img/magnifier.png');

// 이메일을 부분적으로 숨기는 함수
const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email; // 이메일 형식이 잘못된 경우 원본 이메일 반환

  // localPart의 길이에 따라 처리
  const visibleLength = 3;
  if (localPart.length <= visibleLength) return email; // 길이가 3 이하인 경우 원본 이메일 반환

  // 이메일 앞부분을 3글자만 남기고 나머지는 *로 대체
  const maskedLocalPart = `${localPart.slice(0, visibleLength)}${'*'.repeat(localPart.length - visibleLength)}`;
  return `${maskedLocalPart}@${domain}`;
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'user' | 'title'>('user');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') return;

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      const url = searchType === 'title'
        ? `https://7d32-2406-5900-10e6-8026-ecdd-f031-868d-fc14.ngrok-free.app/innovel/search/posts?id=${userId}&title=${query}&page=0`
        : `https://7d32-2406-5900-10e6-8026-ecdd-fc14.ngrok-free.app/innovel/search/users?username=${query}&page=0`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response && response.ok) {
        const data = await response.json();
        setSearchResults(data.content || []);

        // 검색 결과가 없으면 Alert 표시
        if (data.content.length === 0) {
          Alert.alert('검색 결과', '검색 결과가 없습니다');
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to fetch search results: ${errorText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      if (errorMessage.includes('JSON Parse error')) {
        Alert.alert('검색 결과', '검색 결과가 없습니다');
      } else {
        Alert.alert('Error', `Failed to fetch search results: ${errorMessage}`);
      }
      console.error('Search error:', error);
    }

    setSearchQuery('');
  };

  const handleTabChange = (type: 'user' | 'title') => {
    setSearchType(type);
    setSearchResults([]); // 탭 변경 시 검색 결과를 초기화
    setSearchQuery(''); // 검색 쿼리도 초기화
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, searchType === 'user' && styles.activeTab]}
          onPress={() => handleTabChange('user')}>
          <Text style={searchType === 'user' ? styles.activeTabText : styles.tabText}>유저 검색</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, searchType === 'title' && styles.activeTab]}
          onPress={() => handleTabChange('title')}>
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
                  <Text>{maskEmail(item.email)}</Text>
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
