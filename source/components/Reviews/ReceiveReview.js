import React, { Component } from 'react';
import {
  Platform, Text, View, ActivityIndicator, Image, ImageBackground, TouchableOpacity, ScrollView, TextInput
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import Accordion from 'react-native-collapsible/Accordion';
import HTMLView from 'react-native-htmlview';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_PINK } from '../../../styles/common';
import { Icon, Rating } from 'react-native-elements'
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Reviews/ReceiveReviewsStyleSheet';
import { withNavigation } from 'react-navigation';
import UpperView from './UpperView';
const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
class ReceiveReview extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      activities: [],
      loadMore: false,
      reCaller: false,
    }
  }
  static navigationOptions = {
    header: null,
  };
  componentWillMount = async () => {
    let data = store.USER_REVIEWS.data.received_reviews;
    if (data.has_comments) {
      data.commnets.forEach((item) => {
        this.state.activities.push(item);
      })
    }
  }
  loadMore = async (listType, pageNo) => {
    this.setState({ loadMore: true })
    let params = {
      review_type: listType,
      next_page: pageNo
    }
    let data = store.USER_REVIEWS.data.received_reviews;
    let response = await ApiController.post('my-own-reviews', params);
    // console.log('Tabs loadMore=====>>>', response);
    if (response.has_comments && data.received_pagination.has_next_page) {
      // forEach Loop LoadMore results
      response.commnets.forEach((item) => {
        data.commnets.push(item);
      })
      response.commnets.forEach((item) => {
        this.state.activities.push(item);
      })
      data.received_pagination = response.received_pagination;
      // console.log('after Loop=======>>>',data.commnets);        
      await this.setState({ loadMore: false })
    } else {
      await this.setState({ loadMore: false })
      // Toast.show(response.data.no_more)
    }
    await this.setState({ reCaller: false })
  }
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  _renderHeader=(section, content, isActive)=> {
    return (
      <View style={{ flex: 1, flexDirection: 'row', borderRadius: 5, marginVertical: 10, marginHorizontal: 15, borderBottomWidth: 0.4, borderColor: (isActive ? "#f9f9f9" : COLOR_GRAY) }}>
        <View style={{ height: height(10), alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 10 }}>
          <Avatar
            medium
            rounded
            source={{ uri: section.commenter_dp }}
            activeOpacity={1}
            onPress={()=>this.props.navigation.push('PublicProfileTab',{ profiler_id: section.user_id ,user_name: section.commenter_name })}
          />
        </View>
        <View style={{ flex: 2, marginHorizontal: 10, justifyContent: 'flex-start', marginBottom: 10 }}>
          <Text style={{ fontSize: totalSize(subHeadingTxt), fontWeight: 'bold', color: COLOR_SECONDARY }}>{section.commenter_name}</Text>
          <View style={{ alignSelf: 'flex-start', width: 280, flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 11,marginRight: 5, color: Platform.OS === 'ios' ? 'gray' : null }}>{section.statement}</Text>
            <Text 
              style={{ fontSize: totalSize(subHeadingTxt), fontWeight: 'bold', color: COLOR_SECONDARY }}
              onPress={()=>this.props.navigation.navigate('FeatureDetailTabBar', { listId: section.listing_id, list_title: section.listing_title })}
              >{section.listing_title}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 2 }}>
            <Rating
              type='custom'
              imageSize={12}
              readonly
              startingValue={parseFloat(section.rating_stars)}
              ratingBackgroundColor='transparent'
              style={{ marginRight: 7, backgroundColor: 'transparent' }}
            />
            <Text style={{ fontSize: totalSize(paragraphTxt), color: COLOR_SECONDARY }}>{section.total_rating}</Text>
          </View>
          <Text style={{ flex: 0.1, fontSize: totalSize(paragraphTxt), color: Platform.OS === 'ios' ? 'gray' : null }}>{section.comment_time}</Text>
        </View>
        <View style={{ marginHorizontal: 4 }}>
          <Image source={isActive ? require('../../images/up-arrowImg.png') : require('../../images/dropDown.png')} style={{ height: height(2), width: width(4), resizeMode: 'contain' }} />
        </View>
      </View>
    );
  }
  _renderContent(section, content, isActive) {
    let txt = store.USER_REVIEWS.extra_text;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={{ flex: 10, width: width(75), marginBottom: 10, marginHorizontal: 10, alignSelf: 'flex-end', marginHorizontal: 15, borderBottomWidth: 0.4, borderColor: COLOR_GRAY }}>
        {/* <Text style={{ fontSize: totalSize(paragraphTxt), color: Platform.OS === 'ios' ? 'gray' : null }}>{section.comment_desc}</Text> */}
        <HTMLView
              value={section.comment_desc}
              stylesheet={styles.longTxt}
            />
        <Text style={{ flex: 1, marginVertical: 5, fontSize: totalSize(1.4), fontWeight: 'bold', color: COLOR_SECONDARY }}>{txt.replybox_txt}</Text>
        <TextInput
          onChangeText={(value) => this.setState({ email: value })}
          underlineColorAndroid='transparent'
          placeholder= { txt.placeholder_txt }
          placeholderTextColor='gray'
          underlineColorAndroid='transparent'
          autoCorrect={false}
          style={{ height: height(15), width: width(75), borderRadius: 5, marginVertical: 5, borderColor: COLOR_GRAY, borderWidth: 1, fontSize: totalSize(subHeadingTxt), paddingLeft: 10, textAlignVertical: 'top' }}
        />
        <TouchableOpacity style={{ alignSelf: 'flex-end', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: main_clr, marginVertical: 10 }}>
          <Text style={{ fontSize: 11, marginHorizontal: 7, marginVertical: 3, color: COLOR_PRIMARY }}>{txt.btn_txt}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    let data = store.USER_REVIEWS.data.received_reviews;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.reCaller === false  ) {
                this.loadMore(data.review_type, data.received_pagination.next_page);
              }
              this.setState({ reCaller: true })
            }
          }}
          scrollEventThrottle={400}>
          <UpperView />
          <View style={styles.titleCon}>
            <Text style={styles.titleTxt}>{store.USER_REVIEWS.extra_text.received_txt}</Text>
          </View>

          <Accordion
            sections={this.state.activities}
            underlayColor={null}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            disabled={false}
          />
          {
            data.received_pagination.has_next_page ?
              <View style={{ height: height(7), width: width(100), justifyContent: 'center', alignItems: 'center' }}>
                {
                  this.state.loadMore ?
                    <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                    : null
                }
              </View>
              :
              null
          }
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(ReceiveReview)