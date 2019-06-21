import React, { Component } from 'react';
import { Platform, Text, View, TextInput, TouchableOpacity, Picker, ScrollView, ActivityIndicator, Image } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconG from 'react-native-vector-icons/Entypo';
import IconWeb from 'react-native-vector-icons/MaterialCommunityIcons';
import IconDrop from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import { COLOR_SECONDARY, COLOR_PRIMARY, COLOR_DARK_GRAY } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
import { withNavigation } from 'react-navigation';

@observer class PricingListing extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            arr: ['1', '2', '3', '4', '5'],
            is_picker: false,
            category: 'select category'
        }
    }
    static navigationOptions = {
        header: null,
    };

    render() {
        let main_clr = store.settings.data.main_clr;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <View>
                        <Text style={{ color: COLOR_SECONDARY, fontSize: 16, marginVertical: 7, marginTop: 15 }}>Pricing</Text>
                        <View style={{ width: width(95), backgroundColor: '#eff3f6' }}>
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                                <Text style={{ width: width(61), fontSize: 14, marginVertical: 7, color: COLOR_DARK_GRAY, }}>{'Select Price Type'}<Text style={{ color: 'red' }}>*</Text></Text>
                                {
                                    Platform.OS === 'android' ?
                                        <View style={{ height: 45, width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                                            <Picker
                                                selectedValue={this.state.category}
                                                style={{ height: 45, width: width(90), backgroundColor: 'white' }}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    this.setState({ category: itemValue })
                                                }>
                                                <Picker.Item label={'select'} />
                                                {
                                                    store.TIME_ZONE.map((item, key) => {
                                                        return (
                                                            <Picker.Item key={key} label={item} value={item} />
                                                        );
                                                    })
                                                }
                                            </Picker>
                                        </View>
                                        :
                                        <TouchableOpacity style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                                            <Text style={{ marginHorizontal: 8, width: width(78) }}>{this.state.category}</Text>
                                            <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                        </TouchableOpacity>
                                }
                            </View>
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                                <Text style={{ width: width(61), fontSize: 14, marginVertical: 7, color: COLOR_DARK_GRAY, }}>{'Listing Currency'}<Text style={{ color: 'red' }}>*</Text></Text>
                                {
                                    Platform.OS === 'android' ?
                                        <View style={{ height: 45, width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                                            <Picker
                                                selectedValue={this.state.category}
                                                style={{ height: 45, width: width(90), backgroundColor: 'white' }}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    this.setState({ category: itemValue })
                                                }>
                                                <Picker.Item label={'select'} />
                                                {
                                                    store.TIME_ZONE.map((item, key) => {
                                                        return (
                                                            <Picker.Item key={key} label={item} value={item} />
                                                        );
                                                    })
                                                }
                                            </Picker>
                                        </View>
                                        :
                                        <TouchableOpacity style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                                            <Text style={{ marginHorizontal: 8, width: width(78) }}>{this.state.category}</Text>
                                            <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                        </TouchableOpacity>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 10 }}>
                                <View style={{ marginVertical: 5, marginTop: 10 }}>
                                    <Text style={{ marginVertical: 7 }}>Price From<Text style={{ color: 'red' }}>*</Text></Text>
                                    <TextInput
                                        // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                        placeholder={'title'}
                                        // value={this.state.location}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={{ height: height(6), width: width(44), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'white', paddingHorizontal: 10, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}
                                    />
                                </View>
                                <View style={{ marginVertical: 5, marginTop: 10, marginLeft: 10 }}>
                                    <Text style={{ marginVertical: 7 }}>Price From<Text style={{ color: 'red' }}>*</Text></Text>
                                    <TextInput
                                        // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                        placeholder={'title'}
                                        // value={this.state.location}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={{ height: height(6), width: width(44), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'white', paddingHorizontal: 10, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginVertical: 15, width: width(95), backgroundColor: '#eff3f6' }}>
                        <Text style={{ color: COLOR_SECONDARY, fontSize: 16, marginVertical: 10, marginHorizontal: 10 }}>Select Your Business Hours</Text>
                        <View style={{ flexDirection: 'row', width: width(90) }}>
                            <CheckBox
                                title='N/A'
                                checkedColor={main_clr}
                                textStyle={{ marginRight: 0, marginLeft: 3 }}
                                containerStyle={{ marginRight: 0, marginLeft: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                size={18}
                                checked={true}
                            // onPress={() => { this.props.fun() }}
                            />
                            <CheckBox
                                title='Open 24/7'
                                checkedColor={main_clr}
                                textStyle={{ marginRight: 0, marginLeft: 3 }}
                                containerStyle={{ marginRight: 0, marginLeft: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                size={18}
                                checked={true}
                            />
                            <CheckBox
                                title='Selective Hours'
                                checkedColor={main_clr}
                                textStyle={{ marginRight: 0, marginLeft: 3 }}
                                containerStyle={{ marginRight: 0, marginLeft: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                size={18}
                                checked={true}
                            // onPress={() => { this.props.fun() }}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={{ color: COLOR_SECONDARY, fontSize: 16, marginVertical: 7, marginTop: 15 }}>Social Media Addresses</Text>
                        <View style={{ width: width(95), backgroundColor: '#eff3f6' }}>
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                                <View style={{ height: height(6), width: width(90), marginTop: 5,flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6,backgroundColor:'white' }}>
                                    <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                        <Icon name="facebook" size={22} color="#c4c4c4" />
                                    </View>
                                    <TextInput
                                        // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                        placeholder={'facebook'}
                                        // value={this.state.location}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={{ height: height(6), width: width(77), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }}
                                    />
                                </View>
                                <View style={{ height: height(6), width: width(90), marginTop: 10,flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6,backgroundColor:'white' }}>
                                    <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                        <Icon name="twitter" size={22} color="#c4c4c4" />
                                    </View>
                                    <TextInput
                                        // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                        placeholder={'twitter'}
                                        // value={this.state.location}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={{ height: height(6), width: width(77), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }}
                                    />
                                </View>
                                <View style={{ height: height(6), width: width(90), marginTop: 10,flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6,backgroundColor:'white' }}>
                                    <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                        <IconG name="google-" size={22} color="#c4c4c4" />
                                    </View>
                                    <TextInput
                                        // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                        placeholder={'google'}
                                        // value={this.state.location}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={{ height: height(6), width: width(77), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }}
                                    />
                                </View>
                                <View style={{ height: height(6), width: width(90), marginTop: 10,flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6,backgroundColor:'white' }}>
                                    <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                        <IconG name="linkedin" size={20} color="#c4c4c4" />
                                    </View>
                                    <TextInput
                                        // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                        placeholder={'linkedin'}
                                        // value={this.state.location}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={{ height: height(6), width: width(77), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }}
                                    />
                                </View>
                                <View style={{ height: height(6), width: width(90), marginTop: 10,flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6,backgroundColor:'white' }}>
                                    <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                        <Icon name="youtube" size={22} color="#c4c4c4" />
                                    </View>
                                    <TextInput
                                        // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                        placeholder={'youtube'}
                                        // value={this.state.location}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={{ height: height(6), width: width(77), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }}
                                    />
                                </View>
                                <View style={{ height: height(6), width: width(90), marginTop: 10,flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6,backgroundColor:'white' }}>
                                    <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                        <Icon name="instagram" size={24} color="#c4c4c4" />
                                    </View>
                                    <TextInput
                                        // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                        placeholder={'instagram'}
                                        // value={this.state.location}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={{ height: height(6), width: width(77), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }}
                                    />
                                </View>
                            </View>
                        </View>
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
                        <View style={{ height: height(4), alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_picker: false }) }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Picker
                                selectedValue={this.state.timezone}
                                style={{ height: 45, width: 370 }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ timezone: itemValue })
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
            </View>
        );
    }
}

export default withNavigation(PricingListing)