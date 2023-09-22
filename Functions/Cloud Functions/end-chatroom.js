/**
 * Created by : Sukaran Golani
 */

 const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
 const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
 
 initializeApp();
 
 const db = getFirestore();
 
 async function databaseTest(customerId,user){
   const docRef = db.collection('chat-bot').doc(user);
   await docRef.set({ status: 'closed', customer: user }, {merge: true});  
   
   await db.collection('chat-bot').doc(customerId).collection('messages').add({
       author:user,
       createdAt:FieldValue.serverTimestamp(),
       data:{
         text:"Chat session ended"
       },
       type:"text"
   })  
 
   const commHistoryRef = db.collection('communication-history').doc(customerId).collection('chat-history')
  await commHistoryRef.add({
     time:FieldValue.serverTimestamp(),
     communicatedWith:user
   })
 }
 
 exports.helloPubSub = (event, context) => {
   const message = event.data
     ? Buffer.from(event.data, 'base64').toString()
     : 'Hello, World';
   var data=JSON.parse(message); 
   databaseTest(data.customerId,data.user); 
 };
 