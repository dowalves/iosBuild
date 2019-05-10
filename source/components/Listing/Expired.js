import React, {Component} from 'react';
import { Text, View,Image,TouchableOpacity,ScrollView } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { width, height, totalSize } from 'react-native-dimension';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Icon } from 'react-native-elements';
import { COLOR_PRIMARY,COLOR_GRAY,COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import FeatureDetailTabBar from './FeaturedListingBar';
import styles from '../../../styles/Listing/FeaturedStyleSheet';
@observer export default class Featured extends Component<Props> {
  constructor( props ) {
    super(props);
    this.state = {

    }
  }
  static navigationOptions = {
    header: null,
  };
  loadMore = async (listType,pageNo) => {
    this.setState({ loadMore: true })
    let params = {
        listing_type: listType,
        next_page: pageNo
    }
    let data = store.USER_PROFILE.data.listing_types.expired_listings;
    let response = await ApiController.post('my-own-listings', params);
    // console.log('Tabs loadMore=====>>>', response);
    if (response.listing && data.expired_pagination.has_next_page) {
        // forEach Loop LoadMore results
        response.listing.forEach((item) => {            
            data.listing.push(item);
        })
        data.expired_pagination = response.expired_pagination;
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

  listComp = ( item,key ) => {
    let data = store.USER_PROFILE.data;
    return(
      <TouchableOpacity key={key} style={styles.featuredFLItem} onPress={()=> this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title })}>
        <Image source={{ uri: item.image }} style={styles.featuredImg} />
        <View style={{height:height(15),width:width(32),position:'absolute'}}>
          <View style={styles.triangleCorner}>
          </View>
          <Image source={require('../../images/starfill.png')} style={{height:height(1.5),width:width(3),marginLeft:4,marginTop:4,position:'absolute',resizeMode:'contain'}} />
          <View style={{height:height(5)}}></View>
          <View style={{width:width(30),alignItems:'flex-start'}}>
            <View style={[styles.closedBtn,{ backgroundColor: item.color_code }]}>
              <Text style={styles.closedBtnTxt}>{item.business_hours_status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.txtViewCon}>
          <View style={{ width:width(54),marginVertical: 3 }}> 
            <Text style={styles.txtViewHeading}>{item.category_name}</Text>
            <Text style={styles.viewDetail}>{item.listing_title}</Text>
            <View style={{height:height(3),alignItems:'center',flexDirection:'row'}}>
              <Image source={require('../../images/calendar.png')} style={{height:height(2.5),width:width(4),marginLeft:10,resizeMode:'contain'}} />
              <Text style={styles.subHeadingTxt}>{item.posted_date}</Text>
              <View style={{ marginHorizontal: 5 ,height: 10 ,width: 1,borderWidth: 0.3,borderColor:'#c4c4c4' }}></View>
              <View style={{ flexDirection:'row' }}>
                <Icon
                  size={20}
                  name='eye'
                  type='evilicon'
                  color='#8a8a8a'
                  containerStyle={{ marginHorizontal: 0,marginVertical: 0 }}
                  />
                <Text style={styles.ratingTxt}>{item.total_views}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={{flex:1,height:height(13)}}>
                <Menu>
                  <MenuTrigger>
                    <Image source={require('../../images/menu.png')} style={{height:height(3.5),width:width(5),marginLeft:10,resizeMode:'contain'}} />
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption>
                      <View style={{flexDirection:'row',}}>
                        <Image source={require('../../images/refresh.png')} style={{height:height(2.5),width:width(4),marginHorizontal:5,resizeMode:'contain'}} />
                        <Text style={{fontSize:totalSize(1.4),marginHorizontal:5,color:'black'}}>Reactive</Text>
                      </View>
                    </MenuOption>
                    <MenuOption>
                      <View style={{flexDirection:'row',}}>
                        <Image source={require('../../images/google-analytics.png')} style={{height:height(2.5),width:width(4),marginHorizontal:5,resizeMode:'contain'}} />
                        <Text style={{fontSize:totalSize(1.4),marginHorizontal:5,color:'black'}}>Analytics</Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
            </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    let data = store.USER_PROFILE.data;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={styles.container}>
        {
          data.listing_types.expired_listings.has_list ? 
            <ScrollView
              showsVerticalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                  if (this.isCloseToBottom(nativeEvent)) {
                      if (this.state.reCaller === false) {
                          this.loadMore( data.listing_types.expired_listings.listing_type , data.listing_types.expired_listings.expired_pagination.next_page);
                      }
                      this.setState({ reCaller: true })
                  }
              }}
              scrollEventThrottle={400}>
              <View style={{ backgroundColor: COLOR_PRIMARY, marginBottom: 10 }}>
                <Text style={{ marginVertical: 15, marginHorizontal: 10,fontWeight:'bold',color: COLOR_SECONDARY }}>{data.listing_types.expired_listings.listing_count}</Text>
              </View>
              {
                data.listing_types.expired_listings.listing.map((item,key)=>{
                  return(
                    <FeatureDetailTabBar key={key} item={item} />
                  )
                })
              }
              {
                data.listing_types.expired_listings.expired_pagination.has_next_page ?
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
              <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.listing_types.expired_listings.message}</Text>
            </View>
        }
      </View>
    );
  }
}




