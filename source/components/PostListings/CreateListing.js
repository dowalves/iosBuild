import React, { Component } from 'react';
import { Platform, Text, View, I18nManager, TextInput, TouchableOpacity, Picker, ScrollView, ActivityIndicator, Image } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import IconDrop from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import { COLOR_SECONDARY, COLOR_PRIMARY, COLOR_SECTIONS, COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
import { withNavigation } from 'react-navigation';
import Api from '../../ApiController/ApiController';
import Stores from '../../Stores';
import { color, cos } from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
import { array } from 'prop-types';
import ModalDropdown from 'react-native-modal-dropdown';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


const inputSize = totalSize(1.5);
@observer class CreateListing extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {

            allowStateUpdate: true,
            keyValue: [],
            stateRefresher: false,
            loading: false,
            arr: ['1', '2', '3', '4', '5'],
            is_picker: false,
            title: '',
            cate_id: '',
            cate_name: 'select category',
            amenities: [],
            inner_dynamic_fields: [],
            phone: '',
            weburl: '',
            textfield_title: " ",
            checked: [],
            picker_value: [],
            picker_selected_value: "",
            textFieldData: {},
            selected_items: [],
            dynamic_fields: [],
            myselectedValue: [],
            finalSelectedVal: {},
            selectedItemValue: {},
            dropdownValue: [],
            selectedValueRadio: {},
            radioBoxData: {},
            dropdownData: {},
            checkBoxData: {},
            testdropdown: [],
            is_update: false

        }
    }
    static navigationOptions = {
        header: null,
    };

    componentWillMount = async () => {
        let data = store.GET_LISTING.data.create_listing;
        if (data.category.dropdown.length > 0 && data.category.value !== "") {
            await this.getAmenities(data.category.value)


        }
        await this.setState({
            title: data.title.value,
            cate_id: data.category.value,
            cate_name: data.category.name || data.category.placeholder,
            phone: data.phone.value,
            weburl: data.weburl.value,
            is_update: store.GET_LISTING.data.is_updated_key

        })
    }
    selectCategory = (itemValue) => {
        let data = store.GET_LISTING.data.create_listing;
        this.setState({ cate_id: itemValue })
        data.category.dropdown.forEach(item => {
            if (item.category_id === itemValue) {
                this.setState({ cate_name: item.category_name })
            }
        });
    }


    getAmenities = async (cate_id) => {
        if (cate_id !== '') {
            this.setState({ cate_id: cate_id, loading: true, is_picker: Platform.OS === 'ios' ? false : false })
            let response = await ApiController.post('get-amenities', { category_id: cate_id, listing_id: store.LISTING_UPDATE ? store.LIST_ID : '' });
            //  console.log('ameninites====>>>',response);


            if (response.success) {

                store.AMENITIES = response.data;
                store.DYNAMIC_FIELDS.INNER_DYNAMIC_FIELDS = response.data


                if (store.LISTING_UPDATE) {
                    store.AMENITIES.amenities.forEach(item => {
                        if (item.status) {
                            item.checkStatus = true;
                            item.added = true;
                            this.state.amenities.push(item.id);
                        } else {
                            item.checkStatus = false;
                            item.added = false;
                        }
                    })
                } else {
                    store.AMENITIES.amenities.forEach(item => {
                        item.checkStatus = false;
                        item.added = false;
                    })
                }

                this.setState({ loading: false })
            } else {
                store.AMENITIES.amenities = [];
                this.setState({ loading: false })
            }

            //if (store.DYNAMIC_FIELDS.INNER_DYNAMIC_FIELDS != []) {
            //store.DYNAMIC_FIELDS.INNER_DYNAMIC_FIELDS.dynamic_fields.forEach(item => {


            // if(item.field_type_name === "checkbox"){
            // this.checkBoxFields(item)
            // this.state.inner_dynamic_fields.push();
            // item = item.inner_dynamic_fields
            // // }   
            // if (item.status) {
            //     item.checkStatus = true;
            //     item.added = true;
            //     this.state.selected_items.push(item.field_name);
            //    // console.log("item id", item.id)

            // } else {
            //     item.checkStatus = false;
            //     item.added = false;
            // }
            // else {

            //     store.DYNAMIC_FIELDS.INNER_DYNAMIC_FIELDS.dynamic_fields.forEach(item => {
            //         item.checkStatus = false;
            //         item.added = false;
            //     })
            // }




            // {
            // // this.checkBoxFields(item)
            // //      this.state.inner_dynamic_fields.push();
            //  }

            // if (item.status) {
            //     item.checkStatus = true;
            //     item.added = true;
            //     this.state.inner_dynamic_fields.push(item.field_name);

            // } else {
            //     item.checkStatus = false;
            //     item.added = false;
            // }
            // })
            //}

        }


    }


    isOptionSelected(item, key, keyValue) {


        this.state.allowStateUpdate = false;
        var my_state = this.state.selectedItemValue;

        var saveValue = this.state.finalSelectedVal;

        if (my_state[item.id] != undefined) {
            var is_checked = my_state[item.id] ? false : true;
            var stateCurrentValue = my_state;
            stateCurrentValue[item.id] = is_checked;
        } else {
            var is_checked = item.status ? false : true;
            var stateCurrentValue = my_state ? my_state : item.status;
            stateCurrentValue[item.id] = is_checked;
        }

        if (is_checked === true) {
            if (saveValue[keyValue] !== undefined) {

                saveValue[keyValue].push(item.field_heading);
            }
            else {
                saveValue[keyValue] = [item.field_heading];

            }
            this.state.checkBoxData = saveValue;

        } else {
            if (this.state.checkBoxData[keyValue] !== undefined) {
                var index = this.state.checkBoxData[keyValue].indexOf(item.field_heading);
                this.state.checkBoxData[keyValue].splice(index, 1);
                this.setState({ stateRefresher: false })
            }
        }

        this.setState({

            myselectedValue: this.state.checkBoxData,
            finalSelectedVal: this.state.checkBoxData,
            selectedItemValue: stateCurrentValue,

        });
    }


    handleTextField = (value, index, key) => {

        var TextField = {
            ...this.state.textFieldData
        }
        TextField[key] = value
        this.setState({
            textFieldData: TextField
        })

    };

    handledropDownData = (item) => {
        var data_array = [];
        item.inner_dynamic_fields.map((item, key) => {
            data_array[key] = item.dropdown_values
            //data_array[key] = { label: item.text, value: item.value }
            this.state.dropdownValue.push(item.text)
        });

        return data_array;

    }


    handleRadioButton = (item) => {
        this.state.allowStateUpdate = false;
        var radioVal = { ...this.state.selectedValueRadio }
        radioVal[item.field_name] = item.field_heading
        this.state.selectedValueRadio = radioVal
        this.setState({
            radioBoxData: radioVal,

        });
    }
    setValuesInRadioBoxState(items) {
        if (this.state.allowStateUpdate === true) {
            items.inner_dynamic_fields.map((item,) => {
                if (item.status === true) {
                    this.state.selectedValueRadio[item.field_name] = item.field_heading

                }
            });
        }
    }
    setValuesInCheckBoxState(items) {
        if (this.state.allowStateUpdate === true) {
            items.inner_dynamic_fields.map((item,) => {
                if (item.status === true) {
                    this.state.selectedItemValue[item.id] = item.status

                }

            });
        }
    }
    setValuesInDropdown(item) {
        var data_array = [];
        if (this.state.allowStateUpdate === true && this.state.is_update === true) {
            item.inner_dynamic_fields.map((item) => {
                if (item.status === true) {
                    data_array = item.dropdown_values

                }
            });
            return data_array;
        }
        else {
            return item.placeholder
        }


    }

    selectAmenities = async (amenity) => {
        store.AMENITIES.amenities.forEach(item => {
            if (item.checkStatus === false) {

                if (amenity.id === item.id) {

                    item.checkStatus = !item.checkStatus;

                    this.state.amenities.push(item.id);
                    this.setState({ stateRefresher: false })
                }
            } else {
                if (amenity.id === item.id) {
                    item.checkStatus = false;
                    var index = this.state.amenities.indexOf(item.id);
                    this.state.amenities.splice(index, 1);
                    this.setState({ stateRefresher: false })
                }
            }
        });
    }


    createListing = async () => {
        store.LISTING_OBJ.title = this.state.title;
        store.LISTING_OBJ.category_id = this.state.cate_id;
        store.LISTING_OBJ.contact_no = this.state.phone;
        store.LISTING_OBJ.weburl = this.state.weburl;
        store.LISTING_OBJ.cat_features = this.state.amenities.join();
        store.LISTING_OBJ.dynamic_fields = this.state.dynamic_fields;
        //console.log('storeCreate',store.LISTING_OBJ);

    }
    DynamicFieldView = () => {
        let main_clr = store.settings.data.main_clr;

        return (
            store.DYNAMIC_FIELDS.INNER_DYNAMIC_FIELDS.has_custom_fields ?

                store.DYNAMIC_FIELDS.INNER_DYNAMIC_FIELDS.dynamic_fields.map((item, key) => {
                    if (item.field_type_name === "checkbox") {

                        return (
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, }}>

                                {
                                    this.state.loading ?
                                        <View style={{ width: width(90), alignItems: 'center' }}>

                                            {/* <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} /> */}
                                        </View>
                                        :

                                        <View style={{ alignItems: 'flex-start' }}>
                                            <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{item.title}</Text>
                                            <View></View>
                                            <View style={{ width: width(90), flexDirection: 'row', borderRadius: 4, backgroundColor: COLOR_SECTIONS }}>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' }}>
                                                    {
                                                        this.setValuesInCheckBoxState(item, item.field_name),
                                                        item.inner_dynamic_fields !== [] ?
                                                            item.inner_dynamic_fields.map((item, key) => {
                                                                return (
                                                                    <View style={{ width: width(45) }}>
                                                                        <CheckBox
                                                                            key={key}
                                                                            title={item.field_heading}
                                                                            checkedColor={main_clr}
                                                                            containerStyle={{ marginRight: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                                                            size={18}
                                                                            checked={this.state.selectedItemValue[item.id] === true ? true : false}
                                                                            onPress={() => { this.isOptionSelected(item, key, item.field_name) }}
                                                                        />
                                                                    </View>
                                                                );
                                                            }) : null}
                                                </View>
                                            </View>
                                        </View>
                                }
                            </View>
                        )
                    }
                    else if (item.field_type_name === "select") {

                        return (


                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, }}>
                                {
                                    this.state.loading ?
                                        <View style={{ width: width(90), alignItems: 'center' }}>


                                        </View>
                                        :

                                        <View style={{ alignItems: 'flex-start', }}>
                                            <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{item.title}</Text>

                                            <View style={{ flexDirection: 'column', flexWrap: 'wrap', alignSelf: 'center', }}>

                                                <View style={{ width: width(90), }}>


                                                    {

                                                        <>

                                                            <View >

                                                                <ModalDropdown
                                                                    renderRightComponent={() => {
                                                                        return (
                                                                            <View style={{ position: "absolute", marginStart: "95%" }}>
                                                                                <IconDrop style={{ justifyContent: "flex-end", alignItems: "flex-end" }} name="md-arrow-dropdown" size={22} />
                                                                            </View>
                                                                        )
                                                                    }
                                                                    }
                                                                    onDropdownWillShow={() => {
                                                                        var keyVal = item.field_name;
                                                                        this.state.keyValue = keyVal;
                                                                        return keyVal;
                                                                    }}
                                                                    renderSeparator={() => {
                                                                        return (
                                                                            <View style={{
                                                                                width: 0,
                                                                                height: 0,
                                                                            }} />
                                                                        );
                                                                    }}
                                                                    options={this.handledropDownData(item)}
                                                                    style={{ borderWidth: 1, borderRadius: 4, padding: 12, borderColor: "#c4c4c4", }}
                                                                    textStyle={{ fontSize: 14, color: "gray" }}
                                                                    dropdownStyle={{ fontSize: 14, color: "gray", marginStart: -13, width: "90%", maxHeight: 110, borderWidth: 1, borderColor: "#c4c4c4", }}
                                                                    defaultValue={this.setValuesInDropdown(item)}
                                                                    onSelect={(index, value) => {
                                                                        var selectedItems = this.state.dropdownData;
                                                                        selectedItems[this.state.keyValue] = value
                                                                        this.setState({
                                                                            dropdownData: selectedItems,
                                                                        });
                                                                    }}>

                                                                </ModalDropdown>
                                                            </View>
                                                            {/*   
                                                            <DropDownPicker
                                                            onOpen={() => {
                                                                var keyVal = item.field_name;
                                                                this.state.keyValue = keyVal;
                                                                return keyVal;
                                                              }}
                                                               zIndex={99999}
                                                                key={key}
                                                                items={this.handledropDownData(item)}
                                                                containerStyle={{ height: 50, }}
                                                                style={{ backgroundColor: "transparent" , }}
                                                                itemStyle={{ justifyContent: 'flex-start',}}
                                                                placeholderStyle={{ color: 'gray' }}
                                                                selectedLabelStyle={{ color: 'gray' }}
                                                                dropDownStyle={{ backgroundColor: "fff",zIndex:50000}}
                                                                onChangeItem={(item) => {                                                                    
                                                                var selectedItems = this.state.choices;                       
                                                                (selectedItems[this.state.keyValue] = item.label)
                                                                 this.setState({
                                                                        choices: selectedItems,
                                                                    });
                                                                    // this.state.finalChoices = this.state.choices.filter(function (element) {
                                                                    //     return element !== undefined;
                                                                    // })
                                                                }}
                                                            /> */}
                                                            {/* <View 
                                                             style={{
                                                                  flexDirection:'row',
                                                                  alignItems:'center',
                                                                  justifyContent:'flex-end',
                                                                  position:'absolute',
                                                                  height:'100%',
                                                                  width:'100%',
                                                                  backgroundColor:'transparent',
                                                                  paddingEnd:15,
                                                               
                                                             }}>
                                                             <IconDrop name="md-arrow-dropdown" size={24} color="gray" />
                                                                </View> */}



                                                        </>


                                                        // Platform.OS === 'android' ?






                                                        //     <View style={{ height: height(6), width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>


                                                        //         <Picker

                                                        //             //  selectedValue={parseInt(this.state)}
                                                        //             style={{ height: height(6), width: width(90), color: 'gray' }}
                                                        //             onValueChange={ (itemvale, itemIndex) => this.handlePcikerValue(itemvale, itemIndex)}
                                                        //             selectedValue={this.state.picker_selected_value}
                                                        //             >

                                                        //             {
                                                        //                 item.inner_dynamic_fields.map((item, key) => {
                                                        //                     //console.log("I am iption", selectItem, selectItem.text, selectItem.dropdown_values)
                                                        //                     return (
                                                        //                         <Picker.Item   key={key} label={item.text} value={item.dropdown_values} />
                                                        //                     );
                                                        //                 })
                                                        //             }

                                                        //         </Picker>
                                                        //     </View>
                                                        //     :
                                                        //     <TouchableOpacity style={{ height: height(6), width: width(90), alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                                                        //         <View style={{ width: width(80), alignItems: 'flex-start' }}>
                                                        //             <Text style={{ marginHorizontal: 8, fontSize: 15, color: COLOR_SECONDARY }}>{item.text}</Text>
                                                        //         </View>
                                                        //         <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                                        //     </TouchableOpacity>
                                                    }


                                                </View>
                                            </View>

                                        </View>
                                }
                            </View>


                        )

                    }
                    else if (item.field_type_name === "radio") {

                        return (
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>

                                {
                                    this.state.loading ?
                                        <View style={{ width: width(90), alignItems: 'center' }}>


                                        </View>
                                        :

                                        <View style={{ alignItems: 'flex-start' }}>
                                            <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{item.title}</Text>

                                            <View style={{ width: width(90), flexDirection: 'row', borderRadius: 4, backgroundColor: COLOR_SECTIONS }}>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' }}>
                                                    {

                                                        this.setValuesInRadioBoxState(item, item.field_name),

                                                        item.inner_dynamic_fields !== [] ?
                                                            item.inner_dynamic_fields.map((item, key) => {
                                                                return (
                                                                    <View style={{ width: width(45) }}>

                                                                        <CheckBox

                                                                            key={key}
                                                                            title={item.field_heading}
                                                                            checkedColor={main_clr}
                                                                            checkedIcon='dot-circle-o'
                                                                            uncheckedIcon='circle-o'
                                                                            containerStyle={{ marginRight: 0, borderWidth: 0, backgroundColor: 'transparent', }}
                                                                            size={18}
                                                                            checked={(this.state.selectedValueRadio[item.field_name] === item.field_heading) ? true : false}
                                                                            onPress={() => this.handleRadioButton(item, key)}

                                                                        />
                                                                    </View>
                                                                )
                                                            })

                                                            :

                                                            null

                                                    }

                                                </View>
                                            </View>
                                        </View>
                                }
                            </View>
                        )

                    }
                    else if (item.field_type_name === "textfield") {
                        return (
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                                {
                                    this.state.loading ?
                                        <View style={{ width: width(90), alignItems: 'center' }}>


                                        </View>
                                        :

                                        <View style={{ alignItems: 'flex-start' }}>
                                            <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{item.title}</Text>

                                            <View style={{ flexDirection: 'column', flexWrap: 'wrap', alignSelf: 'center' }}>

                                                <View style={{ width: width(90) }}>



                                                    <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                                        <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                                            <Icon name="edit" size={24} color="#c4c4c4" />
                                                        </View>
                                                        <TextInput
                                                            onChangeText={(value) => this.handleTextField(value, key, item.field_name)}
                                                            placeholder={this.state.textfield_title}
                                                            scrollEnabled={false}
                                                            defaultValue={item.field_value}
                                                            placeholderTextColor='gray'
                                                            underlineColorAndroid='transparent'
                                                            autoCorrect={true}
                                                            style={[{ height: height(6), width: width(77), fontSize: inputSize, backgroundColor: 'transparent', paddingHorizontal: 10 }, I18nManager.isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                                                        />
                                                    </View>



                                                </View>
                                            </View>

                                        </View>
                                }
                            </View>


                        )

                    }
                    //new view code ends here
                }
                )
                :
                null


        )

    }

    render() {
        this.createListing()
        let main_clr = store.settings.data.main_clr;
        let data = store.GET_LISTING.data.create_listing;
        this.state.dynamic_fields = [
            this.state.dropdownData,
            this.state.radioBoxData,
            this.state.textFieldData,
            this.state.checkBoxData
        ]
        console.log("Final data again", this.state.is_update)

        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.title.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                <Icon name="edit" size={24} color="#c4c4c4" />
                            </View>
                            <TextInput
                                onChangeText={(value) => { this.setState({ title: value }) }}
                                placeholder={data.title.placeholder}
                                scrollEnabled={false}
                                value={this.state.title}
                                placeholderTextColor='gray'
                                underlineColorAndroid='transparent'
                                autoCorrect={true}
                                style={[{ height: height(6), width: width(77), fontSize: inputSize, backgroundColor: 'transparent', paddingHorizontal: 10 }, I18nManager.isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 14, marginVertical: 7, color: 'black', fontWeight: 'bold' }}>{data.category.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                        {
                            Platform.OS === 'android' ?
                                <View style={{ height: height(6), width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                                    <Picker

                                        selectedValue={parseInt(this.state.cate_id)}
                                        style={{ height: height(6), width: width(90), color: 'gray' }}
                                        onValueChange={async (itemValue, itemIndex) => {
                                            await this.getAmenities(itemValue)
                                        }}>
                                        <Picker.Item label={data.category.placeholder} value='' />
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
                                <TouchableOpacity style={{ height: height(6), width: width(90), alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}
                                    onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                                    <View style={{ width: width(80), alignItems: 'flex-start' }}>
                                        <Text style={{ marginHorizontal: 8, fontSize: 15, color: COLOR_SECONDARY }}>{this.state.cate_name}</Text>
                                    </View>
                                    <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                </TouchableOpacity>
                        }
                    </View>
                    {
                        console.log("hello",store.AMENITIES),
                        store.AMENITIES.has_amenities || this.state.loading ?
                        
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>

                                {
                                    this.state.loading ?
                                        <View style={{ width: width(90), alignItems: 'center' }}>
                                            <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                                        </View>
                                        :
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{store.AMENITIES.section_txt}</Text>

                                            <View style={{ width: width(90), flexDirection: 'row', borderRadius: 4, backgroundColor: COLOR_SECTIONS }}>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' }}>
                                                    {
                                                        store.AMENITIES.amenities !== [] ?
                                                            store.AMENITIES.amenities.map((item, key) => {
                                                                return (
                                                                    <View style={{ width: width(45) }}>
                                                                        <CheckBox
                                                                            key={key}
                                                                            title={item.name}
                                                                            checkedColor={main_clr}
                                                                            containerStyle={{ marginRight: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                                                            size={18}
                                                                            checked={item.checkStatus}
                                                                            onPress={() => { this.selectAmenities(item) }}
                                                                        />

                                                                    </View>



                                                                );
                                                            })
                                                            :
                                                            null
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                }
                            </View>
                            :
                            null
                    }



                    {

                        store.DYNAMIC_FIELDS.INNER_DYNAMIC_FIELDS.has_custom_fields === true ?

                            this.DynamicFieldView()
                            :
                            null
                    }


                    {/* <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>Additional Fields</Text>
                        <View style={{ width: width(90), borderColor: '#c4c4c4', borderWidth: 0.5, borderRadius: 4 }}>
                            <View style={{ marginHorizontal: 18, marginVertical: 5 }}>
                                <Text style={{ marginVertical: 5, fontSize: 14, color: 'black' }}>Good for</Text>
                                <TextInput
                                    // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                    placeholder={'title'}
                                    // value={this.state.location}
                                    placeholderTextColor='gray'
                                    underlineColorAndroid='transparent'
                                    autoCorrect={true}
                                    style={{ height: height(6), width: width(78), fontSize: 16, alignSelf: 'stretch', borderRadius: 3, backgroundColor: 'white', paddingHorizontal: 10, borderColor: '#c4c4c4', borderWidth: 0.5, borderRadius: 4 }}
                                />
                            </View>
                            <View style={{ marginHorizontal: 18, marginVertical: 5 }}>
                                <Text style={{ marginVertical: 5, fontSize: 14, color: 'black' }}>Open Hours</Text>
                                <TextInput
                                    // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                    placeholder={'title'}
                                    // value={this.state.location}
                                    placeholderTextColor='gray'
                                    underlineColorAndroid='transparent'
                                    autoCorrect={true}
                                    style={{ height: height(6), width: width(78), fontSize: 16, alignSelf: 'stretch', borderRadius: 3, backgroundColor: 'white', paddingHorizontal: 10, borderColor: '#c4c4c4', borderWidth: 0.5, borderRadius: 4 }}
                                />
                            </View>
                            <Text style={{ marginTop: 10, paddingHorizontal: 20, fontSize: 14, color: 'black' }}>Pre Bookings</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' }}>
                                {
                                    this.state.arr.map((item, key) => {
                                        return (
                                            <CheckBox
                                                key={key}
                                                title='checkbox'
                                                checkedColor={main_clr}
                                                containerStyle={{ marginRight: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                                size={18}
                                                checked={true}
                                            // onPress={() => { this.props.fun() }}
                                            />
                                        );
                                    })
                                }
                            </View>
                        </View>
                    </View> */}
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.phone.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                <Icon name="phone" size={26} color="#c4c4c4" />
                            </View>
                            <TextInput
                                onChangeText={(value) => { this.setState({ phone: value }) }}
                                placeholder={data.phone.placeholder}
                                value={this.state.phone}
                                scrollEnabled={false}
                                keyboardType='phone-pad'
                                placeholderTextColor='gray'
                                underlineColorAndroid='transparent'
                                autoCorrect={true}
                                style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }, I18nManager.isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                            />
                        </View>
                    </View>
                    {
                        store.GET_LISTING.data.is_weblink ?
                            <View style={{ marginHorizontal: 10, marginTop: 10, alignItems: 'flex-start' }}>
                                <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.weburl.main_title}</Text>
                                <View style={{ height: height(6), width: width(90), flexDirection: 'row', marginBottom: 15, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                    <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                        <Icon name="link" size={24} color="#c4c4c4" />
                                    </View>
                                    <TextInput
                                        onChangeText={(value) => { this.setState({ weburl: value }) }}
                                        placeholder={data.weburl.placeholder}
                                        value={this.state.weburl}
                                        scrollEnabled={false}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }, I18nManager.isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                                    />
                                </View>
                            </View>
                            :
                            null
                    }
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
                                selectedValue={this.state.cate_id}
                                style={{ height: height(6), width: width(100) }}
                                onValueChange={async (itemValue, itemIndex) => {
                                    this.selectCategory(itemValue),
                                        await this.getAmenities(itemValue)
                                }}>
                                <Picker.Item label={data.category.placeholder} value='' />
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

export default withNavigation(CreateListing)