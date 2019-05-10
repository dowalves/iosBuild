import React, { Component } from 'react';
import {
  Platform, SafeAreaView,Text, View, Image, ImageBackground, TouchableOpacity, ScrollView, TextInput, FlatList,ActivityIndicator
} from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { Icon } from 'react-native-elements';
// import Grading from 'react-native-grading';
import { NavigationActions } from 'react-navigation';
import {  COLOR_GRAY, COLOR_ORANGE, test } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Home';
import ApiController from '../../ApiController/ApiController';
@observer export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }
  static navigationOptions = { header: null };
  navigateToScreen = (route, title) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.setParams({ otherParam: title });
    this.props.navigation.dispatch(navigateAction);
  }
  componentWillMount = async () => {
    let { orderStore } = Store;
    // calling homeData func
    store.SEARCH_OBJ = {};
    this.setState({ loading: true })
    let response = await ApiController.post('listing-filters');
    // console.log('Listing Filter response====>>>>', response);
    if (response.success) {
      store.SEARCHING.LISTING_FILTER = response;
      // creating new array named as options
      store.SEARCHING.LISTING_FILTER.data.all_filters.forEach(item => {
        if (item.type === 'dropdown') {
          item.options = [];
          item.option_dropdown.forEach(val => {
            item.options.push({ value: val.value })
          });
        }
      });
      // Adding states to buttons....
      store.SEARCHING.LISTING_FILTER.data.status.checkStatus = false;
      if (store.SEARCHING.LISTING_FILTER.data.is_rated_enabled) {
        store.SEARCHING.LISTING_FILTER.data.rated.option_dropdown.forEach(item => {
          item.checkStatus = false;
        }); 
      }
      // adding states to checkBoxes
      store.SEARCHING.LISTING_FILTER.data.sorting.option_dropdown.forEach(item => {
        item.checkStatus = false;
      });
      // sorting object for events sorting
      store.EVENTS_SORTING = store.SEARCHING.LISTING_FILTER.data.sorting;
      await this.homeData()
      this.setState({ loading: false })
    } else {
      this.setState({ loading: false })
    }
  }
  // Getting home data func 
  homeData = async () => {
    let { orderStore } = Store;
    try {
      this.setState({ loading: true })
      //API calling
      let response = await ApiController.get('home');
      // console.log('responseHome==>>>>>', response);
      if (response.success) {
        orderStore.home.homeGet = response;
        this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
      console.log('error', error);
    }
  }
  render() {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    let home = orderStore.home.homeGet.data;
    if (this.state.loading == true) {
      return (
        <View style={styles.IndicatorCon}>
            <ActivityIndicator color= {store.settings.data.navbar_clr} size='large' animating={true} />
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subCon}>
          <ScrollView
            showsVerticalScrollIndicator={false}>
            <View style={styles.topViewCon}>
              <View style={styles.InnerRadius}>
                <View style={styles.imageCon}>
                  <ImageBackground source={{ uri: home.search_section.image }} style={{ flex: 1,resizeMode: 'contain' }}>
                    <View style={{ height: height(40), alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                      <View style={styles.findTxtCon}>
                        <Text style={styles.firTxt}>{home.search_section.main_title}</Text>
                      </View>
                      <Text style={styles.secTxt}>{home.search_section.sub_title}</Text>
                      <View style={styles.searchCon}>
                        <TextInput
                          onChangeText={(value) => this.setState({ email: value })}
                          underlineColorAndroid='transparent'
                          placeholder={home.search_section.placeholder}
                          // placeholderTextColor='black'
                          underlineColorAndroid='transparent'
                          autoCorrect={false}
                          onFocus={() => this.navigateToScreen('SearchingScreen', 'search')}
                          style={styles.txtInput}
                        />
                        <Image 
                          source={require('../../images/search_black.png')} 
                          style={styles.searchIcon} 
                          onPress={()=>this.navigateToScreen('SearchingScreen', 'search')}
                          />
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </View>
            </View>
            {
              home.categories_enabled ?
                <View style={{ flex: 1,width: width(100), backgroundColor:'transparent',alignItems: 'center', position: 'absolute', marginVertical: 190 }}>
                  <View style={styles.flatlistCon}>
                    <FlatList
                      data={home.categories}
                      // contentContainerStyle={{ height: height(15), alignSelf: 'flex-end',backgroundColor:'red' }}
                      renderItem={({ item, key }) =>
                        <TouchableOpacity key={key} style={styles.flatlistChild}
                          onPress={() => {
                            store.CATEGORY = item,
                              store.moveToSearch = true,
                              this.navigateToScreen('SearchingScreen', data.menu.adv_search)
                          }}
                        >
                          <Image style={{ height: height(7), width: width(15), resizeMode: 'contain', overflow: 'hidden' }} source={{ uri: item.img }} />
                          <Text style={[styles.childTxt, { fontWeight: 'bold' }]}>{item.name}</Text>
                        </TouchableOpacity>
                      }
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      // keyExtractor={item => item.email}
                    />
                  </View>
                  <View style={{ flex: 1.3, width: width(100) }}></View>
                </View>
                :
                null
            }
            {
              home.listings_enabled ?
                <View style={{ width: width(90), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 35 : 35 ,marginBottom: 5  }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.recList}>{home.section_txt}</Text>
                  </View>
                  <TouchableOpacity style={[styles.readMoreBtnCon,{ borderColor: store.settings.data.navbar_clr }]} onPress={() => this.navigateToScreen('SearchingScreen', data.menu.adv_search)}>
                    <Text style={[styles.latestFeature, { fontSize: 13 }]}>{home.section_btn}</Text>
                  </TouchableOpacity>
                </View>
                :
                null
            }
            {
              home.listings_enabled ?
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <FlatList
                      data={home.listings}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, key }) =>
                        <TouchableOpacity key={key} style={styles.featuredFLItem} onPress={() => { this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
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
                                  score={item.rating_stars.length === 0 ? 0 : item.rating_stars}
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
                                  containerStyle={{ marginHorizontal: 0,marginVertical: 0 }}
                              />
                              <Text style={styles.ratingTxt}>{item.total_views}</Text>
                            </View>
                            <View style={{ marginTop: 2, width: width(45), marginHorizontal: 8, flexDirection: 'row', alignItems: 'center' }}>
                              <Icon
                                  size={18}
                                  name='calendar'
                                  type='evilicon'
                                  color='#8a8a8a'
                                  containerStyle={{ marginHorizontal: 0,marginVertical: 0 }}
                              />
                              <Text style={{ fontSize: 10, color:'#8a8a8a' }}>{item.posted_date}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      }
                      horizontal={false}
                      showsHorizontalScrollIndicator={false}
                    // keyExtractor={item => item.email}
                    />
                  </View>
                :
                null
            }
            {
              home.events_enabled ?
                <View style={styles.cate_con}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.recList}>{home.latest_events}</Text>
                    {/* <Text style={styles.latestFeature}>Recent Listing</Text> */}
                  </View>
                  <TouchableOpacity style={[styles.readMoreBtnCon,{ borderColor: store.settings.data.navbar_clr }]} onPress={() => this.navigateToScreen('PublicEvents', 'Home')}>
                    <Text style={[styles.latestFeature, { fontSize: 13 }]}>{home.view_all_events}</Text>
                  </TouchableOpacity>
                </View>
                :
                null
            }
            {
              home.events_enabled ?
                <View style={[styles.flatlistCon, { position: null, height: null, marginTop: 0, marginBottom: 15 }]}>
                    <FlatList
                      data={home.events}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, key }) =>
                        <TouchableOpacity key={key} style={styles.cateCon} onPress={() => this.props.navigation.push('EventDetail', { event_id: item.event_id , headerColor: store.settings.data.navbar_clr ,title: item. event_title})} >
                          <Image style={styles.cate_img} source={{ uri: item.image }} />
                          <Image style={[styles.cate_img, { position: 'absolute' }]} source={require('../../images/cate-shadow.png')} />
                          <View style={[styles.cate_img, { position: 'absolute' }]}>
                            <View style={{ flex: 1, alignItems: 'flex-end', borderRadius: 5 }}>
                              <View style={styles.cate_name}>
                                <Text style={styles.cateNameText}>{item.event_category_name}</Text>
                              </View>
                            </View>
                            <View style={{ height: height(15), borderRadius: 5, justifyContent: 'center' }}>
                              <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
                                <Text style={styles.cate_text}>{item.event_start_date}  -</Text>
                                <Text style={styles.cate_text}>{item.event_end_date}</Text>
                              </View>
                              <Text style={styles.eventTitle}>{item.event_title}</Text>
                              <View style={{ flexDirection: 'row', marginHorizontal: 15, marginBottom: 10 }}>
                                <Image style={styles.locIcon} source={require('../../images/paper-plane.png')} />
                                <Text style={styles.locText}>{item.event_loc}</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      }
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    // keyExtractor={item => item.email}
                    />
                  </View>
                :
                null
            }
       
          </ScrollView>
          <TouchableOpacity style={[styles.exploreBtn, { backgroundColor: data.main_clr }]} onPress={() => this.navigateToScreen('SearchingScreen', 'Advance')}>
            <Image source={require('../../images/search_white.png')} style={styles.btnIcon} />
            <Text style={styles.explorebtnTxt}>{data.main_screen.explore}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
