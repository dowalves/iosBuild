import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button,Image,ImageBackground,TouchableOpacity,I18nManager,
        ScrollView,TextInput,FlatList
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { width, height, totalSize } from 'react-native-dimension';
// import Grading from 'react-native-grading';
import RNPickerSelect from 'react-native-picker-select';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY,COLOR_SECONDARY,COLOR_YELLOW,COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import styles from '../../../styles/SavedListing/SavedListingStyleSheet';
const SECTIONS = [
  {
    title: 'Prodeuct Description',
    content: 'heloo ahaohd ashdoh ashdoih aosihdo nasoihdasod hasoido ashdoihoas dhasod asdjo ashdoh ashdoh ashldo ashdoih asdohasd oasdho hsd asndo ahsdo ashd aosdih sdoi ashdi hdao dahods ashdo daoshdo oasdo nosnd noasdo oosdk nasond',
  },
  {
    title: 'Feature',
    content: 'heloo ahaohd ashdoh ashdoih aosihdo nasoihdasod hasoido ashdoihoas dhasod asdjo ashdoh ashdoh ashldo ashdoih asdohasd oasdho hsd asndo ahsdo ashd aosdih sdoi ashdi hdao dahods ashdo daoshdo oasdo nosnd noasdo oosdk nasond'
  },
  {
    title: 'Feature',
    content: 'heloo ahaohd ashdoh ashdoih aosihdo nasoihdasod hasoido ashdoihoas dhasod asdjo ashdoh ashdoh ashldo ashdoih asdohasd oasdho hsd asndo ahsdo ashd aosdih sdoi ashdi hdao dahods ashdo daoshdo oasdo nosnd noasdo oosdk nasond'
  },
];
export default class SavedListing extends Component<Props> {
  constructor( props ) {
    super(props);
    this.inputRefs = {};
    this.state = {
      name: '',
      items: [
          {
              label: 'Red',
              value: 'red',
          },
          {
              label: 'Orange',
              value: 'orange',
          },
          {
              label: 'Blue',
              value: 'blue',
          },
      ],
    }
    I18nManager.forceRTL(false);
  }
  static navigationOptions = {
    header: null,
  };
  _renderHeader(section,content,isActive) {
    return (
      <Animatable.View
        duration={500}
        transition="backgroundColor"
        transition="source"
        transition="style"
        style={{height:height(6),marginHorizontal:15,marginVertical:5,borderRadius:3,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor: (isActive ? COLOR_ORANGE : 'rgba(128,128,128,0.2)')}}>
        <Text style={styles.AccordionTitle}>{section.title}</Text>
        <Image source={(isActive ? require('../../images/dropDown.png') : require('../../images/next.png'))} style={{height:height(2),width:width(4),resizeMode:'contain'}} />
      </Animatable.View>
    );
  }
  _renderContent(section,content,isActive) {
    return (
      <Animatable.View
        duration={500}
        transition="backgroundColor"
        style={{ elevation:10,alignItems:'center',borderRadius:3,marginHorizontal:15,marginVertical:10,backgroundColor: (isActive ? 'white' : 'white' ) }}>
        <Animatable.Text
          duration={500}
          easing="ease-out"
          animation={isActive ? 'zoomIn' : 'zoomOut'}
          align='center'
          style={styles.AccordionParagraph}
          >
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.containerImg}>
            <Image source={require('../../images/food.jpg')} style={{resizeMode:'contain'}} />
          </View>
          <View style={styles.cardContainer}>
            <View style={{height:height(8),justifyContent:'center',marginHorizontal:10}}>
              <View style={styles.priceCon}>
                <Text style={styles.blackText}>$200</Text>
                <Text style={styles.goldenText}>$1500</Text>
              </View>
              <View style={styles.ratingCon}>
                <View>
                  {/* <Grading
                    mode="stars"
                    scale={1.2}
                    score={4}
                    scoreBase={5}
                    activeColor= {COLOR_ORANGE}
                    defaultColor= {COLOR_GRAY}
                    /> */}
                </View>
                <Text style={styles.ratingText}>(2 Reviews)</Text>
              </View>
            </View>
            <View style={{height:height(3),justifyContent:'center',marginHorizontal:12}}>
              <Text style={styles.title}>Food Festival at MM Alam Road Lahore</Text>
            </View>
            <View style={styles.listCon}>
              <Text style={styles.listItem}>Availability: In Stock</Text>
              <Text style={styles.listItem}>Availability: In Stock</Text>
              <Text style={styles.listItem}>Availability: In Stock</Text>
              <Text style={styles.listItem}>Availability: In Stock</Text>
              <Text style={styles.listItem}>Availability: In Stock</Text>
            </View>
            <View style={{height:height(4),justifyContent:'center',marginHorizontal:12}}>
              <Text style={styles.paraTitle}>Quick Overview</Text>
            </View>
            <View style={{flex:1,justifyContent:'flex-start',marginHorizontal:12}}>
              <Text style={styles.paragraph}>Advertising image of a man shopping for Christmas presents, United States, 1918
              A woman shopping in Japan, 2016 Shopping is an activity in which a customer browses the available goods or services presented by one or more retailers with the potential intent to purchase a suitable selection of them.</Text>
            </View>
            <View style={{height:height(12),width:width(90),justifyContent:'center',flexDirection:'row',justifyContent:'flex-start',marginHorizontal:12}}>
              <View style={{height:height(6),width:width(50),borderWidth:0.5,borderColor:'gray',flexDirection:'row'}}>
                <View style={{height:height(6),width:width(16),backgroundColor:'rgba(128,128,128,0.2)',justifyContent:'center'}}>
                  <Text style={styles.pickerTitle}>Quantity:</Text>
                </View>
                <View style={{height:height(6),width:width(35),justifyContent:'center',alignItems:'center'}}>
                    <RNPickerSelect
                        placeholder={{
                            // label: 'Select a color...',
                            // value: null,
                        }}
                        mode = "dropdown"
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
              <TouchableOpacity style={{height:height(6),width:width(14),backgroundColor: COLOR_ORANGE,marginHorizontal: 15,borderRadius:3,justifyContent:'center',alignItems:'center'}}>
                <Image source={require('../../images/shopping-cart.png')} style={{height:height(4),width:width(8)}} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex:1,marginBottom:15}}>
            <Accordion
              sections={SECTIONS}
              underlayColor = {null}
              duration={500}
              expandFromBottom={false}
              expandMultiple={true}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              disabled={false}
             />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: totalSize(1.5),
        paddingLeft: 15,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        color: COLOR_SECONDARY,
    },
    inputAndroid: {
      paddingLeft: 15,
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      color: COLOR_SECONDARY,
    }
});
