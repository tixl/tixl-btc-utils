import { FirebaseConfig, functions } from './firebase';

interface Config {
  firebase?: FirebaseConfig;
}

const config: Config = {};

export const setFirebaseConfig = (firebaseConfig: FirebaseConfig) => {
  config.firebase = firebaseConfig;
  functions.setConfig(config.firebase);
}

export default config;
