/**
 * Created by : Sukaran Golani
 */
import { Box } from "@mui/material";
import Header from "../components/Header";
import React,{useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import db from "../utils/Firebase";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Profile = () => {

    const [history,setHistory]=useState([]);

    useEffect(()=>{
        getCommunicationHistory();
    },[])

    const getCommunicationHistory=async ()=>{
        var userId = localStorage.getItem("userId"); 
        const commHistoryRef=db.collection("communication-history").doc(userId).collection("chat-history")
        const data=await commHistoryRef.orderBy("time","desc").get()
        var history=[]
        data.forEach((doc)=>{
            history.push(doc.data())
        })        
        setHistory(history)
    }
    
  return (
    <>
    <Box
      sx={{
        borderradius: "10px",
        height: "700px",
        marginLeft: "100px",
        marginTop: "40px",
        position: "relative",
        width: "600px",
      }}
    >
      <h1
        style={{
          display: "flex",
          flexdirection: "column",
          gap: "8px",
          margin: "10px",
        }}
      >
        Chatbot Communication History
      </h1>
      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Communication record</StyledTableCell>
            <StyledTableCell>Timestamp</StyledTableCell>
            <StyledTableCell>Agent Id</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((row,index) => (
            <TableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {index+1}
              </StyledTableCell>
              <StyledTableCell>{row.time.toDate().toString()}</StyledTableCell>
              <StyledTableCell>{row.communicatedWith}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </>
  );
};

export default Profile;
