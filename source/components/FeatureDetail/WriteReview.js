import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button,Image,ImageBackground,TouchableOpacity,I18nManager,
        ScrollView,TextInput,FlatList
} from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from "react-native-modal";
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY,COLOR_SECONDARY,COLOR_YELLOW } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import Claim from './Claim'
import Report from './Report'
import styles from '../../../styles/WriteReviewStyleSheet';
import FeatureDetail from './FeatureDetail';
export default class WriteReview extends Component<Props> {
  constructor( props ) {
    super(props);
    this.state = {
      name: '',
      images: [],
      reportModel: false,
      isClaimVisible: false
    }
    // I18nManager.forceRTL(false);
  }
  static navigationOptions = {
    header: null,
  };
  setModalVisible = (state,prop) => {
    if (state === 'claim' && prop === false) {
      this.setState({ reportModel: false , isClaimVisible: true })
    } else { 
      if (state === 'report') {
        this.setState({ reportModel: true , isClaimVisible: false })
      }
    }
  }
  hideModels = (state,hide) => {
    if (state === 'claim') {
      this.setState({ isClaimVisible: hide , reportModel: hide })
    } else { 
      if (state === 'report') {
        this.setState({ reportModel: hide , reportModel: hide })
      }
    }
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
    console.log('images are=',this.state.images);
    return (
      <View style={styles.container}>
        <ScrollView>
          <FeatureDetail callModel={this.setModalVisible}/>
          <View style={styles.ratingCon}>
            
          </View>
          <View style={styles.titleCon}>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 underlineColorAndroid='transparent'
                 placeholder='Place attractive title here'
                 placeholderTextColor= 'black'
                 returnKeyLabel = 'Done'
                 // returnKeyType = 'done'
                 selectionColor = 'black'
                 underlineColorAndroid='transparent'
                 autoCorrect={false}
                 style={styles.inputTxt}
                 />
          </View>
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
          {
            this.state.images.length > 0?
              <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',marginVertical:10,marginHorizontal:10,alignSelf:'center',justifyContent:'center',alignItems:'flex-start'}}>
                {this.state.images ? this.state.images.map(i => <View key={i.uri} style={{marginRight:3,marginVertical:3}}>{this.renderAsset(i)}</View>) : null}
              </View>
              :
              null
          }
          <View style={styles.reviewCon}>
            <TextInput
                 onChangeText={(value) => this.setState({name: value})}
                 underlineColorAndroid='transparent'
                 placeholder='Place your review description'
                 placeholderTextColor= 'black'
                 returnKeyLabel = 'Done'
                 // returnKeyType = 'done'
                 selectionColor = 'black'
                 underlineColorAndroid='transparent'
                 autoCorrect={false}
                 style={styles.inputTxtReview}
                 />
          </View>
          <View style={styles.reviewBtn}>
            <Text style={styles.reviewBtnTxt}> Submit Review</Text>
          </View>
        </ScrollView>
        <Modal
          animationInTiming={500}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.reportModel }
          onBackdropPress={() => this.setState({ reportModel: false }) }
          style={{ flex: 1 }}>      
            <Report hideModels={this.hideModels} /> 
        </Modal>
        <Modal
          animationInTiming={500}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.isClaimVisible}
          onBackdropPress={() => this.setState({ isClaimVisible: false }) }
          style={{ flex: 1 }}>
            <Claim hideModels={this.hideModels} />
        </Modal>
      </View>
    );
  }
}
