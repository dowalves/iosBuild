import React, { Component } from 'react';
import { Platform, SafeAreaView, StatusBar, View, BackHandler, Alert } from 'react-native';
import Route from './MainRoute/Route';
import Route2 from './MainRoute/Route02';
import Route3 from './MainRoute/Route03';
import store from './Stores/orderStore';
import { MenuProvider } from 'react-native-popup-menu';
import Storage from '../source/LocalDB/storage'
// import LocalDB from '../source/LocalDB/LocalDB'
export default class AppMain extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      color: 'black',
      loading: false,
      move: false,
      current: 0
    };
  }
  fucn() {
    var timerId = setInterval(() => {
      if (store.statusbar_color !== null) {
        // this.setState({ loading: false })
        clearInterval(timerId);
      } else {
        console.log('app.js')
      }
    }, 5000);
  }
  async componentDidMount() {
    setTimeout(() => { this.setState({ color: store.statusbar_color }) }, 9000)
    Storage.getItem('homepage').then((res) => {
      if (res != null) {
        this.setState({ move: true, current: res })
        console.log('resxxx', res)
      }
    })
  }



  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: this.state.color }}>
        {
          this.state.move ? [
            this.state.current == 1 ? [
              <Route />

            ] : [
                this.state.current == 2 ? [
                  <Route2 />

                ] : [
                    this.state.current == 3 ?
                      [
                        <Route3 />
                      ] : [

                      ]

                  ]
              ]
          ] : [
              <View />
            ]
        }
      </SafeAreaView>
    );
  }
}
