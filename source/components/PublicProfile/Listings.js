import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
// import Grading from 'react-native-grading';
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Home';
import ProfileUpperView from './ProfileUpperView';
import { withNavigation } from 'react-navigation';

class Listings extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      // loading: false,
      loadmore: false,
      reCaller: false,
    }
  }

  componentWillMount = async () => {
  }
  // public_profile = async () => {
  //   store.is_publicEvents = true;
  //   this.setState({ loading: true })
  //   let params = {
  //     user_id: '14'
  //   };
  //   let response = await ApiController.post('author-detial', params);
  //   if (response.success) {
  //     store.PUB_PROFILE_DETAIL = response.data;
  //     this.setState({ loading: false })
  //     store.is_publicEvents = false;
  //   } else {
  //     this.setState({ loading: false })
  //     store.is_publicEvents = false;
  //   }
  // }
  static navigationOptions = { header: null };

  _blog = (item, key) => {
    return (
      <TouchableOpacity key={key} style={[styles.featuredFLItem, { width: width(95), alignSelf: 'center', alignItems: 'center' }]} onPress={() => { this.props.navigation.push('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
        <ImageBackground source={{ uri: item.image }} style={styles.featuredImg}>
          <TouchableOpacity style={[styles.closedBtn, { backgroundColor: item.color_code }]}>
            <Text style={styles.closedBtnTxt}>{item.business_hours_status}</Text>
          </TouchableOpacity>
        </ImageBackground>
        <View style={styles.txtViewCon}>
          <Text style={styles.subHeadingTxt}>{item.category_name}</Text>
          <Text style={styles.txtViewHeading}>{item.listing_title}</Text>
          <View style={styles.ratingCon}>
            <View style={styles.gradingCon}>
              {/* <Grading
                mode="stars"
                scale={1}
                score={item.rating_stars === '' ? 0 : item.rating_stars}
                scoreBase={5}
                activeColor={COLOR_ORANGE}
                defaultColor={COLOR_GRAY}
              /> */}
            </View>
            <Icon
              size={20}
              name='eye'
              type='evilicon'
              color='#8a8a8a'
              containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
            />
            <Text style={styles.ratingTxt}>{item.total_views}</Text>
          </View>
          <View style={{ marginTop: 2, width: width(45), marginHorizontal: 8, flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              size={18}
              name='calendar'
              type='evilicon'
              color='#8a8a8a'
              containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
            />
            <Text style={{ fontSize: totalSize(1.6), marginHorizontal: 0 }}>{item.posted_date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  loadMore = async (pageNo) => {
    let params = {
      user_id: store.PUB_PROFILE_ID, //14
      listing_next_page: pageNo
    }
    this.setState({ loadmore: true })
    var data = store.PUB_PROFILE_DETAIL;
    let response = await ApiController.post('author-detial', params);
    // console.log('loadMore=====>>>', response);
    if (response.success && data.listing_pagination.has_next_page) {
      //forEach Loop LoadMore results
      response.data.listing.forEach((item) => {
        data.listing.push(item);
      })
      data.listing_pagination = response.data.listing_pagination;
      this.setState({ loadmore: false })
    } else {
      this.setState({ loadmore: false })
      // Toast.show(response.data.no_more)
    }
    this.setState({ reCaller: false })
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render() {
    let main_clr = store.settings.data.main_clr;
    let data = store.PUB_PROFILE_DETAIL;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.reCaller === false && data.has_listings) {
                this.loadMore(data.listing_pagination.next_page);
              }
              this.setState({ reCaller: true })
            }
          }}
          scrollEventThrottle={400}>
          <ProfileUpperView data={store.PUB_PROFILE_DETAIL} />
          {
            data.has_listings ?
              <View>
                {
                  data.has_listings ?
                    data.listing.map((item, key) => {
                      return (
                        this._blog(item, key)
                      )
                    })
                    :
                    null
                }
                {
                  data.listing_pagination.has_next_page ?
                    <View style={{ height: height(7), width: width(100), justifyContent: 'center', alignItems: 'center' }}>
                      {
                        this.state.loadmore ?
                          <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                          : null
                      }
                    </View>
                    :
                    null
                }
              </View>
              :
              <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.listing_message}</Text>
              </View>
          }
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(Listings);
