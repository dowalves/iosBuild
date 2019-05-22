import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import store from '../../Stores/orderStore';
import { withNavigation } from 'react-navigation';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

class MyEventComp extends Component<Props> {

    render = () => {
        let item = this.props.item;
        let data = store.MY_EVENTS.data;
        return (
            <TouchableOpacity style={{ elevation: 5, marginVertical: 5, borderRadius: 5, marginHorizontal: 5, width: width(95), shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: 2, alignSelf: 'center', backgroundColor: COLOR_PRIMARY, flexDirection: 'row' }}
                onPress={() => this.props.navigation.push('EventDetail', { event_id: item.event_id, title: item.event_title, headerColor: store.settings.data.navbar_clr })}
            >
                <View style={{ marginVertical: 2, width: width(36), justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: item.image }} style={{ height: 110, width: width(35), alignSelf: 'center', borderRadius: 5 }} />
                </View>
                <View style={{ width: width(52), justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 0, marginVertical: 5 }}>
                    <Text style={{ marginHorizontal: 7, fontSize: 11, marginBottom: 0 }} >{item.event_category_name}</Text>
                    <Text style={{ marginHorizontal: 7, fontWeight: 'bold', color: COLOR_SECONDARY, marginBottom: 5, fontSize: 13 }} >{item.event_title}</Text>
                    <View style={{ flexDirection: 'row', marginHorizontal: 7, marginBottom: 3, alignItems: 'center' }}>
                        <Image source={require('../../images/clock-circular-outline.png')} style={{ height: height(2), width: width(5), resizeMode: 'contain' }} />
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: COLOR_SECONDARY, marginHorizontal: 3 }}>{data.from}</Text>
                        <Text style={{ fontSize: 11 }}>{item.event_start_date}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 7, marginBottom: 3, alignItems: 'center' }}>
                        <Image source={require('../../images/calendar.png')} style={{ height: height(2), width: width(5), resizeMode: 'contain' }} />
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: COLOR_SECONDARY, marginHorizontal: 3 }}>{data.to}</Text>
                        <Text style={{ fontSize: 11 }}>{item.event_end_date}</Text>
                    </View>
                    <View style={{ width: width(58), flexDirection: 'row', marginHorizontal: 7, marginBottom: 3, alignItems: 'center' }}>
                        <Image source={require('../../images/paper-plane.png')} style={{ height: height(2), width: width(5), resizeMode: 'contain' }} />
                        <Text style={{ height: height(2), fontWeight: 'bold', fontSize: 12, color: COLOR_SECONDARY, marginHorizontal: 3 }}>{data.venue}</Text>
                        <Text style={{ fontSize: 11, flexWrap: 'wrap', width: width(38) }}>{item.event_loc}</Text>
                    </View>
                </View>
                <View style={{ height: 100, width: 25, alignSelf: 'center' }}>
                    <Menu>
                        <MenuTrigger>
                            <Image source={require('../../images/menu.png')} style={{ height: height(3.5), width: width(5), resizeMode: 'contain' }} />
                        </MenuTrigger>
                        <MenuOptions>
                            {
                                this.props.options === 'published' ?
                                    <MenuOption onSelect={async()=>{ await this.props.upDateGet(item.event_id)}}>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Image source={require('../../images/pencil-edit-button.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                            <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>Edit</Text>
                                        </View>
                                    </MenuOption>
                                    :
                                    null
                            }
                            <MenuOption>
                                <View style={{ flexDirection: 'row', }}>
                                    <Image source={require('../../images/x-button.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>Delete</Text>
                                </View>
                            </MenuOption>
                            <MenuOption>
                                <View style={{ flexDirection: 'row', }}>
                                    <Image source={require('../../images/error-triangle.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>Expired</Text>
                                </View>
                            </MenuOption>
                            <MenuOption>
                                <View style={{ flexDirection: 'row', }}>
                                    <Image source={require('../../images/google-analytics.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>Reactive</Text>
                                </View>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            </TouchableOpacity>
        );
    }
}
export default withNavigation(MyEventComp);