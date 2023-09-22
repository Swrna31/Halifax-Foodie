/**
 * Created by : Alagu Swrnam Karruppiah
 */

import React, { useEffect } from 'react'
import { useState } from "react";
import { Launcher } from "react-chat-window";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


firebase.initializeApp({
    apiKey: "AIzaSyDhUC_c1UF-l7eTIC-dKh2bWpCdKn_egYg",
    authDomain: "halifaxfoodie-2dc26.firebaseapp.com",
    projectId: "halifaxfoodie-2dc26",
    storageBucket: "halifaxfoodie-2dc26.appspot.com",
    messagingSenderId: "846270282914",
    appId: "1:846270282914:web:afd25a3734dbef99adebfb"
})

const firestore = firebase.firestore();

function ChatBot() {
    const [messageList, setMessageList] = useState([])
    const [customerIds, setCustomerIds] = useState([])
    const [messagesRef, setMessagesRef] = useState()
    const [flag, setFlag] = useState(false);
    // let flag = false;
    const userId = localStorage.getItem('userId');
    const type = localStorage.getItem('userCategory');
    // let messagesRef = null;

    const setMessageSub = (id) => {
        console.log(id)
        const temp = firestore.collection('chat-bot').doc(id).collection('messages');
        setMessagesRef(temp);
        const messagesRefQuery = temp.orderBy('createdAt');
        messagesRefQuery.onSnapshot(querySnapshot => {
            setMessageList(querySnapshot.docs.map(doc => {
                const data = doc.data()
                if (data['author'] === userId) {
                    data['author'] = 'me'
                }
                return data
            }))
        });
        messagesRefQuery.get().then(snapShot => {
            let arr = []
            snapShot.forEach(doc => {
                const data = doc.data()
                if (data['author'] === userId) {
                    data['author'] = 'me'
                }
                arr.push(data)
            })
            setMessageList(arr)
        })
    }

    useEffect(() => {
        console.log(type)
        if (type !== 'customer') {
            if (!flag) {
                firestore.collection('chat-bot').where('restaurant', '==', '').get().then(customerIdSnap => {
                    let custIds = customerIdSnap.docs.map(x => x.data()['customer'])
                    setCustomerIds(custIds)
                    setMessageList([
                        {
                            type: "text",
                            author: "them",
                            data: {
                                text: `Clients Waiting...`,
                            },
                        },
                        {
                            type: "text",
                            author: "them",
                            data: {
                                text: custIds.join(', '),
                            },
                        },
                        {
                            type: "text",
                            author: "them",
                            data: {
                                text: 'Please enter a Customer ID',
                            },
                        }
                    ])
                });
            }
        } else {
            console.log(userId)
            setMessageSub(userId)
        }
    }, [])

    const onMessageSent = async (message) => {
        if (type !== 'customer' && !flag) {
            console.log(message['data']['text'])
            console.log(customerIds)
            if (customerIds.includes(message['data']['text'])) {
                console.log('Hellooo')
                setMessageSub(message['data']['text'])
                setFlag(true)
            }
        } else {
            console.log(userId)
            message['createdAt'] = new Date()
            message['author'] = userId
            await messagesRef.add(message)
        }
    };

    return (
        <>
            {messageList ?
                <Launcher
                    agentProfile={{
                        teamName: "Halifax Foodie",
                        imageUrl: "https://i.imgur.com/YkFmBd0.jpeg",
                    }}
                    onMessageWasSent={onMessageSent}
                    messageList={messageList}
                    showEmoji={false}
                /> : <div></div>
            }
        </>
    );
}

export default ChatBot