import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 최근 검색어 항목의 타입 정의
interface SearchEntry {
  query: string;
  date: string;
}

// 이미지 파일 경로 설정
const searchImage = require('../../img/searchImage.png');
const magnifierImage = require('../../img/magnifier.png');

const SearchScreen = () => {
  // 상태 변수 정의
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<SearchEntry[]>([]);

  // 컴포넌트가 처음 렌더링될 때 최근 검색어 목록을 불러오기
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

  // 검색어를 입력하고 검색 버튼을 눌렀을 때 호출되는 함수
  const handleSearch = async (query: string) => {
    if (query.trim() === '') return;

    const date = new Date();
    const searchEntry: SearchEntry = {
      query,
      date: `${date.getMonth() + 1}.${date.getDate()}`, // 월/일 형식으로 날짜 저장
    };

    try {
      // AsyncStorage에서 최근 검색어 목록을 가져와서 파싱
      const existingSearches = await AsyncStorage.getItem('recentSearches');
      let searches: SearchEntry[] = existingSearches ? JSON.parse(existingSearches) : [];

      // 새로운 검색어 추가
      searches.push(searchEntry);

      // 최근 검색어 목록이 5개를 넘으면 첫 번째 항목을 제거
      if (searches.length > 5) {
        searches = searches.slice(-5);
      }

      // AsyncStorage에 최근 검색어 목록 저장
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));

      // 상태 업데이트
      setRecentSearches(searches);
    } catch (error) {
      console.error(error);
    }

    // 검색어 입력창 초기화
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      {/* 검색창 UI */}
      <View style={styles.searchContainer}>
        {/* 돋보기 이미지 */}
        <TouchableOpacity>
          <Image source={magnifierImage} style={styles.magnifierImage} />
        </TouchableOpacity>

        {/* 텍스트 인풋 */}
        <TextInput
          style={styles.searchInput}
          placeholder="소설 제목, 작가, 장르를 검색해주세요"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          onSubmitEditing={() => handleSearch(searchQuery)}
        />
      </View>

      {/* 최근 검색어 목록 */}
      <View style={styles.recentSearchWrapper}>
        <FlatList
          data={recentSearches}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.recentSearchItem}>
                <Text>{item.query}</Text>
                <Text>{item.date}</Text>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10, // 모서리를 둥글게 설정
    borderWidth: 1.5, // 테두리 두께를 1.5배로 설정
    borderColor: '#BDB9FE', // 테두리 색상 설정
    padding: 1, // 내부 여백
  },
  magnifierImage: {
    width: 24, // 돋보기 이미지의 너비
    height: 24, // 돋보기 이미지의 높이
    marginLeft: 10, // 돋보기 이미지의 왼쪽 여백
    marginRight: 10, // 돋보기 이미지와 텍스트 인풋 사이의 간격
  },
  searchInput: {
    flex: 1, // 검색 인풋이 나머지 공간을 모두 차지하도록 설정
    height: 40,
    borderColor: 'transparent', // 검색창 배경 이미지를 사용하므로 테두리를 투명하게 설정
    borderWidth: 1,
    paddingHorizontal: 10, // 좌우 여백
    paddingLeft: 0, // 돋보기 이미지와 겹치지 않도록 왼쪽 여백 제거
  },
  recentSearchWrapper: {
    borderRadius: 10, // 모서리를 둥글게 설정
    borderWidth: 1.5, // 테두리 두께를 1.5배로 설정
    borderColor: '#BDB9FE', // 테두리 색상 설정
    padding: 10, // 내부 여백 설정
  },
  recentSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10, // 위아래 여백
    borderBottomColor: '#BDB9FE',
    borderBottomWidth: 1,
  },
});

export default SearchScreen;

