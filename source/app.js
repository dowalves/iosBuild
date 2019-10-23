import React, {Component} from 'react';
import {Platform,SafeAreaView,StatusBar,BackHandler,Alert} from 'react-native';
import Route from './MainRoute/Route';
import store from './Stores/orderStore';
import { MenuProvider } from 'react-native-popup-menu';

export default class AppMain extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
        color: 'black',
        loading: false
    };
  }
  fucn  () {
    var timerId = setInterval(()=>{ 
      if (store.statusbar_color !== null) {
           // this.setState({ loading: false })
            clearInterval(timerId);
      } else {
        console.warn('app.js')
      }
     }, 5000);
  }
  componentDidMount(){
    setTimeout(()=>{ this.setState({ color: store.statusbar_color }) },9000)
  }
  render() {
    return (
      <SafeAreaView style={{ flex:1,backgroundColor: this.state.color }}>
        <Route />
      </SafeAreaView>
    );
  }
}
