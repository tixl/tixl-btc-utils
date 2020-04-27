import * as firebase from 'firebase';

export interface FirebaseConfig {
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  projectId: string,
  appId: string,
  measurementId: string,
}

class Functions {
  config?: FirebaseConfig;
  initialized: boolean = false;

  httpsCallable = (functionName: string) => {
    if (!this.config) {
      throw new Error('Set firebase config first');
    }

    if (!this.initialized) {
      firebase.initializeApp(this.config);
    }

    return firebase.functions().httpsCallable(functionName);
  }

  setConfig = (config: FirebaseConfig) => {
    this.config = config;
  }
}

const functions = new Functions();

export { functions };
