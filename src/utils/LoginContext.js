/**
 * Created by : Sukaran Golani
 */
import React, { createContext, useEffect, useState } from "react";


export const LoginContext = createContext();

const AccountDetails = (props)=>{
    useEffect(()=>{
        var userId = localStorage.getItem('userId');
        if(userId){
            setLoginStatus(true)
        }
    },[])
    const [loginStatus,setLoginStatus] = useState(false);    

    return(
        <LoginContext.Provider 
            value={{
                loginStatus,
                setLoginStatus
            }}>
            {props.children}
        </LoginContext.Provider>
    )
}

export default AccountDetails;