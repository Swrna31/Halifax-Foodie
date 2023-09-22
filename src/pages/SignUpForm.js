/**
 * Created by : Alagu Swrnam Karruppiah
 */
import React, { useState } from 'react';
import { Grid, TextField, Button, Stack, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Radio } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = () => {

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [mobile, setMobile] = useState('')
  const [key, setKey] = useState('')
  const [plainText, setPlainText] = useState('')
  const [customerCategory, setCustomerCategory] = useState('')

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // const axios = require('axios');
    const data = JSON.stringify({
      "userId": userId,
      "password": password,
      "name": name,
      "email": email,
      "mobile": mobile,
      "question": securityQuestion,
      "answer": securityAnswer,
      "key": key,
      "text": plainText,
      "type": customerCategory
    });

    const config = {
      method: 'post',
      url: 'https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/registration',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        alert("The Encrypted Text for your login is \"" + response.data.cipherText + "\"");
      })
      .catch(function (error) {
       console.log(error);
       alert(error.response.data.error)
      //alert("UserID already exists!")
      });
  }

  return (
    <>
    <Box sx={{
      borderradius: '10px',
      height: '700px',
      margin: '100px',
      position: 'relative',
      width: '600px',
    }} autoComplete="off">
      <h1 style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}>
        Sign Up
      </h1>
      <Grid container rowGap={0} columnSpacing={{ xl: 3, lg: 3, md: 3, sm: 3, xs: 0 }}>
        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
          <TextField style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}
            label='Name'
            type='text'
            name='name'
            placeholder='Enter your name'
            variant="outlined"
            onChange={(e) => setName(e.target.value.trim())}
          />
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
          <TextField style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}
            label='User Id'
            type='text'
            name='userId'
            placeholder='Enter your userId'
            variant="outlined"
            onChange={(e) => setUserId(e.target.value.trim())}
          />
        </Grid>
      </Grid>
      <TextField style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}
        label='Email'
        type='text'
        name='email'
        placeholder='Enter your email address'
        variant="outlined"
        onChange={(e) => setEmail(e.target.value.trim())}
      />
      <TextField style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}
        label='Password'
        type='password'
        name='password'
        placeholder='Enter your password'
        variant="outlined"
        onChange={(e) => setPassword(e.target.value.trim())}
      />
      <FormControl fullWidth>
        <InputLabel id="security-question-label">Choose a Security Question</InputLabel>
        <Select style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}
          labelId='security-question-label'
          id='security-question'

          name='securityQuestion'
          variant='outlined'
          label='Choose the Security Question'
          placeholder='Choose the Security Question'
          onChange={(e) => setSecurityQuestion(e.target.value.trim())}
        >
          <MenuItem value="What is your favourite sport?">What is your favourite sport?</MenuItem>
          <MenuItem value="What is your childhood school name?">What is your childhood school name?</MenuItem>
          <MenuItem value="What is you favourite movie name?">What is you favourite movie name?</MenuItem>
          <MenuItem value="What is your oldest sibling name?">What is your oldest sibling name?</MenuItem>
        </Select>
      </FormControl>
      <TextField style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}
        label='Security Answer'
        type='text'
        name='securityAnswer'
        placeholder='Enter your answer of Security Question'
        variant='outlined'
        onChange={(e) => setSecurityAnswer(e.target.value.trim())}
      />
      <TextField style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}
        label='Mobile'
        type='text'
        name='mobile'
        placeholder='Enter your phone number'
        variant="outlined"
        onChange={(e) => setMobile(e.target.value.trim())}
      />
      <TextField style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}
        label='Security Key'
        type='text'
        name='key'
        placeholder='Enter the key for security (4 characters)'
        variant='outlined'
        onChange={(e) => setKey(e.target.value.trim())}
      />
      <TextField style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}
        label='Plain Text'
        type='text'
        name='plainText'
        placeholder='Enter the plain text'
        variant='outlined'
        onChange={(e) => setPlainText(e.target.value.trim())}
      />
      <Stack direction="row" spacing={2} style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}>
        <Radio
          checked={customerCategory === 'customer'}
          onChange={(e) => setCustomerCategory(e.target.value)}
          value="customer"
          name="radio-buttons"
        />Customer
        <Radio
          checked={customerCategory === 'restaurantOwner'}
          onChange={(e) => setCustomerCategory(e.target.value)}
          value="restaurantOwner"
          name="radio-buttons"
        />Restaurant Owner
      </Stack>
      <Stack direction="row" spacing={2} style={{ display: 'flex', flexdirection: 'column', gap: '8px', margin: '10px' }}>
        <Button variant="contained"
          type='button' onClick ={onSubmit}
        >
          Sign up
        </Button>
        <Button variant="contained" type='button' onClick={() => navigate('/login')}>
          Log in
        </Button>
      </Stack>
    </Box>
    </>
  );
};

export default SignUpForm;
