import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button,Image,ImageBackground,TouchableOpacity,I18nManager,
        ScrollView,TextInput,FlatList
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { width, height, totalSize } from 'react-native-dimension';
import { Avatar } from 'react-native-elements';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import styles from '../../../styles/UserDashboardStyles/UpperViewStyleSheet';
export default class EventsUpperView extends Component<Props> {
  constructor( props ) {
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
        <ImageBackground source={require('../../images/bk_ground.jpg')} style={styles.bgImg}>
          <View style={styles.imgConView}>
            <View style={styles.subCon}>
                <View style={{flex:2.5,justifyContent:'center'}}>
                  <Avatar
                    large
                    rounded
                    source={require('../../images/testImg.jpg')}
                    onPress={() => console.warn("Works!")}
                    activeOpacity={1}
                    />
                </View>
                <View style={{flex:1,justifyContent:'flex-end'}}>
                  <Text style={styles.nameTxt}>usama</Text>
                </View>
                <View style={{flex:1,justifyContent:'flex-start'}}>
                  <Text style={styles.addressTxt}>Lahore, Pakistan</Text>
                </View>
                <View style={styles.listCon}>
                  <View style={styles.listTab}>
                    <Text style={styles.number}>138</Text>
                    <Text style={styles.listLabel}>Total Listing</Text>
                  </View>
                  <View style={{height:height(6),justifyContent:'center',alignItems:'center'}}>
                    <Text style={styles.number}>293</Text>
                    <Text style={styles.listLabel}>Expired</Text>
                  </View>
                </View>
            </View>
          </View>
      </ImageBackground>
    );
  }
}
