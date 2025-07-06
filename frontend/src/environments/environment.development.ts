const base = 'http://localhost:8080';
export const environment = {
  production: false,
  domain: base,
  updateFcmToken: `${base}/updateFcmToken`,
  firebaseLoginUrl:
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyASZRAJtT4HxibKo8UCAxXRsJQLGyfuhhs',
  firebase: {
    apiKey: 'AIzaSyASZRAJtT4HxibKo8UCAxXRsJQLGyfuhhs',
    authDomain: 'helpdesk-by-overhare.firebaseapp.com',
    projectId: 'helpdesk-by-overhare',
    storageBucket: 'helpdesk-by-overhare.firebasestorage.app',
    messagingSenderId: '487020696834',
    appId: '1:487020696834:web:38f274e7cc36274757de1b',
    measurementId: 'G-J553RDKHDH',
  },
};
