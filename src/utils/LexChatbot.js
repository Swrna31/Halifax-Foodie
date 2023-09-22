/**
 * Created by : Sukaran Golani, Alagu Swrnam Karruppiah
 */
import { useContext, useEffect, useState } from "react";
import AWS from "aws-sdk";
import { Launcher } from "react-chat-window";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import db from "./Firebase";
import firebase from "firebase/compat/app";

function LexChatbot() {
  const navigate = useNavigate();
  const { loginStatus } = useContext(LoginContext);

  const [messageList, setMessageList] = useState([]);
  const [lexMessageList, setLexMessageList] = useState([]);

  const [customerId, setCustomerId] = useState("");

  const [lexBotFlag, setLexBotFlag] = useState(true);

  useEffect(() => {
    var userCategory = localStorage.getItem("userCategory");
    var userId = localStorage.getItem("userId");
    console.log(loginStatus, userId, userCategory, lexBotFlag);
    if (userCategory === "restaurantOwner") {
      setLexBotFlag(false);
    }
    if (
      (!loginStatus && !userCategory) ||
      (lexBotFlag && loginStatus && userCategory === "customer")
    ) {
      setMessageList([
        {
          type: "text",
          author: "them",
          data: { text: "Hi, hope you're doing well" },
        },
        {
          type: "text",
          author: "them",
          data: {
            text: `Please enter something like "Navigate to Home Page", "Rate an order", "Add recipe", or "Order related issues".`,
          },
        },
      ]);
    } else if (loginStatus && userCategory === "restaurantOwner") {
      if (!flag) {
        db.collection("chat-bot")
          .where("status", "==", "live")
          .get()
          .then((customerIdSnap) => {
            let custIds = customerIdSnap.docs.map((x) => x.data()["customer"]);
            setCustomerIds(custIds);
            setMessageList([
              {
                type: "text",
                author: "them",
                data: {
                  text: `Hi, the following customers are waiting for your help:`,
                },
              },
              {
                type: "text",
                author: "them",
                data: {
                  text: custIds.join(", "),
                },
              },
              {
                type: "text",
                author: "them",
                data: {
                  text: "Please enter a Customer ID to connect with",
                },
              },
            ]);
          });
      }
    } else if (!lexBotFlag) {
      console.log(userId);
      setMessageSub(userId);
    }
  }, [loginStatus, lexBotFlag]);

  const setMessageSub = (id) => {
    var userId = localStorage.getItem("userId");
    console.log(id);
    const temp = db.collection("chat-bot").doc(id).collection("messages");
    setMessagesRef(temp);
    const messagesRefQuery = temp.orderBy("createdAt");
    messagesRefQuery.onSnapshot((querySnapshot) => {
      var dbMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        if (data["author"] === userId) {
          data["author"] = "me";
        }
        return data;
      });

      console.log([...lexMessageList, ...dbMessages]);

      setMessageList([...lexMessageList, ...dbMessages]);
    });
  };

  const [customerIds, setCustomerIds] = useState([]);

  const [messagesRef, setMessagesRef] = useState();
  const [flag, setFlag] = useState(false);

  const onMessageSent = async (message) => {
    if (lexBotFlag) {
      lexBot(message);
    } else {
      var userId = localStorage.getItem("userId");
      var type = localStorage.getItem("userCategory");
      if (type !== "customer" && !flag) {
        console.log(message["data"]["text"]);
        console.log(customerIds);
        if (customerIds.includes(message["data"]["text"])) {
          setCustomerId(message.data.text);
          const messagesRef = db
            .collection("chat-bot")
            .doc(message.data.text)
            .collection("messages");
          await messagesRef.add({
            author: userId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            data: {
              text: "Hi, how may I help you?",
            },
            type: "text",
          });
          setMessageSub(message["data"]["text"]);
          setFlag(true);
        } else {
          var messages = messageList;

          messages.push(message, {
            type: "text",
            author: "them",
            data: {
              text: "Invalid id entered, please enter correct customer id",
            },
          });
          setMessageList([...messages]);
        }
      } else {
        console.log(userId);
        message["createdAt"] = new Date();
        message["author"] = userId;
        await messagesRef.add(message);
        if(type!=="customer" && message.data.text.toLowerCase().includes("issue resolved")){
          endChatSession();
        }

      }
    }
  };

  const endChatSession = async () => {
    var userId = localStorage.getItem("userId"); 
    AWS.config.update({
      region: "us-east-1",
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
    });
    let LambdaInvoker = new AWS.Lambda();
    const data = {
      topicName: "communication_history",
      customerId: customerId,
      user: userId,
    };
    var params = {
      FunctionName: 'HalifaxFoodiePubSub2',
      Payload: JSON.stringify(data)
    };
    var response = await LambdaInvoker.invoke(params).promise()
    if(response.StatusCode===200){
      window.location.reload()
    }
       
  };

  const lexBot = async (message) => {
    let messages = messageList;
    if (message && message.data && message.data.text.trim() !== "")
      messages.push(message);
    setMessageList([...messages]);
    AWS.config.update({
      region: "us-east-1",
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
    });
    let LexClient = new AWS.LexRuntimeV2({ region: "us-east-1" });

    try {
      var cognitoId = localStorage.getItem("cognitoId");
      var userId = localStorage.getItem("userId");
      userId = userId ? userId : "";
      var sessionId = cognitoId ? cognitoId : "GuestUser";
      if (message && message.data && message.data.text.trim() !== "") {
        const params = {
          botId: "KACFEDZUMH",
          botAliasId: "TSTALIASID",
          localeId: "en_US",
          text: message && message.data && message.data.text,
          sessionId: sessionId,
          sessionState: {
            sessionAttributes: {
              userId: userId,
            },
          },
        };
        console.log(params);
        const botResponse = await LexClient.recognizeText(params).promise();
        var intentName = botResponse.sessionState.intent.name;
        console.log(botResponse);
        let systemResponse =
          botResponse &&
          botResponse.messages.map((message) => {
            return {
              type: "text",
              author: "them",
              data: { text: message.content },
            };
          });
        setMessageList([...messages, ...systemResponse]);
        if (intentName === "NavigateIntent") {
          navigationIntentHandler(botResponse.messages[0].content);
        } else if (intentName === "OrderComplaintsIntent") {
          if (
            botResponse.messages[0].content ===
            "Connecting you to a chat support representative"
          ) {
            var oldMessages = [...messages, ...systemResponse];
            setLexMessageList(oldMessages);
            setLexBotFlag(false);
          }
        }
      }
    } catch (e) {
      console.log(e);
      messages.push({
        type: "text",
        author: "them",
        data: { text: "Some error occurred, please try again later!" },
      });
      setMessageList([...messages]);
    }
  };

  const navigationIntentHandler = (intentResponse) => {
    intentResponse = intentResponse.toLowerCase();
    if (intentResponse.includes("redirecting")) {
      var url = "";
      if (intentResponse.includes("home")) url = "/";
      else if (intentResponse.includes("login")) url = "/login";
      else if (intentResponse.includes("sign")) url = "/sign-up";
      if (url) navigate(url);
    }
  };

  return (
    <Launcher
      agentProfile={{
        teamName: "Halifax Foodie",
        imageUrl: "https://i.imgur.com/YkFmBd0.jpeg",
      }}
      onMessageWasSent={onMessageSent}
      messageList={messageList}
      showEmoji={false}
    />
  );
}

export default LexChatbot;
