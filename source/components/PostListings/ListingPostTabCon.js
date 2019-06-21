import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import { height, width, totalSize } from 'react-native-dimension';
import store from '../../Stores/orderStore';
import CreateListing from './CreateListing';
import PricingListing from './PricingListing';
import DescriptionListing from './DescriptionListing';
import Icon from 'react-native-vector-icons/AntDesign';

export default class ListingTabCon extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    }
  }
  static navigationOptions = {
    header: null,
  };
  indexingInc = async () => {
    if (this.state.index < 2) {
      await this.setState({ index: this.state.index + 1 })
    }
  }
  indexingDec = async () => {
    if (this.state.index > 0) {
      await this.setState({ index: this.state.index - 1 })
    }
  }
  _renderTabBar = props => (
    <View style={{ height: 50, width: width(100), flexDirection: 'row', backgroundColor: store.settings.data.main_clr }}>
      <View style={{ width: width(80), justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, color: 'white', marginHorizontal: 20 }}>Next Step 0{this.state.index + 1}</Text>
      </View>
      <View style={{ width: width(20), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Icon size={20} name='left' color='white' style={{ marginRight: 2 }} onPress={() => this.indexingDec()} />
        <Icon size={20} name='right' color='white' style={{ marginLeft: 2 }} onPress={() => this.indexingInc()} />
      </View>
    </View>
  );
  render() {
    let main_clr = store.settings.data.main_clr;

    return (
      <TabView
        navigationState={{
          index: this.state.index,
          routes: [
            { key: 'create', title: 'createListing' },
            { key: 'price', title: 'Pricing' },
            { key: 'description', title: 'Description' },
          ],
        }}
        renderScene={SceneMap({
          create: CreateListing,
          price: PricingListing,
          description: DescriptionListing
        })}
        swipeEnabled={true}
        animationEnabled={true}
        onIndexChange={index => this.setState({ index: index })}
        initialLayout={{ height: 0, width: Dimensions.get('window').width }}
        // canJumpToTab={true}
        tabBarPosition='bottom'
        renderTabBar={this._renderTabBar}
      />
    );
  }
}
