import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Picker, ActivityIndicator, RefreshControl
} from 'react-native';

import { width, height, totalSize } from 'react-native-dimension';

import Toast from 'react-native-simple-toast';
import * as RNIap from 'react-native-iap';
import ApiController from '../../ApiController/ApiController';
import { COLOR_PRIMARY, COLOR_SECONDARY, iconsSize } from '../../../styles/common';
import store from '../../Stores/orderStore';
import styles from './style';

import { AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp } from '../../helpers/Responsive';

import * as Animatable from 'react-native-animatable';


const theme = {
  primaryBackgroundColor: 'white',
  secondaryBackgroundColor: 'white',
  primaryForegroundColor: 'blue',
  secondaryForegroundColor: 'orange',
  accentColor: 'green',
  errorColor: 'red'
};
let itemSkewsIos = ['dwt_business_plan', 'dwt_premium_plan'];
let itemSkewsAndroid = [];

let packgeIdIap = '';
let packageTypeIap = '';
const swing = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
};
export default class Language extends Component<Props> {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      loading: false,
      name: '',
      favColor: 'red',
      is_picker: false,
      payment_methodes: [],
      payment_type: '',
      pkg_id: '',
      pkg_type: '',
      amount: '',
      currency: '',
      receipt: null,
      breaker: 0
    }
  }
  static navigationOptions = {
    header: null,
  };
  inAppPurchase = async (pkgId, pkgType, item, model) => {
    isLogged = await this.isLoggedIn()
    if (isLogged) {
      packageTypeIap = pkgType;
      packgeIdIap = pkgId;
      let code = '';
      if (Platform.OS == 'ios') {
        code = model.ios.code;
      }
      else
        code = model.android.code;
      this.requestSubscription(code, pkgId, pkgType);
    } else {
      Toast.show('You need to login')
    }



  }

  purchaseUpdateSubscription;
  purchaseErrorSubscription;
  async componentDidMount() {
    await this.getPackages()




  }

  requestPurchase = async (sku) => {
    try {
      RNIap.requestPurchase(sku);
    } catch (err) {
      console.log(err.code, err.message);
    }
  }



  isLoggedIn = async () => {
    const email = await AsyncStorage.getItem('email');
    const pass = await AsyncStorage.getItem('password');

    if (email != null && pass != null) {
      return true
    }
    return false
  }
  getPackages = async () => {
    this.setState({ loading: true });
    try {
      var response = await ApiController.post('packages');
      // console.log('packages are====>>>', response);

      if (response.success) {
        store.PACKAGES_OBJ = response.data;
        store.PACKAGES_OBJ.packages.forEach(item => {
          item.selectedMethod = '';
          if (item.ios.code.length != 0)
            itemSkewsIos.push(item.ios.code);
          if (item.android.code.length != 0)
            itemSkewsAndroid.push(item.android.code);
        });

        this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      console.log('error: ', error);
      this.setState({ loading: false })
    }
  }



  _blog = (item, key) => {
    let main_clr = store.settings.data.main_clr;
    let data = store.PACKAGES_OBJ;
    return (
      <View key={key} style={styles.blogCon}>
        <Animatable.View
          ref="view"
          animation={'bounce'}
          style={{ width: width(80), alignItems: 'center', paddingVertical: wp('4') }}>
          <Animatable.Text tran animation={swing} style={{ color: '#6E768B', fontSize: wp(4) }}>{item.package_info.title}</Animatable.Text>
        </Animatable.View>


      </View>
    );
  }
  render() {
    let main_clr = store.settings.data.main_clr;
    let data = store.PACKAGES_OBJ;
    return (
      <View style={[styles.container]}>
        {
          this.state.loading ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={main_clr} size='large' animating={true} />
            </View>
            :
            <ScrollView
              style={{ alignContent: 'center' }}
              backgroundColor='#f9f9f9'
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  colors={['white']}
                  progressBackgroundColor={store.settings.data.main_clr}
                  tintColor={store.settings.data.main_clr}
                  refreshing={this.state.refreshing}
                  onRefresh={this.getPackages}
                />
              }
            >
              {
                data.has_package ?
                  data.packages.map((item, key) => {
                    // console.warn('loop');
                    return (
                      this._blog(item, key)
                    )
                  })
                  :
                  <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                    <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                    <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.message}</Text>
                  </View>
              }
            </ScrollView>
        }

      </View>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: totalSize(1.8),
    paddingLeft: 15,
    paddingTop: 13,
    paddingHorizontal: 20,
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
