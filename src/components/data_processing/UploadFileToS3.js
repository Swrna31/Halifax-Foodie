/**
 * Created by : Tushar Arora
 */

// https://javascript.plainenglish.io/how-to-upload-files-to-aws-s3-in-react-591e533d615e
import React ,{useState} from 'react';
import AWS from 'aws-sdk'
import axios from 'axios';
// import {db} from "./firebase";


import { doc, setDoc} from "firebase/firestore";
import { db } from '../../firebase';


const S3bucket ='upload-recipe-group13';
const region ='us-east-1';

AWS.config.update({    
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
})

const recipeBucket = new AWS.S3({
    params: { Bucket: S3bucket},
    region: region,
})

const UploadFileToS3 = () => {

    const [progressBar , setProgress] = useState(0);
    const [selected_Recipe_File, setSelectedFile] = useState(null);
   

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const userid=localStorage.getItem("userId")
    console.log("userId",userid)

    const uploadFile = (file) => {

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3bucket,
            Key: file.name
        };

        recipeBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
                alert("File is uploaded SuccesFully");
            })
            .send((err) => {
                if (err) console.log(err)
            
            })
    }

    const onextract= (bucketname,File)=> {
      

        const extractObject = {
            bucketName: bucketname,
            file: File.name.slice(0, -4)
        };
      
        
        console.log(extractObject);
        // const url='https://fea3fhtb3wabkbygyuad3uuroy0gdxhe.lambda-url.us-east-1.on.aws/'
        const url='https://avjc5k4xhbgbz7e4qjmnecsduu0xfxmf.lambda-url.us-east-1.on.aws/'
        axios.post(url,extractObject)
            .then((res) => {
                console.log("data of res"+JSON.stringify(res.data));
                const recipDoc = doc(db, "Recipe", File.name.slice(0,-4));
                setDoc(recipDoc, {
                  recipeName:File.name.slice(0,-4) ,
                  userId:userid,
                  ingredients:res.data}
                  )   
                  alert("Recipe is Extracted Successfully");

            }).catch((error) => {
               
                console.log(error)
            });

    }

    const similarRecipe= async(File)=> {
      

   
       
        const recipeName=String(File.name.slice(0, -4))
        console.log(recipeName);
        
        const url='https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/recipe_similarity/?recipeName='+recipeName
        console.log(url)
        axios.post(url)
            .then((res) => {
                console.log("data of res"+JSON.stringify(res.data));
            
                  alert("Similar Recipe:"+res.data);

            }).catch((error) => {
               
                console.log(error)
            });

    }





 
    return (<div className='upload'>
        <div>Upload Progress :{progressBar}%</div>
        <input style={{margin: "10px",padding:"8px", color:"white", background:"grey"}} type="file" onChange={handleFileInput}/><br></br>
        <button style={{margin: "10px",padding:"8px", color:"white", background:"blue", borderRadius:"10px"}} onClick={() => uploadFile(selected_Recipe_File)}> Upload Recipe</button>
        <button style={{margin: "10px",padding:"8px", color:"white", background:"blue",borderRadius:"10px"}} onClick={()=> onextract(S3bucket,selected_Recipe_File)}>Extract Recipe</button>
        <button style={{margin: "10px",padding:"8px", color:"white", background:"blue",borderRadius:"10px"}} onClick={()=> similarRecipe(selected_Recipe_File)}>Similar Recipe</button>
    </div>);
}

export default UploadFileToS3;