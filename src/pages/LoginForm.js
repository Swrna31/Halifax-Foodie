/**
 * Created by : Alagu Swrnam Karruppiah
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField,Button, Stack,Box} from '@mui/material';
import axios from 'axios';
import Header from '../components/Header';
import db from '../utils/Firebase';

const Login = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    
    await axios.post('https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/cognitoLogin',{
      "userId": id,
      "password": password
    }).then(async(response)=>{
      console.log(JSON.stringify(response.data))
      localStorage.setItem('cognitoId',response.data['cognitoId'])                //Coginto Id for lex chatroom     
      localStorage.setItem('userId',id)     // UserId for login status
      var userType=await fetchUserType(id)
      localStorage.setItem('userCategory',userType) 
      navigate('/securityQuestion')
    }).catch((err)=>{
      alert("Invalid password")
    })
  }

  const fetchUserType = async (custId)=>{    
    var user = await db.collection("user-type").doc(custId).get()
    return user.data().type
  }

  return (
      <>        
        <Box component="form" 
          sx={{
            borderradius: '10px',
            height: '700px',
            margin: '100px',
            position: 'relative',
            width: '600px',
        }} 
        autoComplete="off" noValidate onSubmit={onSubmit}>
          <h1 style={{display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px'}}>
            Login
          </h1>
          <TextField style={{display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px'}}
            label='id'
            className='form-input'
            type='text'
            name='id'
            placeholder='Enter your user id'
            onChange={(e) => setId(e.target.value.trim())}
          />
          <TextField style={{display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px'}}
            label='Password'
            className='form-input'
            type='password'
            name='password'
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value.trim())}
          />
          <Stack direction="row" spacing={2} style={{display: 'flex', flexdirection: 'column', margin: '10px'}}>
            <Button variant='contained' style={{marginTop: '30px'}} type='submit' >
              Log in
            </Button>
            <Button variant='contained' style={{marginTop: '30px'}} type='reset' onClick={() => navigate('/sign-up')}>
              Sign Up
            </Button>
          </Stack>
        </Box>
    </>
  );
};

export default Login;
