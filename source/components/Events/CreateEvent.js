import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button,Image,ImageBackground,TouchableOpacity,I18nManager,
        ScrollView,TextInput,FlatList
} from 'react-native';
import MapView, { Polyline,Marker,Callout,PROVIDER_GOOGLE } from 'react-native-maps';
import { width, height, totalSize } from 'react-native-dimension';
import ImagePicker from 'react-native-image-crop-picker';
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import DatePicker from 'react-native-datepicker';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY,COLOR_SECONDARY,COLOR_DARK_GRAY } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import styles from '../../../styles/Events/CreateEventStyleSheet';
import EventsUpperView from './EventsUpperView';
export default class CreateEvent extends Component<Props> {
  constructor( props ) {
    super(props);
    this.state = {
      dates: '',
      images: []
    }
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
    I18nManager.forceRTL(false);
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

  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      //alert('content focus');
    });
   }
  static navigationOptions = {
    header: null,
  };
  datePicker(){
    var date = new Date().toDateString();
    return(
      <DatePicker
        style={{width: 200}}
        date={this.state.date}
        mode="date"
        androidMode= 'spinner' //spinner
        showIcon={true}
        placeholder= {date}
        duration={400}
        format="DD-MM-YYYY"
        minDate= {date}
        maxDate= "1-12-2030"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        disabled={false}
        is24Hour={false}
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 10,
            marginTop: 6,
            height: 20,
            width:20
          },
          dateInput: {
            marginLeft: 0,
            borderWidth:0,
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({date: date})}}
      />
    )
  }
  multiImagePicker(){
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
    }).then(images => {
      this.setState({
        image: null,
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        })
      }).catch(e => alert(e));
      // console.log(images);
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
      <ImageBackground source={image} style={{height:height(10),width:width(20)}}>
        <TouchableOpacity style={{height:height(3.5),width:width(6),justifyContent:'center',alignItems:'center',backgroundColor:'rgba(255,255,255,0.9)',alignSelf:'flex-end'}}>
          <Text style={{fontSize:totalSize(2),color:'red'}}>X</Text>
        </TouchableOpacity>
      </ImageBackground>
      )
  }
  render() {
    let region = {
      latitude:       31.582045,
      longitude:      74.329376,
      latitudeDelta:  0.00922*1.5,
      longitudeDelta: 0.00421*1.5
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <EventsUpperView />
          <View style={styles.titleCon}>
            <Text style={styles.titleTxt}>Create Event</Text>
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>Event Title</Text>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 placeholder='Event Title'
                 placeholderTextColor= 'gray'
                 underlineColorAndroid='transparent'
                 autoCorrect={false}
                 style={styles.textInput}
                 />
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>Event Tagline</Text>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 placeholder='e.g. Continental Food Festival'
                 placeholderTextColor= 'gray'
                 underlineColorAndroid='transparent'
                 autoCorrect={false}
                 style={styles.textInput}
                 />
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>Select Category</Text>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 underlineColorAndroid='transparent'
                 placeholder = 'Category'
                 placeholderTextColor='gray'
                 underlineColorAndroid='transparent'
                 autoCorrect={false}
                 style={styles.textInput}
                 />
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>Phone No</Text>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 placeholder = '+92 333 9933999'
                 placeholderTextColor='gray'
                 keyboardType='phone-pad'
                 underlineColorAndroid='transparent'
                 autoCorrect={false}
                 style={styles.textInput}
                 />
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>Contact Email</Text>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 placeholder = 'abc@gamil.com'
                 placeholderTextColor='gray'
                 underlineColorAndroid='transparent'
                 autoCorrect={false}
                 style={styles.textInput}
                 />
          </View>
          <View style={styles.aboutInputCon}>
            <Text style={styles.textInputLabel}>Description</Text>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 placeholder = 'Description'
                 placeholderTextColor='gray'
                 underlineColorAndroid='transparent'
                 autoCorrect={false}
                 style={styles.aboutInputText}
                 />
          </View>
          <View style={styles.textInputCon}>
            <View style={{height:height(2),alignItems:'center',flex:1,flexDirection:'row'}}>
              <Text style={styles.dateLabel}>Event Start Date</Text>
              <Text style={styles.dateLabel}>Event End Date</Text>
            </View>
            <View style={{height:height(6.5),justifyContent:'center',flex:1,flexDirection:'row'}}>
              <View style={{height:height(6),flex:1,borderRadius:3,borderColor:'COLOR_GRAY',marginRight:2,borderWidth:0.3}}>
                {this.datePicker()}
              </View>
              <View style={{height:height(6),flex:1,borderRadius:3,borderColor:'COLOR_GRAY',marginLeft:2,borderWidth:0.3}}>
                {this.datePicker()}
              </View>
            </View>
          </View>
          <View style={{flex:1,marginHorizontal:15,marginVertical:5}}>
            <Text style={styles.textInputLabel}>Listing Gallery</Text>
            <View style={styles.cameraCon}>
              <TouchableOpacity style={styles.cameraSubCon} onPress={()=>this.multiImagePicker()}>
                <Image source={require('../../images/camera.png')} style={styles.cameraIcon} />
                <Text style={styles.cameraBtnTxt}>Select Pics</Text>
              </TouchableOpacity>
              <View style={styles.tickBtnCon}>
                {
                  this.state.images.length === 0?
                    <Image source={require('../../images/success.png')} style={{height:height(10),width:width(20),resizeMode:'contain'}} />
                    :
                    <Image source={require('../../images/successChecked.png')} style={{height:height(10),width:width(20),resizeMode:'contain'}} />
                }
              </View>
            </View>
          </View>
          <View style={{flex:1,marginHorizontal:15,flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-start',alignItems:'center'}}>
            {
              this.state.images.length > 0?
                <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',marginVertical:10,marginHorizontal:10,alignSelf:'center',justifyContent:'flex-start',alignItems:'flex-start'}}>
                  {this.state.images ? this.state.images.map(i => <View key={i.uri} style={{marginRight:3,marginVertical:3}}>{this.renderAsset(i)}</View>) : null}
                </View>
                :
                null
            }
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>Event Location</Text>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 placeholder = 'Johar Town F-block Lahore'
                 placeholderTextColor='gray'
                 underlineColorAndroid='transparent'
                 autoCorrect={true}
                 style={styles.textInput}
                 />
          </View>
          <View style={styles.mapCon}>
            <MapView
              ref = {(ref)=>this.mapView=ref}
              zoomEnabled={true}
              zoomControlEnabled={true}
              showsBuildings={true}
              showsIndoors={true}
              provider={PROVIDER_GOOGLE}
              showsMyLocationButton={true}
              showsUserLocation={true}
              followsUserLocation={true}
              minZoomLevel={5}
              maxZoomLevel = {20}
              mapType = {"standard"}
              loadingEnabled = {true}
              loadingIndicatorColor = {'#ffffff'}
              loadingBackgroundColor = 'gray'
              moveOnMarkerPress={false}
              animateToRegion = {{
                latitude:       31.582045,
                longitude:      74.329376,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5
                    }, 5000}
              style={styles.map}
              region={region}
              // onRegionChange={this.onRegionChange.bind(this)}
              >
                  <MapView.Marker
                      coordinate={
                      { latitude: 31.582045, longitude: 74.329376 }
                      }
                      title={'Current location'}
                      description={'I am here'}
                      pinColor={'#3edc6d'}
                      />
            </MapView>
          </View>
          <View style={styles.textInputCon}>
            <View style={{height:height(2),alignItems:'center',flex:1,flexDirection:'row'}}>
              <Text style={styles.dateLabel}>Longitude</Text>
              <Text style={styles.dateLabel}>Latitude</Text>
            </View>
            <View style={{height:height(6.5),justifyContent:'center',flex:1,flexDirection:'row'}}>
              <View style={{height:height(6),flex:1,borderRadius:3,borderColor:'COLOR_GRAY',marginRight:2,borderWidth:0.3,justifyContent:'center'}}>
                <TextInput
                  value="31.582045"
                  keyboardType="numeric"
                  style={{fontSize:totalSize(1.4),color:'gray'}}
                />
              </View>
              <View style={{height:height(6),flex:1,borderRadius:3,borderColor:'COLOR_GRAY',marginLeft:2,borderWidth:0.3,justifyContent:'center'}}>
                <TextInput
                  value="31.582045"
                  keyboardType="numeric"
                  style={{fontSize:totalSize(1.4),color:'gray'}}
                />
              </View>
            </View>
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>Releated Listing (Optional)</Text>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 underlineColorAndroid='transparent'
                 placeholder = 'Category'
                 placeholderTextColor='gray'
                 underlineColorAndroid='transparent'
                 autoCorrect={false}
                 style={styles.textInput}
                 />
          </View>
          <View style={styles.profielBtn}>
            <Text style={styles.profielBtnTxt}>Update Profile</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
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
