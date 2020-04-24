import * as firebase from 'firebase';
import config from './config';

firebase.initializeApp(config.firebase);
const functions = firebase.functions();

export {
  functions,
};
