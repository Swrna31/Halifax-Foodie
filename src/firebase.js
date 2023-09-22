
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
const firebaseConfig = {

  apiKey: "AIzaSyDhUC_c1UF-l7eTIC-dKh2bWpCdKn_egYg",
  authDomain: "halifaxfoodie-2dc26.firebaseapp.com",
  projectId: "halifaxfoodie-2dc26",
  storageBucket: "halifaxfoodie-2dc26.appspot.com",
  messagingSenderId: "846270282914",
  appId: "1:846270282914:web:afd25a3734dbef99adebfb"
  
  // apiKey: "AIzaSyA2OkeCJiefZru-xWEGQavS7cgKexKkaMo",
  // authDomain: "uplifted-studio-365707.firebaseapp.com",
  // projectId: "uplifted-studio-365707",
  // storageBucket: "uplifted-studio-365707.appspot.com",
  // messagingSenderId: "237656405196",
  // appId: "1:237656405196:web:47cb4aa6704a27c0223e69"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)  