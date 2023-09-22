/**
 * Created by : Alagu Swrnam Karruppiah
 */
import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField,Button,Box} from '@mui/material';
import axios from 'axios';
import { LoginContext } from '../utils/LoginContext';

const CaesarCipher = () => {

  const [encryptedText, setEncryptedText] = useState('')

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId')       // UserId local storage

  const { setLoginStatus } = useContext(LoginContext)

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/cipherCheck2',{
      "cipherText": encryptedText,
      "userId": userId
    }) 
    .then((response)=>{
      console.log(response.data)  
      setLoginStatus(true);
      navigate('/restaurants');
    })
  }

  return (
      <>
      <Box sx={{
            borderradius: '10px',
            height: '700px',
            margin: '100px',
            position: 'relative',
            width: '600px',
        }}>
        <h1 style={{display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px'}}>
          Please enter the encrypted text
        </h1>
          <TextField style={{display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px'}}
            label='Your Answer'
            type='text'
            name='encryptedText'
            placeholder='Encrypted Text'
            value={encryptedText}
            onChange={(e)=>setEncryptedText(e.target.value)}
          />
        <Button style={{display: 'flex', flexdirection: 'column', margin: '10px'}} variant='contained' onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </>
  );
};

export default CaesarCipher;
