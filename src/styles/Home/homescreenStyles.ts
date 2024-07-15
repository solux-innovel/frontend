import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  banner: {
    alignItems: 'center',
    marginVertical: 12,
  },
  bannerImage: {
    width: 360,
    height: 240,
    borderRadius: 20,
  },
  section: {
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 8,
    marginBottom: 8,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    marginRight: '80%',
    marginBottom: 8,
  },
  genreScroll: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginLeft: 8,
    marginRight: 8,
  },
  genreItem: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  genreText: {
    fontSize: 14,
    color: '#000000',
  },
  contentScroll: {
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 8,
  },
  contentItem: {
    marginRight: 15,
  },
  contentThumbnail: {
    width: 100,
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 4,
  },
});

export default styles;
