import store from '../Stores/orderStore';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import Storage from '../LocalDB/storage'

// change your baseUrl and Domain
const base_url = 'https://dwt-wpml.downtown-directory.com/wp-json/downtown/app';
// const base_url = 'https://listing.downtown-directory.com/for-apps/wp-json/downtown/app';

// const PURCHASE_CODE = '1234';
// const CUSTOM_SECURITY = '1234';
 
const PURCHASE_CODE = '8797677896889778';
const CUSTOM_SECURITY = 'mysecretcode111';

class Api {
  static headers() {
    return {
      'Purchase-Code': PURCHASE_CODE,
      'Custom-Security': CUSTOM_SECURITY,
      'Content-Type': 'application/json',
      'Login-type': store.LOGIN_SOCIAL_TYPE
      // 'Downtown-Lang-Locale':store.language
    }
  }

  static postAxios(route, formData, config) {
    return this.axios(route, formData, config)
  }

  static postForm(route, formData) {
    return this.formDataPost(route, formData, 'POST')
  }
  static get(route) {
    return this.func(route, null, 'GET');
  }

  static put(route, params) {
    return this.func(route, params, 'PUT')
  }

  static post(route, params) {
    return this.func(route, params, 'POST')
  }

  static delete(route, params) {
    return this.func(route, params, 'DELETE')
  }

  static func = async (route, params, verb) => {

    const host = base_url;
    const url = `${host}/${route}`
    console.log("url--->",url);
    let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null);
    options.headers = Api.headers()
    // console.log('URL===>>>>>',options);
    
  


    //Authorization for login user/////
    // getting value from asyncStorage
    const email = await AsyncStorage.getItem('email');
    const pass = await AsyncStorage.getItem('password');
    const language_code = await AsyncStorage.getItem('language');
    // options.headers['Downtown-Lang-Locale'] = `${language_code}`;
    let nxxx=await Storage.getItem('language')
    // Storage.getItem('language').then((val)=>{
      options.headers['Downtown-Lang-Locale'] = nxxx;

    //  })
    // options.headers['Downtown-Lang-Locale'] = '"ar"';


    // console.log('emaail si',email)
    // console.log('pass si',pass)
    // // using buffer
    if (email !== null && pass !== null) {
      const hash = new Buffer(`${email}:${pass}`).toString('base64');
      options.headers['Authorization'] = `Basic ${hash}`;
    }


    // options.auth= {
    //   username: 'usama@gmail.com',
    //   password: '123'
    // }
    return fetch(url, options).then(resp => {
      // console.log('Api response is ------------->>>>>>', resp);

      let json = resp.json();

      if (resp.ok) {
        return json
      }
      return json.then(err => { throw err });
    }).then(json => {
      // console.log('Api response is ------------->>>>>>', json);

      return json;
    }).catch((erorr)=>{
      console.log("error===> "+erorr.name);
    });;
  }

  static formDataPost = async (route, formData, verb) => {
    
    const host = base_url;
    const url = `${host}/${route}`
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        'Purchase-Code': PURCHASE_CODE,
        'Custom-Security': CUSTOM_SECURITY,
        'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      timeout: 180000
    }
    // getting value from asyncStorage  ***
    const email = await AsyncStorage.getItem('email');
    const pass = await AsyncStorage.getItem('password');
    //  console.log('login detail===>>>',email , pass);
    const language_code = await AsyncStorage.getItem('language');
    // options.headers['Downtown-Lang-Locale'] = `${language_code}`;
    let nxxx=await Storage.getItem('language')
    // Storage.getItem('language').then((val)=>{
      options.headers['Downtown-Lang-Locale'] = nxxx;

    //  })
    // options.headers['Downtown-Lang-Locale'] = '"ar"';

    //Authorization for login user using buffer ***
    if (email !== null && pass !== null) {
      const hash = new Buffer(`${email}:${pass}`).toString('base64');
      options.headers['Authorization'] = `Basic ${hash}`;
    }

    return fetch(url, options).then(resp => {
      // console.log('Api response is ------------->>>>>>', resp);

      let json = resp.json();

      if (resp.ok) {
        return json
      }
      return json.then(err => { throw err });
    }).then(json => {
      // console.log('Api response is ------------->>>>>>', json);
      return json;
    }).catch((error) => {
      throw error
      console.log('API ERROR===>>>', error);
    })
  }
  static axios = async (route, formData, config) => {
    const host = base_url;
    const url = `${host}/${route}`

    let options = {
      headers: {
        'Purchase-Code': PURCHASE_CODE,
        'Custom-Security': CUSTOM_SECURITY,
        'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      //timeout: 100000, // default is `0` (no timeout)
    }
    let configration = Object.assign(config, options)
    // getting value from asyncStorage  ***
    const email = await AsyncStorage.getItem('email');
    const pass = await AsyncStorage.getItem('password');
    //  console.log('login detail===>>>',email , pass);


    //  const language_code = await AsyncStorage.getItem('language');
    let nxxx=await Storage.getItem('language')
    // Storage.getItem('language').then((val)=>{
      options.headers['Downtown-Lang-Locale'] = nxxx;

    //  })
    //  options.headers['Downtown-Lang-Locale'] = '"ar"';

 
    //Authorization for login user using buffer ***
    if (email !== null && pass !== null) {
      const hash = new Buffer(`${email}:${pass}`).toString('base64');
      options.headers['Authorization'] = `Basic ${hash}`;
    }

    return axios.post(url,
      formData,
      configration,
    );
    // .then((response)=>{
    //   console.log('SUCCESS!!',response);
    // })
    // .catch((error)=>{
    //   console.log('FAILURE!!',error);
    // });
  }
}

export default Api;

