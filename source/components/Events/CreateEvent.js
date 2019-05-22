//***********************//
//****  Usama Butt  ****//
//**********************//

import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, ActivityIndicator, Platform, TouchableOpacity, ScrollView, TextInput, Picker } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { width, height, totalSize } from 'react-native-dimension';
import ImagePicker from 'react-native-image-crop-picker';
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
// import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import DatePicker from 'react-native-datepicker';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_DARK_GRAY } from '../../../styles/common';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Events/CreateEventStyleSheet';
import EventsUpperView from './EventsUpperView';
import { withNavigation } from 'react-navigation';


class CreateEvent extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      is_picker: false,
      isCategory: false,
      images: [],
      predictions: [],
      location: '',
      latitude: null,
      longitude: null,
      eventTitle: '',
      cate_id: '',
      cate_name: '',
      phoneNo: '',
      email: '',
      description: '',
      start_date: '',
      end_date: '',
      related_listing: '',
      list_name: '',
      avatorSources: [],
      editImages: []
    }
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }
  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
  }

  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    //alert(titleHtml + ' ' + contentHtml)
  }
  componentWillMount = async () => {
    let data = store.MY_EVENTS.data.create_event;
    if ( data.category.value !== '' ) {
      data.category.dropdown.forEach(async(item)=>{
        if ( item.category_id === data.category.value ) {
            await this.setState({ cate_name: item.category_name })
        }
      })
    }
    if ( data.related.value !== '' ) {
      data.related.dropdown.forEach(async(item)=>{
        if ( item.listing_id === data.related.value ) {
            await this.setState({ list_name: item.listing_title })
        }
      })
    }
    await this.setState({
      eventTitle: data.title.value,
      phoneNo: data.phone.value,
      email: data.email.value,
      cate_id: data.category.value,
      related_listing: data.related.value,
      description: data.desc.value,
      start_date: data.date_start.value,
      end_date: data.date_end.value,
      location: data.location.value,
      latitude: data.latt.value === ''? null : data.latt.value,
      longitude: data.long.value === ''? null : data.long.value,
      editImages: data.gallery.has_gallery ? data.gallery.dropdown : [] ,
    })
  }
  createEvent = async () => {
    let data = store.MY_EVENTS.data;

    if (this.state.cate_id === '' || this.state.eventTitle === '' || this.state.email === '' || this.state.description === '' || this.state.start_date === '' || this.state.end_date === '' || this.state.avatorSources.length === 0 || this.state.location === '' || this.state.related_listing === '' ) {
      Toast.show(data.required_msg)
    } else {
      this.setState({ loading: true })
      let formData = new FormData();
      formData.append('title', this.state.eventTitle);
      formData.append('category', this.state.cate_id);
      formData.append('number', this.state.phoneNo);
      formData.append('email', this.state.email);
      formData.append('desc', this.state.description);
      formData.append('start_date', this.state.start_date);
      formData.append('end_date', this.state.end_date);
      formData.append('venue', this.state.location);
      formData.append('lat', this.state.latitude);
      formData.append('long', this.state.longitude);
      formData.append('parent_listing', this.state.related_listing);
      if (this.state.avatorSources.length > 0) {
        for (let i = 0; i < this.state.avatorSources.length; i++) {
          formData.append('event_multiple_attachments[]', this.state.avatorSources[i]);
        }
      }  
      // console.log('formData======>>>',formData);
          
      // ApiController 
      let response = await ApiController.postForm('event-submission', formData);
      console.log('Event Upload========>>>>', response);
      if ( response.success ) {
          Toast.show(response.message)
          await this.clearFields()
          this.props.navigation.push('EventDetail', { event_id: response.event_id, title: this.state.eventTitle, headerColor: store.settings.data.navbar_clr })
          this.setState({ loading: false })
      } else {
        Toast.show(response.message)
        this.setState({ loading: false })
      } 
    }
  }
  editEvent = async () => {
    let data = store.MY_EVENTS.data;
    let { params } = this.props.navigation.state;

    if (this.state.cate_id === '' || this.state.eventTitle === '' || this.state.email === '' || this.state.description === '' || this.state.start_date === '' || this.state.end_date === '' ||  this.state.location === '' || this.state.related_listing === '' || this.state.editImages.length === 0? this.state.avatorSources.length === 0 : null ) {
      Toast.show(data.required_msg)
    } else {
      this.setState({ loading: true })
      let formData = new FormData();
      formData.append('title', this.state.eventTitle);
      formData.append('category', this.state.cate_id);
      formData.append('number', this.state.phoneNo);
      formData.append('email', this.state.email);
      formData.append('desc', this.state.description);
      formData.append('start_date', this.state.start_date);
      formData.append('end_date', this.state.end_date);
      formData.append('venue', this.state.location);
      formData.append('lat', this.state.latitude);
      formData.append('long', this.state.longitude);
      formData.append('parent_listing', this.state.related_listing);
      formData.append('is_update',params.eventID)
      if (this.state.avatorSources.length > 0) {
        for (let i = 0; i < this.state.avatorSources.length; i++) {
          formData.append('event_multiple_attachments[]', this.state.avatorSources[i]);
        }
      }      
      console.log('formData======>>>',formData);
      // ApiController 
      let response = await ApiController.postForm('event-submission', formData);
      console.log('Event edit========>>>>', response);
      if ( response.success ) {
          Toast.show(response.message)
          await this.clearFields()
          this.props.navigation.push('EventDetail', { event_id: response.event_id, title: this.state.eventTitle, headerColor: store.settings.data.navbar_clr })
          this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      } 
    }
  }
  clearFields = async() => {
    await this.setState({
      eventTitle: '',
      cate_id: '',
      cate_name: '',
      phoneNo: '',
      email: '',
      description: '',
      start_date: '',
      end_date: '',
      related_listing: '',
      list_name: '',
      avatorSources: [],
      latitude: null,
      location: '',
      longitude: null
    })
  }
  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      //alert('content focus');
    });
  }
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Create Event',
    headerTintColor: COLOR_PRIMARY,
    headerStyle: {
      backgroundColor: store.settings.data.main_clr
    }
  });
  placesComplete = async (text) => {
    if (text.length > 0) {
      // const API_KEY = 'AIzaSyDVcpaziLn_9wTNCWIG6K09WKgzJQCW2tI'; // new
      const API_KEY = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';  //old play4team
      fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + text + '&key=' + API_KEY)
        .then((response) => response.json())
        .then(func = async (responseJson) => {
          // console.log('result Places AutoComplete===>>', responseJson);
          if (responseJson.status === 'OK') {
            await this.setState({ predictions: responseJson.predictions })
          }
        }).catch((error) => {
          console.log('error', error);
        });
    } else {
      this.setState({ predictions: [] })
    }
  }
  getLatLong = async (address) => {
    this.setState({ location: address })
    let api_key = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + api_key)
      .then((response) => response.json())
      .then(func = async (responseJson) => {
        // console.warn('latLong', responseJson);
        if (responseJson.status === 'OK') {
          await this.setState({
            latitude: responseJson.results[0].geometry.location.lat,
            longitude: responseJson.results[0].geometry.location.lng,
            predictions: []
          })
          console.warn(this.state.latitude, this.state.longitude);
        }
      })
  }
  selectListing = async (itemValue, itemIndex) => {
    let data = store.MY_EVENTS.data.create_event;
    await this.setState({ related_listing: itemValue });
    data.related.dropdown.forEach(async (item) => {
      if (item.listing_id === itemValue) {
        await this.setState({ list_name: item.listing_title })
      }
    });
  }
  selectCategory = async (itemValue, itemIndex) => {
    let data = store.MY_EVENTS.data.create_event;
    await this.setState({ cate_id: itemValue });
    data.category.dropdown.forEach(async (item) => {
      if (item.category_id === itemValue) {
        await this.setState({ cate_name: item.category_name })
      }
    });

  }
  multiImagePicker() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
    }).then(async (images) => {
      images.forEach(i => {
        this.state.avatorSources.push({ uri: i.path, type: i.mime, name: i.filename })
      })
      await this.setState({
        image: null,
        images: images.map(i => {
          // console.log('received image', i);
          return { uri: i.path, width: i.width, height: i.height, mime: i.mime };
        })
      })
    }).catch((error) => {
      console.log('error:', error);
    });
  }
  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }
    return this.renderImage(image);
  }
  renderImage(image) {
    return (
      <ImageBackground source={image} style={{ height: height(10), width: width(20) }}>
        <TouchableOpacity style={{ height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }} onPress={()=> this.removeLocalImage(image)}>
          <Text style={{ fontSize: totalSize(2), color: 'red' }}>X</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
  removeLocalImage = async(image) => {
    for (let i = 0; i < this.state.images.length; i++) {
        if ( image.uri === this.state.images[i].uri ) {
            this.state.images.splice(this.state.images.indexOf(image.uri),1);
            this.setState({ loading: false })
        }
    }
    for (let i = 0; i < this.state.avatorSources.length; i++) {
      if ( image.uri === this.state.avatorSources[i].uri ) {
          this.state.avatorSources.splice(this.state.avatorSources.indexOf(image.uri),1);
          this.setState({ loading: false })
      }
    }
  }
  deleteCloudImage = async(img) => {
    let data = store.MY_EVENTS.data.create_event;
    let { params } = this.props.navigation.state;
    let parameters = {
      event_id: params.eventID,
      image_id: img.image_id
    };
    data.gallery.dropdown.forEach(item => {
      if ( item.image_id === img.image_id && img.checkStatus === false ) {
           item.checkStatus = true;
      } else {
          item.checkStatus = false;
      }
    })
    await this.setState({ editImages: data.gallery.dropdown })
    try {
      let response = await ApiController.post('delete-event-img',parameters);
      if ( response.success ) {
        response.data.gallery.dropdown.forEach(item => {
          item.checkStatus = false;
        })
        data.gallery = response.data.gallery;
        await this.setState({ editImages: data.gallery.dropdown })
        // Toast.show(response.message)
      } else {
        // Toast.show(response.message)
      }
    } catch (error) {
      console.log('error:',error);
    }
  }
  render() {
    let { params } = this.props.navigation.state;
    let data = store.MY_EVENTS.data.create_event;
    var date = new Date().toDateString();
    // console.warn(date);
    return (
      <View style={styles.container}>
        <ScrollView>
          <EventsUpperView />
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.title.main_title}<Text style={{ color:'red' }}>*</Text></Text>
            <TextInput
              onChangeText={(value) => this.setState({ eventTitle: value })}
              placeholder={data.title.placeholder}
              value={data.title.value !== '' ? this.state.eventTitle : null}
              placeholderTextColor='gray'
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.category.main_title}<Text style={{ color:'red' }}>*</Text></Text>
            {
              Platform.OS === 'android' ?
                <View style={{ height: 45, width: 380, flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                  <Picker
                    selectedValue={this.state.language}
                    style={{ height: 45, width: 370 }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ cate_id: itemValue })
                    }>
                    <Picker.Item label={data.category.placeholder} />
                    {
                      data.category.dropdown.map((item, key) => {
                        return (
                          <Picker.Item key={key} label={item.category_name} value={item.category_id} />
                        );
                      })
                    }
                  </Picker>
                </View>
                :
                <TouchableOpacity style={{ height: 50, width: 340, alignItems: 'center', flexDirection: 'row', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }} onPress={() => this.setState({ isCategory: !this.state.isCategory })}>
                  <Text style={{ marginHorizontal: 8, width: 290 }}>{this.state.cate_name.length !== 0 ? this.state.cate_name : data.category.placeholder}</Text>
                  <Icon
                    size={14}
                    name='caretdown'
                    type='antdesign'
                    color='gray'
                  />
                </TouchableOpacity>
            }
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.phone.main_title}</Text>
            <TextInput
              onChangeText={(value) => this.setState({ phoneNo: value })}
              value={this.state.phoneNo}
              placeholder={data.phone.placeholder}
              placeholderTextColor='gray'
              keyboardType='phone-pad'
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.email.main_title}<Text style={{ color:'red' }}>*</Text></Text>
            <TextInput
              onChangeText={(value) => this.setState({ email: value })}
              value={this.state.email}
              placeholder={data.email.placeholder}
              placeholderTextColor='gray'
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.aboutInputCon}>
            <Text style={styles.textInputLabel}>{data.desc.main_title}<Text style={{ color:'red' }}>*</Text></Text>
            <TextInput
              onChangeText={(value) => this.setState({ description: value })}
              value={this.state.description}
              placeholder={data.desc.placeholder}
              placeholderTextColor='gray'
              underlineColorAndroid='transparent'
              autoCorrect={true}
              multiline={true}
              scrollEnabled={true}
              style={styles.aboutInputText}
            />
          </View>
          <View style={styles.textInputCon}>
            <View style={{ height: height(2), alignItems: 'center', flex: 1, flexDirection: 'row' }}>
              <Text style={styles.dateLabel}>{data.date_start.main_title}<Text style={{ color:'red' }}>*</Text></Text>
              <Text style={styles.dateLabel}>{data.date_end.main_title}<Text style={{ color:'red' }}>*</Text></Text>
            </View>
            <View style={{ height: height(6.5), justifyContent: 'center', flex: 1, flexDirection: 'row' }}>
              <View style={{ height: height(5), width: 170, borderRadius: 3, borderColor: 'COLOR_GRAY', marginRight: 2, borderWidth: 0.3 }}>
                <DatePicker
                  style={{ width: 200 }}
                  date={this.state.start_date}
                  mode="datetime"
                  androidMode='spinner' //spinner
                  showIcon={true}
                  placeholder={data.date_start.placeholder}
                  duration={400}
                  format="MM/DD/YYYY HH:mm a"
                  minDate="1/12/2018"
                  maxDate="1/12/2030"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  disabled={false}
                  // is24Hour={false}
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 10,
                      marginTop: 6,
                      height: 20,
                      width: 20
                    },
                    dateInput: {
                      marginLeft: 0,
                      borderWidth: 0,
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { console.warn(date),this.setState({ start_date: date }) }}
                />
              </View>
              <View style={{ height: height(5), width: 170, borderRadius: 3, borderColor: 'COLOR_GRAY', marginLeft: 2, borderWidth: 0.3 }}>
                <DatePicker
                  style={{ width: 200 }}
                  date={this.state.end_date}
                  // is24Hour={false}
                  mode="datetime"
                  androidMode='spinner' //spinner
                  showIcon={true}
                  placeholder={data.date_end.placeholder}
                  duration={400}
                  format="MM/DD/YYYY HH:mm a"
                  minDate="1/12/2018"
                  maxDate="1/12/2030"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  disabled={false}
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 10,
                      marginTop: 6,
                      height: 20,
                      width: 20
                    },
                    dateInput: {
                      marginLeft: 0,
                      borderWidth: 0,
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.setState({ end_date: date }) }}
                />
              </View>
            </View>
          </View>
          <View style={{ flex: 1, marginHorizontal: 15, marginVertical: 5 }}>
            <Text style={styles.textInputLabel}>{data.gallery.main_title}<Text style={{ color:'red' }}>*</Text></Text>
            <View style={styles.cameraCon}>
              <TouchableOpacity style={styles.cameraSubCon} onPress={() => this.multiImagePicker()}>
                <Image source={require('../../images/camera.png')} style={styles.cameraIcon} />
                <Text style={styles.cameraBtnTxt}>{data.gallery.placeholder}</Text>
              </TouchableOpacity>
              <View style={styles.tickBtnCon}>
                {
                  this.state.images.length === 0 ?
                    <Image source={require('../../images/success.png')} style={{ height: height(10), width: width(20), resizeMode: 'contain' }} />
                    :
                    <Image source={require('../../images/successChecked.png')} style={{ height: height(10), width: width(20), resizeMode: 'contain' }} />
                }
              </View>
            </View>
          </View>
          <View style={{ flex: 1, marginHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
            {
              this.state.images.length > 0 || this.state.editImages.length > 0 ?
                <View style={{ flex: 1, flexDirection: 'row', marginVertical: 10, alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  <ScrollView 
                    horizontal={true}>
                    {this.state.images ? this.state.images.map(i => <View key={i.uri} style={{ marginRight: 5, marginVertical: 3 }}>{this.renderAsset(i)}</View>) : null}
                    {
                      this.state.editImages.length > 0 ? 
                        data.gallery.dropdown.map((item ,key) => {
                          return(
                            <View key={key} style={{ marginRight: 5, marginVertical: 3 }}>
                              <Image source={{ uri: item.url }} style={{ height: height(10), width: width(20) }} />
                              <View style={{ height: height(10), width: width(20),alignItems:'flex-end' ,position:'absolute' }}>
                                {
                                  item.checkStatus ?
                                    <View style={{ height: height(10), width: width(20),backgroundColor: item.checkStatus? 'rgba(0,0,0,0.5)':null,justifyContent:'center',alignItems:'center' }}>
                                      <ActivityIndicator size='large' animating={true} color={COLOR_PRIMARY} /> 
                                    </View>
                                    :
                                    <TouchableOpacity style={{ height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }} onPress={async()=> await this.deleteCloudImage(item)}>
                                      <Text style={{ fontSize: totalSize(2), color: 'red' }}>X</Text>
                                    </TouchableOpacity> 
                                }
                              </View>
                            </View>
                          )
                        }) 
                        : 
                        null 
                    }
                  </ScrollView>
                </View>
                :
                null
            }
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.location.main_title}<Text style={{ color:'red' }}>*</Text></Text>
            <TextInput
              onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
              placeholder={data.location.placeholder}
              value={this.state.location}
              placeholderTextColor='gray'
              underlineColorAndroid='transparent'
              autoCorrect={true}
              style={styles.textInput}
            />
          </View>
          {
            this.state.predictions.length > 0 ?
              <View style={{ alignSelf: 'center', width: width(90), backgroundColor: 'white', marginVertical: 5, elevation: 3 }}>
                <ScrollView>
                  {
                    this.state.predictions.map((item, key) => {
                      return (
                        <TouchableOpacity key={key} style={{ height: height(6), width: width(90), justifyContent: 'center', marginBottom: 0.5, backgroundColor: 'white', borderBottomWidth: 0.5, borderColor: COLOR_GRAY }}
                          onPress={() => this.getLatLong(item.description)}
                        >
                          <Text style={{ marginHorizontal: 10 }}>{item.description}</Text>
                        </TouchableOpacity>
                      );
                    })
                  }
                </ScrollView>
              </View>
              : null
          }
          <View style={styles.mapCon}>
            <MapView
              ref={(ref) => this.mapView = ref}
              zoomEnabled={true}
              zoomControlEnabled={true}
              showsBuildings={true}
              showsIndoors={true}
              provider={PROVIDER_GOOGLE}
              showsMyLocationButton={true}
              showsUserLocation={true}
              followsUserLocation={true}
              minZoomLevel={5}
              maxZoomLevel={20}
              mapType={"standard"}
              loadingEnabled={true}
              loadingIndicatorColor={'#ffffff'}
              loadingBackgroundColor='gray'
              moveOnMarkerPress={false}
              // animateToRegion = {{
              //   latitude:       this.state.latitude,
              //   longitude:      this.state.latitude,
              //   latitudeDelta:  0.00922*1.5,
              //   longitudeDelta: 0.00421*1.5
              //       }, 5000}
              style={styles.map}
              region={{
                latitude: parseFloat(this.state.latitude) || 31.582045,
                longitude: parseFloat(this.state.longitude) || 74.329376,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
            // onRegionChange={this.onRegionChange.bind(this)}
            >
              {
                this.state.latitude !== null && this.state.longitude !== null ?
                  <MapView.Marker
                    coordinate={
                      { latitude: parseFloat(this.state.latitude), longitude: parseFloat(this.state.longitude) }
                    }
                    title={'Current location'}
                    description={'I am here'}
                    pinColor={'#3edc6d'}
                  />
                  :
                  null
              }
            </MapView>
          </View>
          <View style={styles.textInputCon}>
            <View style={{ height: height(2), alignItems: 'center', flex: 1, flexDirection: 'row' }}>
              <Text style={styles.dateLabel}>{data.long.main_title}<Text style={{ color:'red' }}>*</Text></Text>
              <Text style={styles.dateLabel}>{data.latt.main_title}<Text style={{ color:'red' }}>*</Text></Text>
            </View>
            <View style={{ height: height(6.5), justifyContent: 'center', flex: 1, flexDirection: 'row' }}>
              <View style={{ height: height(5.5), flex: 1, borderRadius: 3, borderColor: 'COLOR_GRAY', marginRight: 2, borderWidth: 0.3, justifyContent: 'center' }}>
                {/* <TextInput
                  placeholder={data.long.placeholder}
                  placeholderTextColor='gray'
                  keyboardType="numeric"
                  value={this.state.longitude !== null ? this.state.longitude : null}
                  style={{ fontSize: totalSize(1.4), color: 'black', paddingHorizontal: 7 }}
                /> */}
                <Text style={{ fontSize: totalSize(1.4), color: 'black', paddingHorizontal: 7 }}>{this.state.longitude !== null ? this.state.longitude : data.long.placeholder}</Text>
              </View>
              <View style={{ height: height(5.5), flex: 1, borderRadius: 3, borderColor: 'COLOR_GRAY', marginLeft: 2, borderWidth: 0.3, justifyContent: 'center' }}>
                {/* <TextInput
                  placeholder={data.latt.placeholder}
                  placeholderTextColor='gray'
                  value={this.state.latitude !== null ? this.state.latitude : null}
                  keyboardType="numeric"
                  style={{ fontSize: totalSize(1.4), color: 'black', paddingHorizontal: 7 }}
                /> */}
                <Text style={{ fontSize: totalSize(1.4), color: 'black', paddingHorizontal: 7 }}>{this.state.latitude !== null ? this.state.latitude : data.latt.placeholder}</Text>
              </View>
            </View>
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.related.main_title}<Text style={{ color:'red' }}>*</Text></Text>
            {
              Platform.OS === 'android' ?
                <View style={{ height: 45, width: 380, flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                  <Picker
                    selectedValue={this.state.language}
                    style={{ height: 45, width: 370 }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ related_listing: itemValue })
                    }>
                    <Picker.Item label={data.related.placeholder} />
                    {
                      data.related.dropdown.map((item, key) => {
                        return (
                          <Picker.Item key={key} label={item.listing_title} value={item.listing_id} />
                        );
                      })
                    }
                  </Picker>
                </View>
                :
                <TouchableOpacity style={{ height: 50, width: 340, alignItems: 'center', flexDirection: 'row', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                  <Text style={{ marginHorizontal: 8, width: 290 }}>{this.state.list_name.length !== 0 ? this.state.list_name : data.related.placeholder}</Text>
                  <Icon
                    size={14}
                    name='caretdown'
                    type='antdesign'
                    color='gray'
                  />
                </TouchableOpacity>
            }
          </View>
          <TouchableOpacity style={[styles.profielBtn, { backgroundColor: store.settings.data.main_clr }]} onPress={() => { 
              if (params.eventMode === 'create') {
                this.createEvent()
              } else {
                this.editEvent()
              } 
            }}>
            {
              this.state.loading === true ? 
                <ActivityIndicator animating={true} color={COLOR_PRIMARY} size='large' /> 
                :
                <Text style={styles.profielBtnTxt}>Update Profile</Text>
            }
          </TouchableOpacity>
        </ScrollView>
        <Modal
          animationInTiming={500}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.is_picker}
          onBackdropPress={() => this.setState({ is_picker: false })}
          style={{ flex: 1, marginTop: 275 }}>
          <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
            <View style={{ height: height(4), alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_picker: false }) }}>
                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={this.state.related_listing}
                style={{ height: 45, width: 370 }}
                onValueChange={async (itemValue, itemIndex) =>
                  await this.selectListing(itemValue, itemIndex)
                  // this.setState({ related_listing: itemValue })
                }>
                {
                  data.related.dropdown.map((item, key) => {
                    return (
                      <Picker.Item key={key} label={item.listing_title} value={item.listing_id} />
                    );
                  })
                }
              </Picker>
            </View>
          </View>
        </Modal>
        <Modal
          animationInTiming={500}    // Select category model
          animationIn="slideInUp"
          animationOut="slideOutDown"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.isCategory}
          onBackdropPress={() => this.setState({ isCategory: false })}
          style={{ flex: 1, marginTop: 275 }}>
          <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
            <View style={{ height: height(4), alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ isCategory: false }) }}>
                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={this.state.cate_id}
                style={{ height: 45, width: 370 }}
                onValueChange={async (itemValue, itemIndex) =>
                  await this.selectCategory(itemValue, itemIndex)
                  // this.setState({ cate_id: itemValue })
                }>
                {
                  data.category.dropdown.map((item, key) => {
                    return (
                      <Picker.Item key={key} label={item.category_name} value={item.category_id} />
                    );
                  })
                }
              </Picker>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default withNavigation(CreateEvent);
// <View style={{height:height(21),flexDirection:'column-reverse',borderRadius:5,marginBottom:10,borderColor: COLOR_GRAY,borderWidth:0.5}}>
//     <RichTextEditor
//         ref={(r)=>this.richtext = r}
//         style={{ alignItems:'center',justifyContent: 'center',backgroundColor: 'transparent',}}
//         hiddenTitle={true}
//         contentPlaceholder='Description'
//         customCSS = {'body {font-size: 12px;}'}
//         editorInitializedCallback={() => this.onEditorInitialized()}
//         />
//         <RichTextToolbar
//           getEditor={() => this.richtext}
//         />
// </View>