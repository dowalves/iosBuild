import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button,Image,ImageBackground,TouchableOpacity,I18nManager,
        ScrollView,TextInput,FlatList
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY,COLOR_SECONDARY,COLOR_YELLOW } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import styles from '../../../styles/Events/PublishedEventsStyleSheet';
import EventsUpperView from './EventsUpperView';
export default class ExpiredEvents extends Component<Props> {
  constructor( props ) {
    super(props);
    this.state = {
      name: '',
      data: [{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"}],
    }
    I18nManager.forceRTL(false);
  }
  static navigationOptions = {
    header: null,
  };
  ratingCompleted=(rating)=> {
    console.warn("Rating is: " + rating)
    this.setState({rate: rating})
  }
  listComp = ( item,key ) => {
    return(
      <View key={key} style={styles.featuredFLItem}>
        <View style={styles.featuredImg}>
          <Avatar
            large
            rounded
            source={require('../../images/testImg.jpg')}
            onPress={() => console.warn("Works!")}
            activeOpacity={1}
            />
        </View>
        <View style={styles.txtViewCon}>
          <View style={{height:height(14),width:width(70)}}>
            <View style={{height:height(3.5),width:width(72),alignItems:'center',flexDirection:'row'}}>
              <Text style={styles.txtViewHeading}>6th evenue Studio</Text>
              <View style={{flex:1,alignItems:'flex-end',justifyContent:'center',marginTop:5,marginRight:10}}>
                  <Menu>
                    <MenuTrigger>
                      <Image source={require('../../images/menu.png')} style={{height:height(3.5),width:width(5),marginLeft:10,resizeMode:'contain'}} />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption>
                        <View style={{flexDirection:'row',}}>
                          <Image source={require('../../images/x-button.png')} style={{height:height(2.5),width:width(4),marginHorizontal:5,resizeMode:'contain'}} />
                          <Text style={{fontSize:totalSize(1.4),marginHorizontal:5,color:'black'}}>Delete</Text>
                        </View>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
              </View>
            </View>
            <View style={{height:height(3),width:width(72),alignItems:'flex-start',flexDirection:'row'}}>
              <Text style={{fontSize:totalSize(1.5),color: COLOR_ORANGE,marginHorizontal:10,alignSelf:'center'}}>Nights Club</Text>
              <Image source={require('../../images/wall-clock.png')} style={{height:height(2),width:width(3),alignSelf:'center',marginRight:0,resizeMode:'contain'}} />
              <Text style={{width:width(12),fontSize:totalSize(1.3),borderColor:'gray',borderRightWidth:0.3,color: COLOR_GRAY,marginHorizontal:3,alignSelf:'center'}}>6:30 PM</Text>
              <Text style={{fontSize:totalSize(1.3),color: COLOR_GRAY,marginHorizontal:3,alignSelf:'center'}}>12:30 PM</Text>
            </View>
            <View style={{height:height(3.5),width:width(72),alignItems:'flex-start',flexDirection:'row'}}>
              <Image source={require('../../images/calendar-clock.png')} style={{height:height(2.5),width:width(3.7),alignSelf:'center',marginLeft:10,resizeMode:'contain'}} />
              <Text style={{width:width(21),borderRightWidth:0.3,borderColor:'gray',fontSize:totalSize(1.4),color: COLOR_GRAY,marginHorizontal:5,alignSelf:'center'}}>March 7, 2018</Text>
              <Text style={{fontSize:totalSize(1.4),color: COLOR_GRAY,marginHorizontal:5,alignSelf:'center'}}>March 7, 2018</Text>
            </View>
            <View style={{height:height(3.5),alignItems:'center',flexDirection:'row'}}>
              <Image source={require('../../images/map-placeholder.png')} style={{height:height(2.3),width:width(3),marginLeft:10,resizeMode:'contain'}} />
              <Text style={styles.subHeadingTxt}>587 imdba street,Lahore</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={{flex:1,alignItems:'center',backgroundColor:'#f9f9f9'}}>
        <ScrollView>
          <EventsUpperView />
          <View style={{height:height(5),width:width(94),marginBottom:5,alignSelf:'center',justifyContent:'flex-end'}}>
            <Text style={{fontSize:totalSize(1.6),color:COLOR_SECONDARY,fontWeight:'bold'}}> Published Events </Text>
          </View>
          <FlatList
              data={this.state.data}
              showsVerticalScrollIndicator={false}
              renderItem={({item,key}) =>
                this.listComp(item,key)
              }
              horizontal = {false}
              showsHorizontalScrollIndicator = {false}
              // keyExtractor={item => item.email}
            />
      </ScrollView>
      </View>
    );
  }
}
