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
import Tags from "react-native-tags";
import TagInput from 'react-native-tag-input';
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
import { withNavigation } from 'react-navigation';

@observer class DescriptionListing extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            arr: ['1', '2', '3', '4', '5'],
            is_picker: false,
            category: 'select category',
            emails: [],
            text: ''
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
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                        <Text style={{ marginVertical: 7 }}>Description<Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                            placeholder={'title'}
                            // value={this.state.location}
                            placeholderTextColor='gray'
                            underlineColorAndroid='transparent'
                            autoCorrect={true}
                            style={{ height: height(15), width: width(90), fontSize: 16, backgroundColor: 'transparent', paddingHorizontal: 10, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}
                        />
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                        <Text style={{ marginVertical: 7 }}>Video Link<Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                <Icon name="edit" size={24} color="#c4c4c4" />
                            </View>
                            <TextInput
                                // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                placeholder={'https://www.youtube.com/watch?v=f8BYB9tT0sI'}
                                // value={this.state.location}
                                placeholderTextColor='gray'
                                underlineColorAndroid='transparent'
                                autoCorrect={true}
                                style={{ height: height(6), width: width(77), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }}
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                        <Text style={{ marginVertical: 7 }}>Contact Email<Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                <Icon name="edit" size={24} color="#c4c4c4" />
                            </View>
                            <TextInput
                                // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                placeholder={'https://www.youtube.com/watch?v=f8BYB9tT0sI'}
                                // value={this.state.location}
                                placeholderTextColor='gray'
                                underlineColorAndroid='transparent'
                                autoCorrect={true}
                                style={{ height: height(6), width: width(77), fontSize: 16, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }}
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                        <Text style={{ marginVertical: 7 }}>Listing Tags / Keywords<Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={{ height: height(6), width: width(90), backgroundColor:'gray', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <Tags
                                initialText="monkey"
                                textInputProps={{
                                    placeholder: "Any type of animal"
                                }}
                                initialTags={["dog", "cat", "chicken"]}
                                onChangeTags={tags => console.log(tags)}
                                onTagPress={(index, tagLabel, event, deleted) =>
                                    console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
                                }
                                containerStyle={{ height: height(6),justifyContent: "center" }}
                                tagContainerStyle={{ height: 20, width: 20,backgroundColor:'orange' }}
                                tagTextStyle={{ width: 20,marginRight: 2, color:'green' }}
                                inputStyle={{ backgroundColor: "white" }}
                                renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                                    <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                                        <Text>{tag}</Text>
                                    </TouchableOpacity>
                                )}
                            />
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

export default withNavigation(DescriptionListing)