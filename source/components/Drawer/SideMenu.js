import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { width, height, totalSize } from 'react-native-dimension';
import { Avatar } from 'react-native-elements';
// import AsyncStorage from '../../AsyncStorage/AsyncStorage';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Drawer/SideMenuStyleSheet';
import LocalDB from '../../LocalDB/LocalDB';
// import { FBLoginManager } from 'react-native-facebook-login';
import { GoogleSignin } from 'react-native-google-signin';
import { ScrollView, Text, View, Image, TouchableOpacity, BackHandler, AsyncStorage } from 'react-native';
@observer class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
    }
  }
  static navigationOptions = { header: null };
  componentWillMount = async () => {
    var userDetail = await LocalDB.getUserProfile();
    if (userDetail !== null) {
      store.login.loginResponse.data = userDetail;
      store.login.loginStatus = true;
    } else {
      store.login.loginStatus = false;
    }
  }
  navigateToScreen = (route, title) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.setParams({ otherParam: title });
    this.props.navigation.dispatch(navigateAction);
  }
  asyncDelUserInfo = async () => {
    let { orderStore } = Store;
    if ( orderStore.LOGIN_TYPE === 'facebook' ) {
        await this.handleLogout()
    } else {
      if ( orderStore.LOGIN_TYPE === 'google' ) {
        await this.signOutGoogle();
      }
    }
    try {
      const email = await AsyncStorage.removeItem('email');
      const password = await AsyncStorage.removeItem('password');
      const data = await AsyncStorage.removeItem('profile');
      orderStore.login.loginStatus = false;
      this.props.navigation.replace('MainScreen')
    } catch (error) {
      // Error saving data
    }
    // BackHandler.exitApp();
  }
  handleLogout=async()=>{
    // var _this = this;
    // FBLoginManager.logout(function(error, data){
    //   if (!error) {
    //     _this.props.onLogout && _this.props.onLogout();
    //   } else {
    //     console.log(error, data);
    //   }
    // });
  }
  signOutGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };
  render() {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    let login = orderStore.login;
    return (
      <View style={[styles.container, { backgroundColor: data.sidebar_clr }]}>
        <ScrollView>
          {
            login.loginStatus ?
              <View style={styles.headerCon}>
                <View style={styles.profileImgCon}>
                  <Avatar
                    size="large"
                    rounded
                    source={{ uri: login.loginStatus === true ? login.loginResponse.data.profile_img : data.user_defualt_img }}
                    // onPress={() => console.warn("Works!")}
                    activeOpacity={0.7}
                  />
                </View>
                {login.loginStatus === true ? <Text style={styles.userName}>{login.loginResponse.data.display_name}</Text> : null}
                {login.loginStatus === true ? <Text style={styles.userEmail}>{login.loginResponse.data.user_email}</Text> : null}
              </View>
              :
              null
          }
          <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('Home', data.menu.home)}>
            <View style={styles.itemIconCon}>
              <Image source={require('../../images/homeNew.png')} style={styles.itemIcon} />
            </View>
            <View style={styles.itemTxtCon}>
              <Text style={styles.itemTxt}>{data.menu.home}</Text>
            </View>
          </TouchableOpacity>
          {
            login.loginStatus === true ?
              <View>
                <TouchableOpacity style={styles.drawerItem} onPress={() => {
                  // this.navigateToScreen('UserDashboard',data.menu.dashboard)
                  this.setState({ isCollapsed: !this.state.isCollapsed })
                }}>
                  <View style={styles.itemIconCon}>
                    <Image source={require('../../images/user.png')} style={styles.itemIcon} />
                  </View>
                  <View style={styles.itemTxtCon}>
                    <Text style={styles.itemTxt}>{data.menu.dashboard}</Text>
                  </View>
                  <View style={styles.itemIconCon}>
                    <Image source={this.state.isCollapsed === false ? require('../../images/next_White.png') : require('../../images/down-ar-white.png')} style={[styles.itemIcon, { height: height(2) }]} />
                  </View>
                </TouchableOpacity>
                {this.state.isCollapsed === true ?
                  <View style={{ width: width(65), alignItems: 'flex-start', justifyContent: 'center', alignSelf: 'flex-end' }}>
                    <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('ListingPostTabCon', data.menu.my_listings)}>
                      <View style={[styles.itemIconCon, { width: width(10), alignSelf: 'flex-start' }]} >
                        <Image source={require('../../images/bullet-list.png')} style={[styles.itemIcon, { alignSelf: 'flex-start' }]} />
                      </View>
                      <View style={styles.itemTxtCon}>
                        <Text style={styles.itemTxt}>{'Create Listings'}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('Dashboard', data.menu.my_listings)}>
                      <View style={[styles.itemIconCon, { width: width(10), alignSelf: 'flex-start' }]} >
                        <Image source={require('../../images/bullet-list.png')} style={[styles.itemIcon, { alignSelf: 'flex-start' }]} />
                      </View>
                      <View style={styles.itemTxtCon}>
                        <Text style={styles.itemTxt}>{data.menu.my_listings}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('ReviewsCon', data.menu.reviews)}>
                      <View style={[styles.itemIconCon, { width: width(10), alignSelf: 'flex-start' }]} >
                        <Image source={require('../../images/starIcon.png')} style={[styles.itemIcon, { alignSelf: 'flex-start' }]} />
                      </View>
                      <View style={styles.itemTxtCon}>
                        <Text style={styles.itemTxt}>{data.menu.reviews}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('EventsTabs', data.menu.events)}>
                      <View style={[styles.itemIconCon, { width: width(10), alignSelf: 'flex-start' }]} >
                        <Image source={require('../../images/event.png')} style={[styles.itemIcon, { alignSelf: 'flex-start' }]} />
                      </View>
                      <View style={styles.itemTxtCon}>
                        <Text style={styles.itemTxt}>{data.menu.events}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('SavedListing', data.menu.saved_listings)}>
                      <View style={[styles.itemIconCon, { width: width(10), alignSelf: 'flex-start' }]}>
                        <Image source={require('../../images/heart.png')} style={[styles.itemIcon, { alignSelf: 'flex-start' }]} />
                      </View>
                      <View style={styles.itemTxtCon}>
                        <Text style={styles.itemTxt}>{data.menu.saved_listings}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  : null}
              </View>
              : null
          }
          <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('SearchingScreen', data.menu.adv_search)}>
            <View style={styles.itemIconCon}>
              <Image source={require('../../images/search_white.png')} style={styles.itemIcon} />
            </View>
            <View style={styles.itemTxtCon}>
              <Text style={styles.itemTxt}>{data.menu.adv_search}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('PublicEvents', data.menu.events)}>
            <View style={styles.itemIconCon}>
              <Image source={require('../../images/calendar-drawer.png')} style={styles.itemIcon} />
            </View>
            <View style={styles.itemTxtCon}>
              <Text style={styles.itemTxt}>{data.menu.events}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('blogStack', data.menu.blog)}>
            <View style={styles.itemIconCon}>
              <Image source={require('../../images/blogNew.png')} style={{ height: height(2.5), width: width(10), alignSelf: 'center', resizeMode: 'contain' }} />
            </View>
            <View style={styles.itemTxtCon}>
              <Text style={styles.itemTxt}>{data.menu.blog}</Text>
            </View>
          </TouchableOpacity> 
          <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('Categories', data.menu.cats)}>
            <View style={styles.itemIconCon}>
              <Image source={require('../../images/databaseLine.png')} style={{ height: height(2.5), width: width(10), alignSelf: 'center', resizeMode: 'contain' }} />
            </View>
            <View style={styles.itemTxtCon}>
              <Text style={styles.itemTxt}>{data.menu.cats}</Text>
            </View>
          </TouchableOpacity>
          {
            login.loginStatus === false ?
              <View>
                <TouchableOpacity style={styles.drawerItem} onPress={() => this.props.navigation.replace('MainScreen')}>
                  <View style={styles.itemIconCon}>
                    <Image source={require('../../images/logout.png')} style={{ height: height(2.3), width: width(10), alignSelf: 'center', resizeMode: 'contain' }} />
                  </View>
                  <View style={styles.itemTxtCon}>
                    <Text style={styles.itemTxt}>{data.menu.register}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              :
              <TouchableOpacity style={styles.drawerItem} onPress={() => this.asyncDelUserInfo()}>
                <View style={styles.itemIconCon}>
                  <Image source={require('../../images/logout.png')} style={{ height: height(2.3), width: width(10), alignSelf: 'center', resizeMode: 'contain' }} />
                </View>
                <View style={styles.itemTxtCon}>
                  <Text style={styles.itemTxt}>{data.menu.logout}</Text>
                </View>
              </TouchableOpacity>
          }
        </ScrollView>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
