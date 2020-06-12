/** @format */
import 'react-native-gesture-handler'

import {AppRegistry} from 'react-native';

import App from './App';
import {name as appName} from './app.json';
import bgMessaging from './bgMessaging';
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); 
