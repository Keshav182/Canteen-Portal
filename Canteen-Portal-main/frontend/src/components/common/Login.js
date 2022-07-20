import { useState, useEffect } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";



const Home = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  }
  const onChangePassword = (event) => {
    setPassword(event.target.value);
  }
  const onChangeCategory = (event) => {
    setCategory(event.target.value);
  }

  const resetInputs = () => {
    setEmail("");
    setPassword("");
    setCategory("");
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const User = {
      email: email,
      password: password
    };

    if(category === "buyer"){
      axios
        .post("http://localhost:4000/buyer/login", User)
        .then((response) => {
          localStorage.setItem("currentUser",JSON.stringify(response.data));
          window.location = "/orderItem";
        })
        .catch((error) => {
          alert("Error: "+error.response.data.error);
          console.log(error.response.data.error);
        });
    }
    else if(category === "vendor"){
      axios
      .post("http://localhost:4000/vendor/login", User)
      .then((response) => {
        localStorage.setItem("currentUser", JSON.stringify(response.data));
        window.location = "/orders";
      })
      .catch((error) => {
        alert("Error: "+error.response.data.error);
        console.log(error.response.data.error);
      });
    }
    resetInputs();

  };

  return (
    <Grid container align={"center"} spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{width: 200}}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={onChangeCategory}
            >
              <MenuItem value={"buyer"}>Buyer</MenuItem>
              <MenuItem value={"vendor"}>Vendor</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={onChangeEmail}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={onChangePassword}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={onSubmit}>
          Login
        </Button>
      </Grid>
    </Grid>
  );

};

export default Home;
