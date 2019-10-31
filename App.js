import React, {Component} from 'react';
import {Platform,StatusBar,I18nManager,BackHandler,Alert,Text} from 'react-native';
import AppMain from './source/app';
import { MenuProvider } from 'react-native-popup-menu';
import store from './source/Stores/orderStore';
import Store from './source/Stores';
console.disableYellowBox=true
import ApiController from './source/ApiController/ApiController';
import { nav_header_color } from './styles/common';
import LocalDB from '../DownTown/source/LocalDB/LocalDB'
import Storage from '../DownTown/source/LocalDB/storage'

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
        color: 'black',
        loading: false
    };
    I18nManager.forceRTL(false);
  }
  fucn  () {
    var timerId = setInterval(()=>{ 
      if (store.statusbar_color !== null) {
           // this.setState({ loading: false })
            clearInterval(timerId);
      } else {
        console.log('app.js')
      }
     }, 5000);
  }
  async componentDidMount(){
    setTimeout(()=>{ this.setState({ color: store.statusbar_color }) },9000)
    // await LocalDB.saveHomepage(1);
    Storage.getItem('homepage').then((value)=>{
      // if(value==null){
        Storage.setItem('homepage',4)
      // }
    })
  }
  render() {
    return (
      <MenuProvider>
        <StatusBar
          hidden = {false}
          animated = {true}
          backgroundColor= { this.state.color }
          barStyle="light-content"
          networkActivityIndicatorVisible = {Platform.OS === 'ios'? false:false}
          showHideTransition = {Platform.OS === 'ios'? 'slide':null}
        />
        <AppMain />
      </MenuProvider>
    );
  }
}
