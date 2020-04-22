import * as firebase from 'firebase';
import config, { setFirebaseConfig } from './config';

setFirebaseConfig({
  apiKey: '***REMOVED***',
  appId: '***REMOVED***',
  authDomain: '***REMOVED***',
  databaseURL: '***REMOVED***',
  measurementId: '***REMOVED***',
  projectId: '***REMOVED***',
});

firebase.initializeApp(config.firebase);
const functions = firebase.functions();

export {
  functions,
};
