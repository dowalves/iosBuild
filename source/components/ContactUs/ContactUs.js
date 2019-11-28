import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button,Image,ImageBackground,TouchableOpacity,I18nManager,
        ScrollView,TextInput,FlatList
} from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY,COLOR_SECONDARY,COLOR_YELLOW,COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import styles from '../../../styles/ContactUs';
const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
const fieldCOLOR = 'rgba(211,211,211,0.3)';
export default class ContactUs extends Component<Props> {
  constructor( props ) {
    super(props);
    this.state = {
      name: '',
    }
    // I18nManager.forceRTL(false);
  }
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../images/bk_ground.jpg')} style={{flex:1,alignSelf:'stretch'}}>
          <ScrollView>
            <View style={{height:height(96),backgroundColor: COLOR_TRANSPARENT_BLACK,justifyContent:'center',alignItems:'center'}}>
              <View style={{height:height(40),width:width(95)}}>
                <View style={styles.logoView}>
                  <Image source={require('../../images/mainscr_logo.png')} style={styles.logoImg}/>
                  <Text style={styles.logoTxt}>Find and Explore World top Places</Text>
                </View>
              </View>
              <View style={{height:height(50),width:width(95)}}>
                <View style={{height:height(5),width:width(23),borderBottomWidth:1,borderColor:COLOR_ORANGE,marginVertical:5,justifyContent:'center'}}>
                  <Text style={{fontSize:totalSize(titles),fontWeight:'bold',color:COLOR_PRIMARY}}>Get In Touch:</Text>
                </View>
                <View style={{height:height(6),marginVertical:5,flexDirection:'row',alignItems:'center'}}>
                  <TextInput
                     onChangeText={(value) => this.setState({email: value})}
                     underlineColorAndroid='transparent'
                     // placeholder='أدخل كلمة المرور'
                     placeholder='Name'
                     placeholderTextColor='white'
                     underlineColorAndroid='transparent'
                     autoCorrect={false}
                     style={{height:height(6),width:width(45),marginRight:10,backgroundColor:'rgba(211,211,211,0.3)',paddingLeft:10,color:COLOR_PRIMARY,fontSize:totalSize(subHeadingTxt),borderColor:'gray',borderWidth:1,borderRadius:3}}
                     />
                     <TextInput
                        onChangeText={(value) => this.setState({email: value})}
                        underlineColorAndroid='transparent'
                        // placeholder='أدخل كلمة المرور'
                        placeholder='Email Address'
                        placeholderTextColor='white'
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        style={{height:height(6),width:width(45),marginLeft:10,backgroundColor:'rgba(211,211,211,0.3)',paddingLeft:10,color:COLOR_PRIMARY,fontSize:totalSize(subHeadingTxt),borderColor:'gray',borderWidth:1,borderRadius:3}}
                        />
                </View>
                <View style={{height:height(6),marginVertical:5,flexDirection:'row',alignItems:'center'}}>
                  <TextInput
                     onChangeText={(value) => this.setState({email: value})}
                     underlineColorAndroid='transparent'
                     // placeholder='أدخل كلمة المرور'
                     placeholder='Phone Number'
                     placeholderTextColor='white'
                     underlineColorAndroid='transparent'
                     autoCorrect={false}
                     style={{height:height(6),width:width(45),marginRight:10,backgroundColor:'rgba(211,211,211,0.3)',paddingLeft:10,color:COLOR_PRIMARY,fontSize:totalSize(subHeadingTxt),borderColor:'gray',borderWidth:1,borderRadius:3}}
                     />
                     <TextInput
                        onChangeText={(value) => this.setState({email: value})}
                        underlineColorAndroid='transparent'
                        // placeholder='أدخل كلمة المرور'
                        placeholder='Subject'
                        placeholderTextColor='white'
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        style={{height:height(6),width:width(45),marginLeft:10,backgroundColor:'rgba(211,211,211,0.3)',paddingLeft:10,color:COLOR_PRIMARY,fontSize:totalSize(subHeadingTxt),borderColor:'gray',borderWidth:1,borderRadius:3}}
                        />
                </View>
                <View style={{height:height(12),marginVertical:5,flexDirection:'row',alignItems:'center'}}>
                  <TextInput
                     onChangeText={(value) => this.setState({email: value})}
                     underlineColorAndroid='transparent'
                     // placeholder='أدخل كلمة المرور'
                     placeholder='Message'
                     placeholderTextColor='white'
                     underlineColorAndroid='transparent'
                     autoCorrect={false}
                     style={{alignSelf:'stretch',width:width(95),marginRight:10,backgroundColor:'rgba(211,211,211,0.3)',paddingLeft:10,color:COLOR_PRIMARY,fontSize:totalSize(subHeadingTxt),borderColor:'gray',borderWidth:1,borderRadius:3}}
                     />
                </View>
                <View style={{height:height(6),marginVertical:5,backgroundColor:COLOR_ORANGE,borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:totalSize(1.4),fontFamily:FONT_BOLD,color:COLOR_PRIMARY}}>Send Message</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}
