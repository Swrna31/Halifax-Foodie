// https://stackoverflow.com/questions/44589967/how-to-fetch-scan-all-items-from-aws-dynamodb-using-node-js
// https://docs.aws.amazon.com/comprehend/latest/dg/how-sentiment.html
// created by Tushar Arora 
const AWS= require('aws-sdk');

AWS.config.update({
       region: 'us-east-1' 
    });
const S3 = new AWS.S3();

const dynamodb=new AWS.DynamoDB({apiVersion: '2012-08-10'});
const dynamoTableName='Orders';

const comprehend =new AWS.Comprehend();

exports.handler = async (event) => {

    const data=await dbRead();
    console.log("event"+JSON.stringify(event));
    const body=JSON.parse(event.body);
    var list_polarity=[];
    for(const item of  data)
    {
       
        const restaurant_id=item.restaurantId.S;
        if(body.restaurantId==restaurant_id)
        {
            const feedback=item.feedback.S;
            const data = await sentiments(feedback);
            console.log(data);
            list_polarity.push(data);
        }
            
    }
    var res_polarity={
                restaurantId:body.restaurantId,
                polarity:list_polarity
    };
    
    console.log(res_polarity);
    
    const response = {
        statusCode: 200,
        body: res_polarity,
    };
    return response;
};


// const scanTable = async () => {
//     const params = {
//         TableName: dynamoTableName,
//     };

//     const items =  await dynamodb.scan(params).promise();
      
//     return items;

// };

async function dbRead() {
     const params = {
        TableName: dynamoTableName,
    };

    let promise = dynamodb.scan(params).promise();
    let result = await promise;
    let data = result.Items;
    if (result.LastEvaluatedKey) {
        params.ExclusiveStartKey = result.LastEvaluatedKey;
        data = data.concat(await dbRead(params));
    }
    return data;
}

function sentiments(text) {
    
     return comprehend.detectSentiment({
               LanguageCode: 'en',
               Text: text
          }).promise()
          .then(async data => {
               
               return data;
          })
          .catch(err => {
               return err;
          });
}

