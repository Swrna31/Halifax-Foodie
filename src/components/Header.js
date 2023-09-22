/**
 * Created by : Tushar Arora
 */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import { LoginContext } from '../utils/LoginContext';


function Header(props) {
  const { loginStatus } = useContext(LoginContext);


  return (
    <React.Fragment>
      <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0 }}>
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={11}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Halifax Foodie" /></Link>
          { !localStorage.getItem('userId')?
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Login" /></Link>
            <Link to="/sign-up" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Sign Up" /></Link></>:''}
            {localStorage.getItem('userCategory') === 'restaurantOwner' ?
              <>
                <Link to="/upload-recipe" style={{ textDecoration: "none", color: "white" }}>
                  <Tab label="Upload Recipe" />
                </Link>
                <Link to="/polarity" style={{ textDecoration: "none", color: "white" }}>
                  <Tab label="Polarity" />
                </Link>
                <Link to="/visualization" style={{ textDecoration: "none", color: "white" }}>
                  <Tab label="Visualization" />
                </Link>
              </> : <></>}
              { localStorage.getItem('userId')!==null ?
              <>
                <Link to="/log-out" style={{ textDecoration: "none", color: "white" }}>
                  <Tab label="Logout" />
                </Link>
              </> : <></>}            
          </Grid>
        </Grid>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;