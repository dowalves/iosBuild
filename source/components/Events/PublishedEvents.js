import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, ScrollView } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import ApiController from '../../ApiController/ApiController';
import { COLOR_SECONDARY } from '../../../styles/common';
import MyEventComp from './MyEventComp';
import store from '../../Stores/orderStore';
import EventsUpperView from './EventsUpperView';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SimpleToast from 'react-native-simple-toast';

class PublishedEvents extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loadMore: false,
      reCaller: false,
      loading: false
    }
  }
  static navigationOptions = { header: null };
  upDateGet = async(event_id) => {
    this.setState({ loading: true })
    let params = {
      is_update: event_id
    }
    let response = await ApiController.post('edit-event',params);
    console.log('edit event==========================>>',response);
    if ( response.success ) {
        store.MY_EVENTS.data.create_event = response.data.create_event;
        store.MY_EVENTS.data.create_event.gallery.dropdown.forEach(item => {
          item.checkStatus = false;
        })
        this.setState({ loading: false })
        this.props.navigation.push('CreactEvent',{ eventMode: 'edit' , eventID: event_id });
        // this.props.jumpTo('create');
    } else {
        this.setState({ loading: false })
    }
  }
  deleteEvent = async(event_id) => {
    this.setState({ loading: true })
    let params = {
      event_id: event_id
    }
    let response = await ApiController.post('delete-event',params);
    console.log('delete event==========================>>',response);
    if ( response.success ) {
        store.MY_EVENTS.data.create_event = response.data.create_event;
        store.MY_EVENTS.data.create_event.gallery.dropdown.forEach(item => {
          item.checkStatus = false;
        })
        this.setState({ loading: false })
        this.props.navigation.push('CreactEvent',{ eventMode: 'edit' , eventID: event_id });
        // this.props.jumpTo('create');
    } else {
        SimpleToast.show(response.message)
        this.setState({ loading: false })
    }
  }
  loadMore = async (listType, pageNo) => {
    this.setState({ loadMore: true })
    let params = {
      event_type: listType,
      next_page: pageNo
    }
    let data = store.MY_EVENTS.data.my_events.active_events;
    let response = await ApiController.post('load-my-events', params);
    // console.log('Tabs loadMore=====>>>', response);
    if (response.has_events && data.publish_pagination.has_next_page) {
      // forEach Loop LoadMore results
      response.events.forEach((item) => {
        data.events.push(item);
      })
      data.publish_pagination = response.publish_pagination;
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
  render() {
    let data = store.MY_EVENTS.data.my_events;
    let main_clr = store.settings.data.main_clr;
    if (this.state.loading == true) {
      return (
        <View style={{ height: height(100), width: width(100), justifyContent:'center',alignItems:'center',flex: 1 }}>
            <ActivityIndicator size='large' color={main_clr} animating={true} />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.reCaller === false) {
                this.loadMore(data.active_events.event_type, data.active_events.publish_pagination.next_page);
              }
              this.setState({ reCaller: true })
            }
          }}
          scrollEventThrottle={400}>
          <EventsUpperView />
          <View style={{ marginHorizontal: 10,marginVertical: 5,alignItems:'flex-end' }}>
            <TouchableOpacity style={{ width: 353,alignItems:'center',backgroundColor:'green',borderRadius: 4 }} onPress={()=>this.props.navigation.push('CreactEvent',{ eventMode: 'create' })}>
              <Text style={{ marginVertical: 10,fontSize: 14,color:'white' }}>Create</Text>
            </TouchableOpacity>
          </View>
          {
            data.active_events.has_events ?
              data.active_events.events.map((item, key) => {
                return (
                  <MyEventComp item={item} key={key} options={'published'} jumpTo={this.props.jumpTo} upDateGet = {this.upDateGet} />
                );
              })
              :
              <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.active_events.message}</Text>
              </View>
          }
          {
            data.active_events.publish_pagination.has_next_page ?
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
export default withNavigation(PublishedEvents)