import { useState } from "react";
import {Redirect} from 'react-router-dom';

import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Register = (props) => {
  const [category, setCategory] = useState("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [age, setAge] = useState(0);
  const [batch, setBatch] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState(0);
  const [manager, setManager] = useState("");
  const [open_time, setOpen_time] = useState("");
  const [close_time, setClose_time] = useState("");
  
  const onChangeCategory = (event) => {
    setCategory(event.target.value);
  };
  const onChangeName = (event) => {
    setName(event.target.value);
  };
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const onChangeNumber = (event) => {
    setNumber(event.target.value);
  };
  const onChangeAge = (event) => {
    setAge(event.target.value);
  };
  const onChangeBatch = (event) => {
    setBatch(event.target.value);
  };
  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const onChangeWallet = (event) => {
    setWallet(event.target.value);
  };
  const onChangeManager = (event) => {
    setManager(event.target.value);
  };
  const onChangeOpen_time = (event) => {
    setOpen_time(event.target.value);
  };
  const onChangeClose_time = (event) => {
    setClose_time(event.target.value);
  };

  const resetInputs = () => {
    setCategory("buyer");
    setName("");
    setEmail("");
    setNumber("");
    setAge(0);
    setBatch("");
    setPassword("");
    setWallet(0);
    setManager("");
    setOpen_time("");
    setClose_time("");
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if(category === "buyer"){
      const newBuyer = {
        name: name,
        email: email,
        number: number,
        age: age,
        batch: batch,
        password: password,
		    wallet: 0
      };
      if(name === "" || email === "" || number === "" || age === 0 || batch === "" || password === ""){
        alert("Please fill all the fields");
        return;
      }
      axios
        .post("http://localhost:4000/buyer/register", newBuyer)
        .then((response) => {
          alert("Buyer successfully registered");
          window.location = "/";
        })
        .catch((error) => {
          alert("Error: "+error.response.data.error);
          console.log(error.response.data.error);
        })
    }
    else{
      const newVendor = {
        manager: manager,
        name: name,
        email: email,
        number: number,
        open_time: open_time,
        close_time: close_time,
        password: password
      };
      if(name === "" || email === "" || number === "" || manager === "" || open_time === "" || close_time === "" || password === ""){
        alert("Please fill all the fields");
        return;
      }
      axios
        .post("http://localhost:4000/vendor/register", newVendor)
        .then((response) => {
          alert("Vendor successfully registered");
          window.location = "/";
        })
        .catch((error) => {
          alert("Error: "+error.response.data.error);
          console.log(error.response.data.error);
        })
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
        {
          category === "buyer" ?
            <div><Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={onChangeName}
                />
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
                  label="Number"
                  type={'number'}
                  variant="outlined"
                  value={number}
                  onChange={onChangeNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Age"
                  type={'number'}
                  variant="outlined"
                  value={age}
                  onChange={onChangeAge}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl sx={{width: 200}}>
                    <InputLabel id="demo-simple-select-label">Batch</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={batch}
                      label="Batch"
                      onChange={onChangeBatch}
                    >
                      <MenuItem value={"ug1"}>UG1</MenuItem>
                      <MenuItem value={"ug2"}>UG2</MenuItem>
                      <MenuItem value={"ug3"}>UG3</MenuItem>
                      <MenuItem value={"ug4"}>UG4</MenuItem>
                      <MenuItem value={"ug5"}>UG5</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={onChangePassword}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={onSubmit}>
                  Register
                </Button>
              </Grid>
            </Grid></div>
            : <div><Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Manager"
                variant="outlined"
                value={manager}
                onChange={onChangeManager}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={onChangeName}
              />
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
                type={'number'}
                label="Number"
                variant="outlined"
                value={number}
                onChange={onChangeNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="time"
                label="Open Time"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{ width: 150 }}
                value={open_time}
                onChange={onChangeOpen_time}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="time"
                label="Close Time"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{ width: 150 }}
                value={close_time}
                onChange={onChangeClose_time}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                value={password}
                onChange={onChangePassword}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={onSubmit}>
                Register
              </Button>
            </Grid>
          </Grid></div>
        }
      </Grid>
    </Grid>
  );

};

export default Register;
