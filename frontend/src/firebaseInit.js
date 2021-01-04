import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAB5mPQzy45P5DkaCV2_KMcuXkS9SSG7MM",
    authDomain: "ntu-starsexchange.firebaseapp.com",
    databaseURL: "https://ntu-starsexchange.firebaseio.com",
    projectId: "ntu-starsexchange",
    storageBucket: "ntu-starsexchange.appspot.com",
    messagingSenderId: "661698612012",
    appId: "1:661698612012:web:c87e75c46d837e3fa0ba89",
    measurementId: "G-TWPPDZZ9SD"
  };

firebase.initializeApp(firebaseConfig);

export default firebase;