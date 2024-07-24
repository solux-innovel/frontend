// src/screens/FindIDScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FindIDScreen: React.FC = () => (
  <View style={styles.container}>
    <Text>Find ID Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FindIDScreen;
