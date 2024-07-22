import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  banner: {
    width: '100%',
    height: 240,
    alignItems: 'center',
  },
  bannerImage: {
    width: 360,
    height: 240,
    resizeMode: 'cover',
    alignItems: 'center',
    borderRadius: 10,
  },
  content: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: 80,
    height: 100,
    marginBottom: 50,
  },
  thumbnail: {
    width: 80,
    height: 100,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 12,
    color: '#000000',
    marginLeft: 4,
  },
  itemAuthor: {
    fontSize: 10,
    color: '#000000',
    marginLeft: 4,
  },
});
