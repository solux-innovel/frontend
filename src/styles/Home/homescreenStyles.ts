import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  section: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  genreScroll: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  genreItem: {
    backgroundColor: '#9B9AFF',
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 65,
  },
  genreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  contentScroll: {
    paddingLeft: 16,
  },
  contentItem: {
    width: 100,
    height: 150,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 12,
  },
  contentThumbnail: {
    width: '100%',
    height: '80%',
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    marginRight: '50%',
  },
});
