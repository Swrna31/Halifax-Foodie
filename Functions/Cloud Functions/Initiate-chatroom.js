/**
 * Created by : Sukaran Golani
 */

 const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
 const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
 
 initializeApp();
 
 const db = getFirestore();
 
 async function createChatSession(user){
   const docRef = db.collection('chat-bot').doc(user);
   await docRef.set({ status: 'live', restaurant: '', customer: user }, {merge: true});  
   
   await db.collection('chat-bot').doc(user).collection('messages').listDocuments().then(messages => {
         messages.map((message) => {
             message.delete()
         })
   })  
 }
 
 exports.helloPubSub = (event, context) => {
   const message = event.data
     ? Buffer.from(event.data, 'base64').toString()
     : 'Hello, World';
   var data=JSON.parse(message); 
   createChatSession(data.user); 
 };
 