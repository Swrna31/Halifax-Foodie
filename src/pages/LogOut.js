/**
 * Created by : Alagu Swrnam Karruppiah
 */
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { LoginContext } from '../utils/LoginContext';


function LogOut() {

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId')

    const { setLoginStatus } = useContext(LoginContext)

    useEffect(()=>{
        axios.get('https://us-central1-halifaxfoodie-2dc26.cloudfunctions.net/logout?userId=' + userId)
        .then((response)=>{
          console.log(response.data)
          localStorage.clear();
          setLoginStatus(false);
          navigate('/')
        })
      },[])
    

  return (
    <>
        <div>Loging Out ... Please do not refresh </div>
    </>
    
  )
}

export default LogOut