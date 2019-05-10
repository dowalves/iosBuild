import React, { Component } from 'react';
import { Platform, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker } from 'react-native';
import Modal from "react-native-modal";
import { CheckBox, Icon } from 'react-native-elements'
// import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_DARK_GRAY } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import styles from '../../../styles/UserDashboardStyles/EditProfileStyleSheet';
import UpperView from './UpperView';
// import { Icon } from 'react-native-paper/typings/components/List';
export default class EditProfile extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      email: '',
      phone: '',
      location: '',
      modalVisible: false,
      is_picker: false
    }
    // this.getHTML = this.getHTML.bind(this);
    // this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }
  setModalVisible = async (visible) => await this.setState({ modalVisible: visible })

  static navigationOptions = { header: null };

  componentWillMount = async () => {
    let data = store.USER_PROFILE.data;
    data.edit_profile.forEach(item => {
      if (item.value !== "") {
        item.dataValue = item.value;
        item.edit = false;
      }
    });
    console.log('after editing result ====>>>>', store.USER_PROFILE.data.edit_profile);
  }

  editProfile = async (value, item) => {
    item.dataValue = value;
    if (item.field_type_name === 'user_name') {
      store.EDIT_PROFILE.user_name = value;
    } else {
      if (item.field_type_name === 'email') {
        store.EDIT_PROFILE.email = value;
      } else {
        if (condition) {

        } else {

        }
      }
    }
    switch (item.field_type_name) {
      case item.field_type_name === 'user_name':
        store.EDIT_PROFILE.user_name = value;
        break;
      case item.field_type_name === 'email':
        store.EDIT_PROFILE.email = value;
        break;
      case item.field_type_name === 'phon_no':
        store.EDIT_PROFILE.phon_no = value;
        break;
      case item.field_type_name === 'location':
        store.EDIT_PROFILE.location = value;
        break;
      // case item.field_type_name === 'email':
      //   store.EDIT_PROFILE.email = value;
      //   break;
      default:
        break;
    }
    console.log('Obj of Edit_Profile======>>>>>>', store.EDIT_PROFILE);

  }
  searchTime = async (value) => {
    store.TIME_ZONE.forEach((item) => {
      if (item.includes(value)) {

      }
    })
  }

  render() {
    let data = store.USER_PROFILE.data;
    return (
      <View style={styles.container}>
        <ScrollView>
          <UpperView />
          <View style={styles.titleCon}>
            <Text style={styles.titleTxt}>{data.page_title_edit}</Text>
            <TouchableOpacity style={styles.changeBtnCon} onPress={() => { this.setModalVisible(true); }}>
              <Text style={styles.closeBtnTxt}>Change Password</Text>
            </TouchableOpacity>
          </View>
          {
            data.edit_profile.length > 0 ?
              data.edit_profile.map((item, key) => {
                return (
                  <View key={key}>
                    {
                      item.field_type === 'input' ?
                        <View key={key} style={styles.textInputCon}>
                          <Text style={styles.textInputLabel}>{item.main_title}</Text>
                          <TextInput
                            onChangeText={(value) => this.editProfile(value, item)}
                            placeholder={item.value === "" ? item.placeholder : item.dataValue}
                            placeholderTextColor='gray'
                            // value={ item.value !== "" ? item.value : null }
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            style={styles.textInput}
                          />
                        </View>
                        :
                        item.field_type === 'select' ?
                          <View style={[styles.textInputCon, { marginVertical: 0 }]}>
                            <Text style={styles.textInputLabel}>Time Zone</Text>
                            {
                              Platform.OS === 'android' ?
                                <View style={{ height: 45, width: 380, flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                                  <Picker
                                    selectedValue={this.state.language}
                                    style={{ height: 45, width: 370 }}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.setState({ language: itemValue })
                                    }>
                                    <Picker.Item label={item.placeholder} />
                                    {
                                      store.TIME_ZONE.map((item, key) => {
                                        return (
                                          <Picker.Item label={item} value={item} />
                                        );
                                      })
                                    }
                                  </Picker>
                                </View>
                                :
                                <TouchableOpacity style={{ height: 50, width: 340, alignItems: 'center', flexDirection: 'row', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                                  <Text style={{ marginHorizontal: 8, width: 290 }}>{item.placeholder}</Text>
                                  <Icon
                                    size={14}
                                    name='caretdown'
                                    type='antdesign'
                                    color='gray'
                                  />
                                </TouchableOpacity>
                            }
                          </View>
                          :
                          null
                    }
                  </View>
                );
              })
              :
              null
          }
          <View style={{ width: 345, alignSelf: 'center', marginTop: 5 }}>
            <Text style={{ fontSize: 15, color: COLOR_SECONDARY }}>{data.business_hours.field_text}</Text>
            <View style={{ flexDirection: 'row' }}>
              <CheckBox
                center
                title='12 Hours Format'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={false}
                onPress={() => console.warn('12')}
                containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent', marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0 }}
              />
              <CheckBox
                center
                title='24 Hours Format'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={true}
                containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent', marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0 }}
              />
            </View>
          </View>
          <View style={styles.profielBtn}>
            <Text style={styles.profielBtnTxt}>Update Profile</Text>
          </View>
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
            <View style={{ height: height(4) , alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_picker: false }) }}>
                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={this.state.language}
                style={{ height: 45, width: 370 }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ language: itemValue })
                }>
                {
                  store.TIME_ZONE.map((item, key) => {
                    return (
                      <Picker.Item key={key} label={item} value={item} />
                    );
                  })
                }
              </Picker>
            </View>
          </View>
        </Modal>
        <Modal
          animationInTiming={500}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: false })}
          style={{ flex: 1 }}>
          <View style={{ height: height(35), width: width(90), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
            <View style={{ height: height(4), alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ elevation: 3, height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ modalVisible: false }) }}>
                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: totalSize(1.8), color: 'black', marginVertical: 10, marginHorizontal: 20, fontWeight: 'bold' }}>Set Your Password</Text>
            <TextInput
              onChangeText={(value) => this.setState({ name: value })}
              placeholder='Enter Your New Password'
              placeholderTextColor={COLOR_GRAY}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={{ height: height(6), marginHorizontal: 20, padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLOR_GRAY, backgroundColor: COLOR_PRIMARY, color: COLOR_SECONDARY, fontSize: totalSize(1.6) }}
            />
            <TextInput
              onChangeText={(value) => this.setState({ name: value })}
              placeholder='Confirm New Password'
              placeholderTextColor={COLOR_GRAY}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={{ height: height(6), marginHorizontal: 20, padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLOR_GRAY, backgroundColor: COLOR_PRIMARY, color: COLOR_SECONDARY, fontSize: totalSize(1.6) }}
            />
            <TouchableOpacity style={{ elevation: 3, height: height(6), justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginVertical: 5, marginHorizontal: 20, backgroundColor: COLOR_ORANGE }} onPress={() => { this.setState({ modalVisible: false }) }}>
              <Text style={{ fontSize: totalSize(1.8), color: COLOR_PRIMARY, fontWeight: 'bold' }}>Change my Password</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}
// onEditorInitialized() {
//   this.setFocusHandlers();
//   this.getHTML();
// }
// async getHTML() {
//   const titleHtml = await this.richtext.getTitleHtml();
//   const contentHtml = await this.richtext.getContentHtml();
//   //alert(titleHtml + ' ' + contentHtml)
// }
// setFocusHandlers() {
//   this.richtext.setTitleFocusHandler(() => {
//     //alert('title focus');
//   });
//   this.richtext.setContentFocusHandler(() => {
//     //alert('content focus');
//   });
//  }
// <View style={{height:height(21),flexDirection:'column-reverse',borderRadius:5,marginBottom:10,borderColor: COLOR_GRAY,borderWidth:0.5}}>
//   <RichTextEditor
//       ref={(r)=>this.richtext = r}
//       style={{ alignItems:'center',justifyContent: 'center',backgroundColor: 'transparent',}}
//       hiddenTitle={true}
//       contentPlaceholder='Description'
//       customCSS = {'body {font-size: 12px;}'}
//       editorInitializedCallback={() => this.onEditorInitialized()}
//       />
//       <RichTextToolbar
//         getEditor={() => this.richtext}
//       />
// </View>
