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
      loadMore: false,
      reCaller: false,
      loading: false
    }
  }
  static navigationOptions = {
    header: null,
  };
  loadMore = async (listType, pageNo) => {
    this.setState({ loadMore: true })
    let params = {
      event_type: listType,
      next_page: pageNo
    }
    let data = store.MY_EVENTS.data.my_events.expired_events;
    let response = await ApiController.post('load-my-events', params);
    // console.log('Tabs loadMore=====>>>', response);
    if (response.has_events && data.expired_pagination.has_next_page) {
      // forEach Loop LoadMore results
      response.events.forEach((item) => {
        data.events.push(item);
      })
      data.expired_pagination = response.expired_pagination;
      // console.log('after Loop=======>>>',data.commnets);        
      await this.setState({ loadMore: false })
    } else {
      await this.setState({ loadMore: false })
      // Toast.show(response.data.no_more)
    }
    await this.setState({ reCaller: false })
  }
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  render() {
    let data = store.MY_EVENTS.data.my_events;
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.reCaller === false) {
                this.loadMore(data.expired_events.event_type, data.expired_events.expired_pagination.next_page);
              }
              this.setState({ reCaller: true })
            }
          }}
          scrollEventThrottle={400}>
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
          {
            data.expired_events.expired_pagination.has_next_page ?
              <View style={{ height: height(7), width: width(100), justifyContent: 'center', alignItems: 'center' }}>
                {
                  this.state.loadMore ?
                    <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                    : null
                }
              </View>
              :
              null
          }
        </ScrollView>
      </View>
    );
  }
}