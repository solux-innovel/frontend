/**
 * @format
 */

//0723 수정함
import { AppRegistry } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator'; // 올바른 경로 확인
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppNavigator);

