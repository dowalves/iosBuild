import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Button, Image, ImageBackground, TouchableOpacity, I18nManager,
  ScrollView, TextInput, FlatList
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW } from '../../../styles/common';
import MyEventComp from './MyEventComp';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Events/PublishedEventsStyleSheet';
import EventsUpperView from './EventsUpperView';
export default class PublishedEvents extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    }
  }
  static navigationOptions = {
    header: null,
  };

  render() {
    let data = store.MY_EVENTS.data.my_events;
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <ScrollView>
          <EventsUpperView />
          {
            data.expired_events.has_events ?
              data.expired_events.events.map((item, key) => {
                return (
                  <MyEventComp item={item} key={key} />
                );
              })
              :
              <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.expired_events.message}</Text>
              </View>
          }
        </ScrollView>
      </View>
    );
  }
}