/**
 * Created by : Tushar Arora
 */
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDhUC_c1UF-l7eTIC-dKh2bWpCdKn_egYg",
    authDomain: "halifaxfoodie-2dc26.firebaseapp.com",
    projectId: "halifaxfoodie-2dc26",
    storageBucket: "halifaxfoodie-2dc26.appspot.com",
    messagingSenderId: "846270282914",
    appId: "1:846270282914:web:afd25a3734dbef99adebfb"
};

const app=firebase.initializeApp(firebaseConfig);
const db =  app.firestore();

export default db;
