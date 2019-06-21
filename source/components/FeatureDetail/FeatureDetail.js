import React, { Component } from 'react';
import { Text, View, ActivityIndicator, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { COLOR_RED, COLOR_ORANGE } from '../../../styles/common';
import { width } from 'react-native-dimension';
import StarRating from 'react-native-star-rating';
import Toast from 'react-native-simple-toast'
import { observer } from 'mobx-react';
import Store from '../../Stores';
import ApiController from '../../ApiController/ApiController';
import styles from '../../../styles/FeatureDetailStyle'
@observer export default class FeatureDetail extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }
  static navigationOptions = {
    header: null,
  };
  bookMarkedListing = async () => {
    let { orderStore } = Store;
    if (orderStore.settings.data.is_demo_mode) {
      Toast.show(orderStore.settings.data.demo_mode_txt)
    } else {
      this.setState({ loading: true })
      let params = {
        listing_id: orderStore.home.LIST_ID
      }
      response = await ApiController.post('listing-bookmark', params);
      // console.log('book mark listing====>>>',response);
      if (response.success) {
        this.setState({ loading: false })
        Toast.show(response.message);
      } else {
        this.setState({ loading: false })
        Toast.show(response.message)
      }
    }
  }
  render() {
    let { orderStore } = Store;
    let data = orderStore.home.FEATURE_DETAIL.data.listing_detial;
    return (
      <ImageBackground source={{ uri: data.first_img }} style={styles.bgImg}>
        <View style={styles.imgConView}>
          <View style={styles.imgSubConView}>
            {
              data.is_featured === '0' ?
                null
                :
                <View style={styles.featureBtn}>
                  <Text style={styles.featureBtnTxt}>Featured</Text>
                </View>
            }
            <View style={{ width: width(90), justifyContent: 'center', flexWrap: 'wrap' }}>
              <Text style={styles.title}>{data.listing_title}</Text>
            </View>
            <View style={styles.dateRatingCon}>
              <Text style={styles.date}>{data.posted_date}</Text>
              <View style={styles.gradingCon}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  starSize={13}
                  fullStarColor={COLOR_ORANGE}
                  containerStyle={{ marginHorizontal: 10 }}
                  rating={data.ratings.rating_stars}
                />
              </View>
              <Text style={styles.rateTxt}>{data.ratings.rating_avg}</Text>
            </View>
            <View style={styles.btnSaveReport}>
              {
                data.is_saved ?
                  <TouchableOpacity style={styles.btn} onPress={this.bookMarkedListing}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                      {
                        this.state.loading ?
                          <ActivityIndicator size='small' color={COLOR_RED} animating={true} />
                          :
                          <Image source={require('../../images/love.png')} style={styles.btnIcon} />
                      }
                      <Text style={styles.saveBtnTxt}>{data.save_listing}</Text>
                    </View>
                  </TouchableOpacity>
                  :
                  null
              }
              {
                data.is_report ?
                  <TouchableOpacity style={styles.btn} onPress={() => { this.props.callModel('report', true) }}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                      <Image source={require('../../images/warning.png')} style={styles.btnIcon} />
                      <Text style={styles.repBtnTxt}>{data.report_listing}</Text>
                    </View>
                  </TouchableOpacity>
                  :
                  null
              }
              {
                data.is_claim ?
                  <TouchableOpacity style={styles.btn} onPress={() => { this.props.callModel('claim', false) }}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                      <Image source={require('../../images/shield.png')} style={styles.btnIcon} />
                      <Text style={styles.repBtnTxt}>{data.claim_listing}</Text>
                    </View>
                  </TouchableOpacity>
                  :
                  null
              }

            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
