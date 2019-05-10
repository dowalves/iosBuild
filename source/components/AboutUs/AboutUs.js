import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Button, Image, ImageBackground, TouchableOpacity, I18nManager,
  ScrollView, TextInput, FlatList
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { width, height, totalSize } from 'react-native-dimension';
import { FONT_NORMAL, FONT_BOLD, COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import styles from '../../../styles/AboutUsStyleSheet';
const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
const SECTIONS = [
  {
    title: 'Who are you',
    content: 'heloo ahaohd ashdoh ashdoih aosihdo nasoihdasod hasoido ashdoihoas dhasod asdjo ashdoh ashdoh ashldo ashdoih asdohasd oasdho hsd asndo ahsdo ashd aosdih sdoi ashdi hdao dahods ashdo daoshdo oasdo nosnd noasdo oosdk nasond',
  },
  {
    title: 'How are you',
    content: 'heloo ahaohd ashdoh ashdoih aosihdo nasoihdasod hasoido ashdoihoas dhasod asdjo ashdoh ashdoh ashldo ashdoih asdohasd oasdho hsd asndo ahsdo ashd aosdih sdoi ashdi hdao dahods ashdo daoshdo oasdo nosnd noasdo oosdk nasond'
  },
  {
    title: 'What are our Services',
    content: 'heloo ahaohd ashdoh ashdoih aosihdo nasoihdasod hasoido ashdoihoas dhasod asdjo ashdoh ashdoh ashldo ashdoih asdohasd oasdho hsd asndo ahsdo ashd aosdih sdoi ashdi hdao dahods ashdo daoshdo oasdo nosnd noasdo oosdk nasond'
  },
];
export default class AboutUs extends Component<Props> {
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
  _renderHeader(section, content, isActive) {
    return (
      <Animatable.View
        duration={500}
        transition="backgroundColor"
        transition="source"
        transition="style"
        style={{ height: height(6), marginHorizontal: 15, marginVertical: 5, borderRadius: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: (isActive ? COLOR_ORANGE : 'rgba(128,128,128,0.2)') }}>
        <Text style={{ width: width(80), fontSize: totalSize(headingTxt), marginLeft: 15, color: COLOR_SECONDARY }}>{section.title}</Text>
        <Image source={(isActive ? require('../../images/dropDown.png') : require('../../images/next.png'))} style={{ height: height(2), width: width(4), resizeMode: 'contain' }} />
      </Animatable.View>
    );
  }
  _renderContent(section, content, isActive) {
    return (
      <Animatable.View
        duration={500}
        transition="backgroundColor"
        style={{ elevation: 10, alignItems: 'center', borderRadius: 3, marginHorizontal: 15, marginVertical: 10, backgroundColor: (isActive ? 'white' : 'white') }}>
        <Animatable.Text
          duration={500}
          easing="ease-out"
          animation={isActive ? 'zoomIn' : 'zoomOut'}
          align='center'
          style={{ alignSelf: 'center', margin: 10, fontSize: totalSize(subHeadingTxt), fontFamily: FONT_NORMAL }}
        >
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}>
          <Text style={{ fontSize: totalSize(titles), marginTop: 15, marginHorizontal: 15, color: COLOR_SECONDARY, fontWeight: 'bold' }}>About Down Town: </Text>
          <View style={{ elevation: 0, marginVertical: 10, flex: 1, backgroundColor: COLOR_PRIMARY, marginHorizontal: 15 }}>
            <Text style={{ fontSize: totalSize(subHeadingTxt), margin: 10, marginBottom: 5, color: COLOR_SECONDARY }}>
              Advertising image of a man shopping for Christmas presents, United States, 1918
              A woman shopping in Japan, 2016 Shopping is an activity in which a customer browses the available goods or services presented by one or more retailers with the potential intent to purchase a suitable selection of them. A typology of shopper types has been developed by scholars which identifies one group of shoppers as recreational shoppers, [1] that is, those who enjoy shopping and view it as a leisure activity.[2] Online shopping has become a major disruptor in the retail industry. [3] Consumers can now search for product information and place product orders across different regions while online retailers deliver their products directly to the consumers home, offices or wherever they want
          </Text>
            <Text style={{ fontSize: totalSize(subHeadingTxt), padding: 10, borderLeftWidth: 2, borderColor: COLOR_ORANGE, margin: 20, color: COLOR_SECONDARY, fontFamily: FONT_NORMAL }}>
              Advertising image of a man shopping for Christmas presents, United States, 1918
              ct information and place product orders across different regions while online retailers deliver their products directly to the consumers home, offices or wherever they want
          </Text>
          </View>
          <Accordion
            sections={SECTIONS}
            underlayColor={null}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            disabled={false}
          />
        </ScrollView>
      </View>
    );
  }
}
