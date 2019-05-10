import React, { Component } from 'react';
import {
  Text, View, Image, TouchableOpacity, ActivityIndicator,
  I18nManager, TextInput, FlatList
} from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast';
import { NavigationActions } from 'react-navigation';
import ApiController from '../../ApiController/ApiController';
import styles from '../../../styles/Categories/CategoriesStyleSheet';
@observer class Categories extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchCate: [],
      name: ''
    }
  }
  static navigationOptions = { header: null };
  componentWillMount() {
    let { orderStore } = Store;
    // calling homeData func
    this.getCategories()
  }
  // Getting home data func 
  getCategories = async () => {
    let { orderStore } = Store;
    try {
      this.setState({ loading: true })
      //API calling
      let response = await ApiController.get('categories');
      orderStore.categories = response.data.categories;
      console.log('responsecategory=', response);
      if (response.success === true) {
        this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
      // console.log('error',error);
    }
  }
  searchCate() {
    let { orderStore } = Store;
    if (this.state.name.length !== 0) {
      for (let i = 0; i < orderStore.categories.length; i++) {
        if (orderStore.categories[i].name.includes(this.state.name)) {
          this.state.searchCate.push(orderStore.categories[i]);
          this.setState({ loading: false })
        }
      }
    } else {
      Toast.show('enter any category name')
      this.setState({ searchCate: [] })
    }
  }
  navigateToScreen = (route, title) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.setParams({ otherParam: title });
    this.props.navigation.dispatch(navigateAction);
  }
  render() {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
   
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {
          this.state.loading ?
            <ActivityIndicator color={data.main_clr} size='large' animating={true} />
            :
            <View style={styles.container}>
              <View style={styles.TextInputCon}>
                <TextInput
                  onChangeText={(value) => this.setState({ name: value })}
                  value={this.state.name}
                  placeholder='Search Categories'
                  placeholderTextColor='gray'
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  autoFocus={true}
                  style={styles.TextInput}
                />
                <TouchableOpacity onPress={() => {
                  if (this.state.searchCate.length > 0) {
                    this.setState({ searchCate: [], name: '' })
                  } else {
                    this.searchCate()
                  }
                }}>
                  <Image source={this.state.searchCate.length > 0 ? require('../../images/close.png') : require('../../images/searching-magnifying.png')} style={styles.searchIcon} />
                </TouchableOpacity>
              </View>
              <View style={{ marginVertical: 10 }}>
                <FlatList
                  indicatorStyle='black'
                  data={this.state.searchCate.length === 0 ? orderStore.categories : this.state.searchCate}
                  renderItem={({ item }) =>
                    <TouchableOpacity style={styles.cate_strip} 
                      onPress={() => {
                          store.CATEGORY = item,
                          store.moveToSearch = true,
                          this.navigateToScreen('SearchingScreen', 'search')
                      }}
                    >
                      <Image source={{ uri: item.img }} style={styles.icon} />
                      <Text style={styles.cate_text}>{item.name}</Text>
                      <Image source={require('../../images/next.png')} style={styles.rightIcon} />
                    </TouchableOpacity>
                  }
                />
              </View>
            </View>
        }
      </View>
    );
  }
}
export default Categories;
