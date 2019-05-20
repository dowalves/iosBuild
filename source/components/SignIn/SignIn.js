import React, { Component } from 'react';
import {
  Platform, ActivityIndicator, Text, View, AsyncStorage, Image, ImageBackground, TouchableOpacity, I18nManager,
  TextInput, Alert
} from 'react-native';
import { INDICATOR_COLOR, INDICATOR_SIZE, OVERLAY_COLOR } from '../../../styles/common';
import { width, height, totalSize } from 'react-native-dimension';
import Toast from 'react-native-simple-toast';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import Store from '../../Stores';
import styles from '../../../styles/SignIn'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import ApiController from '../../ApiController/ApiController';
import LocalDB from '../../LocalDB/LocalDB'
// import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
var { FBLoginManager } = require('react-native-facebook-login');
export default class SignIn extends Component<Props> {
  constructor(props) {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    super(props);
    this.state = {
      loading: false,
      password: 'admin',//12345
      email: 'melisa@gmail.com',//usama@gmail.com
    }
  }
  static navigationOptions = {
    header: null
  };
  componentWillMount = async () => {
    GoogleSignin.configure({
      iosClientId: '191792720370-rc4ospf26req749phf3d4l4sfj74gmf4.apps.googleusercontent.com'
    })
  }
  //// Google Login Methode 
  handleGoogleSignIn = async () => {
    console.log('Google login');
    GoogleSignin.signIn().then(fun = async (user) => {
      console.log('Google login', user);
      //Calling local func for login through google
      store.LOGIN_SOCIAL_TYPE = 'social';
      store.LOGIN_TYPE = 'google';
      await this.socialLogin(user.user.email, user.user.name, 'apple@321');
    }).catch((err) => {
      console.warn(err);
    }).done();
  }
  //.... FaceBook Login Methodes
  fbLogin = () => {
    FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Native); // defaults to Native
    FBLoginManager.loginWithPermissions(["email"], functionFb = async (error, data) => {
      if (!error && data.type === "success") {
        //Calling local func for login through google
        let profile = JSON.parse(data.profile);
        store.LOGIN_SOCIAL_TYPE = 'social';
        store.LOGIN_TYPE = 'facebook';
        await this.socialLogin(profile.email, profile.name, 'apple@321');
        // console.log("FaceBook signUp: ", profile);
      } else {
        Toast.show('It must be your network issue, please try again.', Toast.LONG);
        console.log("Error: ", error);
      }
    })
  }
  //// Custom Social Login methode
  socialLogin = async (email, name, password) => {
    if (this.state.email.length > 0 && this.state.password.length > 0) {
      var Email, Password;
      Email = this.state.email;
      Password = this.state.password;
    } else {
      Email = email;
      Password = password;
    }
    let { orderStore } = Store;
    this.setState({ loading: true })
    let params = {
      name: name,
      email: email,
      type: 'social'
    }
    //API Calling
    let response = await ApiController.post('login', params)
    // console.log('login user =', response);
    if (response.success === true) {
      this.setState({ loading: false })
      await LocalDB.saveProfile(Email, Password, response.data);
      orderStore.login.loginStatus = true;
      orderStore.login.loginResponse = response;
      this.props.navigation.push('Drawer')
    }
  }
  //// Login Post 
  login = async () => {
    let { orderStore } = Store;
    this.setState({ loading: true })
    let params = {
      email: this.state.email,
      password: this.state.password
    }
    //Api calling
    let response = await ApiController.post('login', params)
    // console.log('login user =', response);
    if (response.success === true) {
      store.LOGIN_TYPE = 'local';
      await LocalDB.saveProfile(this.state.email, this.state.password, response.data);
      this.setState({ loading: false })
      orderStore.login.loginStatus = true;
      orderStore.login.loginResponse = response;
      this.props.navigation.push('Drawer');
    } else {
      this.setState({ loading: false })
      Toast.show(response.message);
    }
  }
  render() {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../images/bk_ground.jpg')} style={styles.imgCon}>
          <ImageBackground source={require('../../images/Downtown_Shadownew.png')} style={styles.imgCon}>
            <View style={{ flex: 1 }}>
              <View style={{ height: height(5), width: width(100), flexDirection: 'row' }}>
                <TouchableOpacity style={styles.bckImgCon} onPress={() => this.props.navigation.goBack()}>
                  <Image source={require('../../images/back_btn.png')} style={styles.backBtn} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'flex-end', marginHorizontal: 25 }}>
                  <Text style={styles.headerTxt}>{data.main_screen.sign_in}</Text>
                </View>
              </View>
              <View style={styles.logoView}>
                <Image source={{ uri: data.logo }} style={styles.logoImg} />
                <Text style={styles.logoTxt}>{data.slogan}</Text>
              </View>
              <View style={styles.buttonView}>
                <View style={styles.btn} onPress={() => { this.props.navigation.navigate('Login') }}>
                  <View style={{ flex: 0.6 }}>
                    <Image source={require('../../images/mail.png')} style={styles.mail} />
                  </View>
                  <View style={{ flex: 4.1 }}>
                    <TextInput
                      onChangeText={(value) => this.setState({ email: value })}
                      underlineColorAndroid='transparent'
                      placeholder={data.main_screen.email_placeholder}
                      placeholderTextColor='white'
                      textContentType='emailAddress'
                      keyboardType='email-address'
                      underlineColorAndroid='transparent'
                      autoCorrect={true}
                      style={styles.inputTxt}
                    />
                  </View>
                </View>
                <View style={styles.btn} onPress={() => { this.props.navigation.navigate('Login') }}>
                  <View style={{ flex: 0.6 }}>
                    <Image source={require('../../images/password.png')} style={styles.mail} />
                  </View>
                  <View style={{ flex: 4.1 }}>
                    <TextInput
                      onChangeText={(value) => this.setState({ password: value })}
                      underlineColorAndroid='transparent'
                      placeholder={data.main_screen.password_placeholder}
                      secureTextEntry={true}
                      placeholderTextColor='white'
                      underlineColorAndroid='transparent'
                      autoCorrect={true}
                      style={styles.inputTxt}
                    />
                  </View>
                </View>
                <TouchableOpacity style={[styles.signUpBtn, { backgroundColor: orderStore.settings.data.main_clr }]} onPress={() => this.login()}>
                  <Text style={styles.signUpTxt}>{data.main_screen.sign_in}</Text>
                </TouchableOpacity>
                <View style={styles.fgBtn}>
                  {
                    data.registerBtn_show.facebook?
                      <TouchableOpacity style={{ width: width(37.2), height: height(5), borderRadius: 3, backgroundColor: 'transparent', backgroundColor: '#134A7C', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => { this.fbLogin() }}
                      >
                        <Text style={ styles.socialBtnText }>{data.main_screen.fb_btn}</Text>
                      </TouchableOpacity>
                      :
                      null
                  }
                  {
                    data.registerBtn_show.google && data.registerBtn_show.facebook ?
                      <Text style={styles.orTxt}>{data.main_screen.separator}</Text>
                      :
                      null
                  }
                  {
                    data.registerBtn_show.google?
                      <TouchableOpacity style={{ width: width(37), height: height(5), borderRadius: 3, backgroundColor: 'transparent', backgroundColor: '#DB4437', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => { this.handleGoogleSignIn() }}
                      >
                        <Text style={styles.socialBtnText}>{data.main_screen.g_btn}</Text>
                      </TouchableOpacity>
                      :
                      null
                  }
                  
                </View>
                <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                  {!this.state.loading ? null :
                    <ActivityIndicator size={INDICATOR_SIZE} color={store.settings.data.navbar_clr} animating={true} hidesWhenStopped={true} />}
                </View>
              </View>
              <View style={styles.footer}>
                <Text style={styles.forgetpwrd} onPress={() => this.props.navigation.navigate('ForgetPassword')}>{data.main_screen.forgot_text}</Text>
                <Text style={styles.newHere} onPress={() => this.props.navigation.navigate('SignUp')}>{data.main_screen.new_member}</Text>
                {/* <Text style={styles.signInT} onPress={() => this.props.navigation.navigate('SignUp')}>{data.main_screen.sign_up}</Text> */}
              </View>
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  }
}
