// src/screens/Create/create_7.tsx

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Create_7 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create_7</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // 배경색, 필요에 따라 변경
  },
  text: {
    fontSize: 18,
    color: '#000000', // 텍스트 색상, 필요에 따라 변경
  },
});

export default Create_7;