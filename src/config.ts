import * as firebase from 'firebase';

interface FirebaseConfig {
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  projectId: string,
  appId: string,
  measurementId: string,
}

const config = {
  firebase: {},
};

export const setFirebaseConfig = (firebaseConfig: FirebaseConfig) => {
  config.firebase = firebaseConfig;
  firebase.initializeApp(config.firebase);
}

export default config;
