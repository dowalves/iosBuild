import store from '../Stores/orderStore';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import {Buffer} from 'buffer';
class Api {
  static headers() {
    return {
      'Purchase-Code': 12,
      'Custom-Security': 12,
      'Content-Type': 'application/json',
      'Login-type': store.LOGIN_SOCIAL_TYPE
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

  static func = async(route, params, verb) => {
    
    // const host = 'http:
    const base_url = 'https://listing.downtown-directory.com/';

    const host = base_url+'for-apps/wp-json/downtown/app';
    
    const url = `${host}/${route}`
    let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null);
    options.headers = Api.headers()
    // console.log('URL===>>>>>',options);

    //Authorization for login user/////
    // getting value from asyncStorage
       const email = await AsyncStorage.getItem('email');
       const pass = await AsyncStorage.getItem('password');
      //  console.log('login detail===>>>',email , pass);
       
    // using buffer
    if ( email !== null && pass !== null ) {
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
    });
  }

  static formDataPost = async(route, formData, verb) => {
    console.log('FORMDATA====>>>>',formData);
    // const host = 'http:
    const base_url = 'https://listing.downtown-directory.com/';

    const host = base_url+'for-apps/wp-json/downtown/app';
    
    const url = `${host}/${route}`
    let options = {
      method: 'POST',
      body: formData,
        headers:{
          'Purchase-Code': 12,
          'Custom-Security': 12,
          'Content-Type': 'multipart/form-data',
        },
      timeout: 180000
     }
    // getting value from asyncStorage  ***
       const email = await AsyncStorage.getItem('email');
       const pass = await AsyncStorage.getItem('password');
       console.log('login detail===>>>',email , pass);
       
    //Authorization for login user using buffer ***
    if ( email !== null && pass !== null ) {
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
    }).catch((error)=>{
      throw error  
      console.log('API ERROR===>>>',error);
    })
  }
  static axios = async(route, formData, config) => {
  
    //console.log('FORMDATA====>>>>',formData);
    // const host = 'http:
    const base_url = 'https://listing.downtown-directory.com/';

    const host = base_url+'for-apps/wp-json/downtown/app';
  
    const url = `${host}/${route}`
    
    let options = {
        headers:{
          'Purchase-Code': 12,
          'Custom-Security': 12,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // default is `0` (no timeout)
     }
    let configration = Object.assign(config,options)
    //console.log('configration==>>',configration);
    
    // getting value from asyncStorage  ***
       const email = await AsyncStorage.getItem('email');
       const pass = await AsyncStorage.getItem('password');
       //console.log('login detail===>>>',email , pass);
       
    //Authorization for login user using buffer ***
    if ( email !== null && pass !== null ) {
        const hash = new Buffer(`${email}:${pass}`).toString('base64');
        options.headers['Authorization'] = `Basic ${hash}`;  
    }
    
   return axios.post( url,
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