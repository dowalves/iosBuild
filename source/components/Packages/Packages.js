import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button,Image,ImageBackground,TouchableOpacity,I18nManager,
        ScrollView,TextInput,FlatList,Picker
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { width, height, totalSize } from 'react-native-dimension';
import RNPickerSelect from 'react-native-picker-select';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY,COLOR_SECONDARY,COLOR_YELLOW,COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import styles from '../../../styles/Packages/PackagesStyleSheet';
import { createStackNavigator } from 'react-navigation';
export default class Packages extends Component<Props> {
  constructor( props ) {
    super(props);
    this.inputRefs = {};
    this.state = {
      name: '',
      favColor: '',
      content: [{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"},{name: "Hotels"}],
      items: [
          {
              label: 'super',
              value: 'red',
          },
          {
              label: 'batter',
              value: 'orange',
          },
          {
              label: 'normal',
              value: 'blue',
          },
      ],
    }
    I18nManager.forceRTL(false);
  }
  static navigationOptions = {
    header: null,
  };
  _blog=(item,key)=>{
    return(
      <View key={key} style={styles.blogCon}>
        <View style={styles.ImgViewCon}>
          <Image source={require('../../images/food.jpg')} style={{height:height(35),width:width(80)}} />
        </View>
        <View style={{flex:1,alignItems:'center'}}>
          {
            this.state.content.map((item,key)=>{
              return(
                <View key={key} style={styles.stripCon}>
                  <Image source={require('../../images/check-box.png')} style={styles.checkImg} />
                  <Text style={styles.text}>Package Expry: 400Days</Text>
                </View>
              )
            })
          }
        </View>
        <View style={{height:height(12),justifyContent:'center',alignItems:'center'}}>
          <View style={{height:height(6),width:width(35),borderRadius:5,justifyContent:'center',alignItems:'center',backgroundColor: COLOR_ORANGE}}>
             <RNPickerSelect
                    placeholder={{
                        // label: 'Select a color...',
                        // value: null,
                    }}
                    mode = "dialog"
                    hideIcon = {false}
                    iconColor={COLOR_PRIMARY}
                    hideDoneBar = {false}
                    value={this.state.favColor}
                    items={this.state.items}
                    onValueChange={(value) => {
                        this.setState({
                            favColor: value,
                        });
                    }}
                    onUpArrow={() => {
                        this.inputRefs.name.focus();
                    }}
                    onDownArrow={() => {
                        this.inputRefs.picker2.togglePicker();
                    }}
                    // viewContainer={{height:height(6),width:width(30),backgroundColor:'red'}}
                    style={{...pickerSelectStyles}}
                    ref={(el) => {
                        this.inputRefs.picker = el;
                    }}
                />

          </View>
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          backgroundColor='#f9f9f9'
          showsVerticalScrollIndicator={false}
          >
          {
            this.state.content.map((item,key)=>{
              return(
                this._blog(item,key)
              )
            })
          }
        </ScrollView>
      </View>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: totalSize(1.8),
        paddingLeft: 15,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        color: COLOR_PRIMARY,
    },
    inputAndroid: {
      paddingLeft: 15,
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      color: COLOR_SECONDARY,
    }
});
