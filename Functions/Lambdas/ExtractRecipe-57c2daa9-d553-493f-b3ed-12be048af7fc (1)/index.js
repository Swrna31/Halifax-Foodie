// created by Tushar Arora 
// https://docs.aws.amazon.com/comprehend/latest/dg/how-key-phrases.html
const AWS= require('aws-sdk');

AWS.config.update({
       region: 'us-east-1' 
    });
const S3 = new AWS.S3();

// const dynamodb=new AWS.DynamoDB({apiVersion: '2012-08-10'});
// const dynamoTableName='Recipe_table';

const comprehend =new AWS.Comprehend();

async function readFile(BucketName, KeyFile) {
    console.log("bucketName:"+BucketName);
    console.log("file:"+KeyFile);
  try {
    const data = await S3.getObject(
    {   Bucket: BucketName, 
        Key: KeyFile+".txt",
    }).promise();

    console.log(data);
    return {
      statusCode: 200,
      body: data.Body.toString('utf8')
    };
  }
  catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: err.message || JSON.stringify(err.message)
    };
  }
}



function ExtractKeyPhrases(text) {
     let res = [];
     return comprehend.detectKeyPhrases({
               LanguageCode: 'en',
               Text: text
          }).promise()
          .then(async data => {
               for(let i = 0; i < data.KeyPhrases.length; i++) {
                    let phrase_text = await data.KeyPhrases[i].Text;
                    res.push(phrase_text);
                    console.log(phrase_text);
               }
               return res;
          })
          .catch(err => {
               return err;
          });
}


// async function saveRecipe(recipe) {
    

//   const params = {
//     TableName: dynamoTableName,
//     Item: recipe
//   };
 
//  try{
//     await dynamodb.putItem(params);

//  return true;
//  }
//  catch(e){
   
//      return false;
//  }

 
// }

exports.handler = async (event) => {
    const outputjson=JSON.parse(event.body);
    console.log("output json:"+outputjson);
    const bucketName=outputjson.bucketName;
    const file=outputjson.file;
    const responseoutput = await readFile(bucketName, file);
    console.log(responseoutput);
    const list_key_phrases=await ExtractKeyPhrases(responseoutput.body);
    
    // const recipe={
    //     recipe_name:file,
    //     Ingredients:list_key_phrases
    // };
    //  const flag= await saveRecipe(recipe);
    //  var response_message;
    //  if(flag==true){
    //      response_message="Successfully extract the key Ingredients";
    //  }
    //  else{
    //      response_message="Unable to extract the key Ingredients";
    //  }
    
    
 
    const response = {
        statusCode: 200,
        body:JSON.stringify(list_key_phrases)
    };
    return response;
};
