/**
 * Created by : Alagu Swrnam Karruppiah
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField,Button,Box} from '@mui/material';
import axios from 'axios';

const SecurityQuestion = () => {
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId')
  
  useEffect(()=>{
    axios.get('https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/security-question?userId=' + userId)
    .then((response)=>{
      setSecurityQuestion(response.data['question'])
    })
  },[])

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/security-question?userId=' + userId,{
      "question": securityQuestion,
      "answer": securityAnswer
    })
    .then((response)=>{
      console.log(response.data)
      navigate('/columnarCipher')
    })
  }

  return (
      <>
      <Box  sx={{
            borderradius: '10px',
            height: '700px',
            margin: '100px',
            position: 'relative',
            width: '600px',
        }} >
        <h1 style={{display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px'}}>
          Security Check
        </h1>
        <TextField style={{display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px'}}
          label='Your Security Question'
          type='text'
          name='securityQuestion'
          placeholder='Security Question' // add security question here
          value={securityQuestion}
          readOnly
        />
        <TextField style={{display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px'}}
          label='Security Answer'
          type='text'
          name='securityAnswer'
          placeholder='Enter your Security Answer'
          onChange={(e) => setSecurityAnswer(e.target.value.trim())}
        />
        <Button variant='contained' style={{display: 'flex', flexdirection: 'column', margin: '10px'}} onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </>
  );
};

export default SecurityQuestion;
