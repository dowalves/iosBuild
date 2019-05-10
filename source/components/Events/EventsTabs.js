import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Button, Image, ImageBackground, TouchableOpacity, I18nManager,
  ScrollView, TextInput, FlatList
} from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { FONT_NORMAL, FONT_BOLD, COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW } from '../../../styles/common';
import { createStackNavigator, createBottomTabNavigator, TabNavigator, DrawerActions } from 'react-navigation';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import styles from '../../../styles/UserDashboardStyles/DashboardStyleSheet';
import CreateEvent from './CreateEvent';
import PublishedEvents from './PublishedEvents';
import PendingEvents from './PendingEvents';
import ExpiredEvents from './ExpiredEvents';
import EventDetail from './EventDetail';
class EventsTabs extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    }
    I18nManager.forceRTL(false);
  }
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <Tab />
    );
  }
}

const Tab = TabNavigator({
  CreateEvent: {
    screen: CreateEvent,
    navigationOptions: {
      title: "Create Event",
    }
  },
  PublishedEvents: {
    screen: PublishedEvents,
    navigationOptions: {
      title: "Published Events",
    }
  },
  PendingEvents: {
    screen: PendingEvents,
    navigationOptions: {
      title: "Pending Events",
    }
  },
  ExpiredEvents: {
    screen: ExpiredEvents,
    navigationOptions: {
      title: "Expired Events",
    }
  },
},
  {
    order: ['CreateEvent', 'PublishedEvents', 'PendingEvents', 'ExpiredEvents'],
    initialRouteName: 'CreateEvent',
    tabBarPosition: 'bottom',
    removeClippedSubviews: true,
    animationEnabled: true,
    swipeEnabled: true,
    showIcon: false,
    animationEnabled: true,
    lazy: true,
    backBehavior: true,
    tabBarOptions: {
      activeTintColor: COLOR_SECONDARY,
      inactiveTintColor: COLOR_GRAY,
      allowFontScaling: true,
      scrollEnabled: true,
      showIcon: false,
      upperCaseLabel: false,
      pressColor: COLOR_ORANGE,
      labelStyle: {
        // fontFamily: FONT_BOLD,
        fontSize: totalSize(1.6),
        // textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        // padding:0
      },
      tabStyle: {
        // height:height(6),
        // width:width(35)
        // justifyContent: 'center',
        // alignItems: 'center',
      },
      style: {
        // height:height(6),
        // justifyContent:'center',
        backgroundColor: COLOR_PRIMARY,
      },
      indicatorStyle: {
        borderColor: COLOR_ORANGE,
        borderWidth: 2,
      },
    },
  }
);
export default Tab;
