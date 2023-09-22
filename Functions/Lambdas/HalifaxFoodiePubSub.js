/**
 * Created by : Sukaran Golani
 */

const {PubSub} = require('@google-cloud/pubsub');

exports.handler = async (event) => {    
    console.log(event)
    if(event){
        const pubSubClient=new PubSub({keyFilename:"gcpCredentials.json",projectId:"halifaxfoodie-2dc26"})  
        const body=event
        event=JSON.stringify(event) 
        const message = Buffer.from(event)             
        console.log(body.topicName)
        const messageId = await pubSubClient
            .topic(body.topicName)
            .publishMessage({
                'data': message
            })
        console.log(`Message ${messageId} published.`)
        const response = {
            statusCode: 200,
            body: {
                messageId,
                message:`Message ${messageId} published.`
            },
        };
        return response;
    }
    else{
        const response = {
            statusCode: 400,
            body: {
                message:"Some error occurred"
            },
        };
        return response;
    }
};
