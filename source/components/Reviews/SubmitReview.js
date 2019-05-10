import React, { Component } from 'react';
import {
  Platform, Text, View, ActivityIndicator, Image, ImageBackground, TouchableOpacity, I18nManager,
  ScrollView, TextInput, FlatList
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import Accordion from 'react-native-collapsible/Accordion';
import { Icon,Rating } from 'react-native-elements'
import HTMLView from 'react-native-htmlview';
import ApiController from '../../ApiController/ApiController';
import { withNavigation } from 'react-navigation';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_PINK } from '../../../styles/common';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Reviews/SubmitReviewStyleSheet';
import UpperView from './UpperView';
const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;

class SubmitReview extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      name: 'usama',
      activities: [],
      loadMore: false,
      reCaller: false,
      rate: 0,
    }
  }
  static navigationOptions = {
    header: null,
  };
  componentWillMount = async() => {
    let data = store.USER_REVIEWS.data.submitted_reviews;
    if (data.has_comments) {
      data.commnets.forEach((item)=>{
        this.state.activities.push(item);
      })
    }
  }
  loadMore = async (listType,pageNo) => {
    this.setState({ loadMore: true })
    let params = {
        review_type: listType,
        next_page: pageNo
    }
    let data = store.USER_REVIEWS.data.submitted_reviews;
    let response = await ApiController.post('my-own-reviews', params);
    // console.log('Tabs loadMore=====>>>', response);
    if (response.has_comments && data.submitted_pagination.has_next_page) {
        // forEach Loop LoadMore results
        response.commnets.forEach((item) => {            
            data.commnets.push(item);
        })
        response.commnets.forEach((item)=>{
          this.state.activities.push(item);
        })
        data.submitted_pagination = response.submitted_pagination;
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
  editCollapse = async(section) => {
    store.USER_REVIEWS.data.submitted_reviews.commnets.forEach((item)=>{
      if ( item.comment_id === section.comment_id && item.checked === false ) {
          item.checked = !section.checked;
          item.added = !section.added;
          this.setState({ name: '' })
      }
    })
  }
  ratingCompleted=(rating)=> {
    console.warn("Rating is: " + rating)
    this.setState({rate: rating})
  }
  _renderHeader=(section, content, isActive)=>{
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
        <View style={{ flex: 2,marginHorizontal: 10, justifyContent: 'flex-start', marginBottom: 10 }}>
          <View style={{ alignSelf:'flex-start',width: 280, flexDirection: 'row',flexWrap:'wrap' }}>
            <Text style={{fontSize: 11, marginRight: 5,color: Platform.OS === 'ios'? 'gray':null }}>{section.statement}</Text>
            <Text 
              style={{fontSize: totalSize(subHeadingTxt), fontWeight: 'bold',color: COLOR_SECONDARY }}
              onPress={()=>this.props.navigation.navigate('FeatureDetailTabBar', { listId: section.listing_id, list_title: section.listing_title })}
              >{section.listing_title}</Text>
          </View>
          <View style={{ flexDirection: 'row',marginVertical: 2 }}>
              <Rating
                type='custom'
                imageSize={12}
                readonly
                startingValue={parseFloat(section.rating_stars)}
                ratingBackgroundColor = 'transparent'
                style={{ marginRight: 7,backgroundColor:'transparent' }}
              />
              <Text style={{ fontSize: totalSize(paragraphTxt), color: COLOR_SECONDARY }}>{section.total_rating}</Text>
          </View>
          <Text style={{ flex: 0.1, fontSize: totalSize(paragraphTxt), color: Platform.OS === 'ios'? 'gray':null }}>{section.comment_time}</Text>
        </View>
        <View style={{ marginHorizontal: 4 }}>
          <Image source={isActive ? require('../../images/up-arrowImg.png') : require('../../images/dropDown.png')} style={{ height: height(2), width: width(4),resizeMode:'contain' }} />
        </View>
      </View>
    );
  }
  _renderContent=(section, content, isActive)=>{
    let txt = store.USER_REVIEWS.extra_text;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={{ flex: 10, width: width(75), marginBottom: 10, marginHorizontal: 10, alignSelf: 'flex-end', marginHorizontal: 15, borderBottomWidth: 0.4, borderColor: COLOR_GRAY }}>
        <HTMLView
              value={section.comment_desc}
              stylesheet={styles.longTxt}
            />
        {/* <TouchableOpacity style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginVertical: 10 }} onPress={async()=> await this.editCollapse(section)}>
          <View style={{ flex: 0.1, justifyContent: 'center' }}>
            <Image source={require('../../images/editReview.png')} style={{ flex: 0.2, height: height(2), width: width(3), resizeMode: 'contain' }} />
          </View>
          <Text style={{ flex: 2, fontSize: totalSize(subHeadingTxt), marginHorizontal: 5, fontWeight: 'bold', color: COLOR_SECONDARY }}>Edit Review</Text>
        </TouchableOpacity> */}
            <Rating
              type='star'
              ratingColor= {COLOR_ORANGE}
              ratingBackgroundColor= {COLOR_GRAY}
              startingValue={4}
              fractions={1}
              ratingCount={5}
              imageSize={totalSize(3)}
              onFinishRating={this.ratingCompleted}
              // showRating
              // style={styles.ratingStyle}
            />
        {
          !section.added && !section.checked ?
            <View style={{ marginTop: 5 }}>
                <TextInput
                  onChangeText={(value) => this.setState({ email: value })}
                  underlineColorAndroid='transparent'
                  placeholder='Place attractive title here'
                  placeholderTextColor='gray'
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  style={{ height: height(6), width: width(75), paddingLeft: 5, borderRadius: 5, paddingLeft: 10, marginVertical: 5, borderColor: COLOR_GRAY, borderWidth: 0.5, fontSize: totalSize(1.4) }}
                />
                {
                  txt.gallery_enabled === '1' ?
                    <View style={styles.cameraCon}>
                      <View style={styles.cameraSubCon}>
                        <Image source={require('../../images/camera.png')} style={styles.cameraIcon} />
                        <Text style={styles.cameraBtnTxt}>Select Pics</Text>
                      </View>
                      <View style={styles.tickBtnCon}>

                      </View>
                    </View>
                    :
                    nul
                }
                {
                  section.has_media ? 
                    <View style={{ height: height(12), width: width(75), marginVertical: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <FlatList
                        data={section.comment_media}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, key }) =>
                          <View style={{ height: height(10), width: width(23), marginBottom: 5, marginRight: 5, backgroundColor: 'orange' }}>
                            <ImageBackground source={{ uri: item.urlz }} style={{ height: height(10), width: width(23) }}>
                              <TouchableOpacity style={{ height: 20, width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }}>
                                <Text style={{ fontSize: 14, color: 'red' }}>X</Text>
                              </TouchableOpacity>
                            </ImageBackground>
                          </View>
                        }
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      // keyExtractor={item => item.email}
                      />
                    </View>
                    :
                    null
                }
                <TextInput
                  onChangeText={(value) => this.setState({ email: value })}
                  underlineColorAndroid='transparent'
                  placeholder='Place your review description'
                  placeholderTextColor='gray'
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  style={{ height: height(15), width: width(75), paddingLeft: 10, borderRadius: 5, marginVertical: 5, borderColor: COLOR_GRAY, borderWidth: 0.5, fontSize: totalSize(1.4), textAlignVertical: 'top' }}
                />
                <TouchableOpacity style={{ alignSelf: 'flex-end', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: main_clr, marginVertical: 10 }}>
                  <Text style={{ fontSize: 11,marginHorizontal: 7,marginVertical: 3, color: COLOR_PRIMARY }}>{txt.btn_txt}</Text>
                </TouchableOpacity>
            </View>
            :
            null
        }
      </View>
    );
  }
  render() {
    let data = store.USER_REVIEWS.data.submitted_reviews;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={styles.container}>
        {
          data.has_comments ?
            <ScrollView
              showsVerticalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                    if (this.isCloseToBottom(nativeEvent)) {
                        if (this.state.reCaller === false) {
                            this.loadMore( data.review_type , data.submitted_pagination.next_page);
                        }
                        this.setState({ reCaller: true })
                    }
                }}
                scrollEventThrottle={400}>
              <UpperView />
              <View style={styles.titleCon}>
                <Text style={styles.titleTxt}>{store.USER_REVIEWS.extra_text.submitted_txt}</Text>
              </View>
              <Accordion
                sections={this.state.activities}
                underlayColor={null}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                disabled={false}
              />
              {
                data.submitted_pagination.has_next_page ?
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
            :
            <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
              <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
              <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.message}</Text>
            </View>
        }
      </View>
    );
  }
}

export default withNavigation(SubmitReview)