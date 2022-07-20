import axios from "axios";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Profile = (props) => {
  const [details, setDetails] = useState({});
  const [toggle, setToggle] = useState(false);

  const onChangeName = (event) => {
    setDetails({ ...details, name: event.target.value });
  };
  const onChangeEmail = (event) => {
    setDetails({ ...details, email: event.target.value });
  };
  const onChangeNumber = (event) => {
    setDetails({ ...details, number: event.target.value });
  };
  const onChangeAge = (event) => {
    setDetails({ ...details, age: event.target.value });
  };
  const onChangeBatch = (event) => {
    setDetails({ ...details, batch: event.target.value });
  };
  const onChangePassword = (event) => {
    setDetails({ ...details, password: event.target.value });
  };
  const onChangeWallet = (event) => {
    setDetails({ ...details, wallet: event.target.value });
  };
  const onChangeManager = (event) => {
    setDetails({ ...details, manager: event.target.value });
  };
  const onChangeOpen_time = (event) => {
    setDetails({ ...details, open_time: event.target.value });
  };
  const onChangeClose_time = (event) => {
    setDetails({ ...details, close_time: event.target.value });
  };
  const onChangeToggle = (event) => {
    setToggle(event.target.value);
  };

  const current = JSON.parse(localStorage.getItem("currentUser"));
  useEffect(()=>{
    // console.log(current);
    if(current.type === "buyer"){
      axios
        .get("http://localhost:4000/buyer",{headers: {token: current.token}})
        .then((response) => {
          response.data.password = "";
          setDetails(response.data);
          // console.log(details);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else{
      axios
        .get("http://localhost:4000/vendor/",{headers: {token: current.token}})
        .then((response) => {
          response.data.password = "";
          setDetails(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },[])
  // console.log(details);
  const onEdit = (event) => {
    if(toggle === true){
      if(details.password === ""){
        alert("Enter new or old password");
        return;
      }
      setToggle(false);      
      // console.log(details);
      
      if(current.type === "buyer"){
        axios
          .post("http://localhost:4000/buyer/edit_profile",details, {headers: {token: current.token}})
          .then((response) => {
            alert("Buyer details updated successfully");
          })
          .catch((error) => {
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error);
          });
      }
      else{
        axios
          .post("http://localhost:4000/vendor/edit_profile",details, {headers: {token: current.token}})
          .then((response) => {
            alert("Vendor details updated successfully");
          })
          .catch((error) => {
            alert("Error: "+error.response.data.error);
            console.log(error.response.data.error);
          });
      }
    }
    else{
      setToggle(true);
      // console.log(details);
    }
    
  };

  while(details._id===undefined) {
    return "Loading the Data";
  }

  if(current.type === "buyer"){
    return (
          <div>
            <Grid container align={"center"} spacing={0}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    {...toggle === false ? {disabled: true} : {disabled: false}}
                    label="Name"
                    variant="outlined"
                    defaultValue={details.name}
                    onChange={onChangeName}
                  />
                </Grid> 
                <Grid item xs={12}>
                  <TextField
                    {...toggle === false ? {disabled: true} : {disabled: false}}
                    label="Email"
                    variant="outlined"
                    defaultValue={details.email}
                    onChange={onChangeEmail}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...toggle === false ? {disabled: true} : {disabled: false}}
                    label="Number"
                    type={'number'}
                    variant="outlined"
                    defaultValue={details.number}
                    onChange={onChangeNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...toggle === false ? {disabled: true} : {disabled: false}}
                    label="Age"
                    type={'number'}
                    variant="outlined"
                    defaultValue={details.age}
                    onChange={onChangeAge}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl {...toggle === false ? {disabled: true} : {disabled: false}} sx={{width: 200}}>
                      <InputLabel id="demo-simple-select-label">Batch</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue={details.batch}
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
                {
                  toggle === true ? 
                  <TextField
                    label="Password"
                    variant="outlined"
                    onChange={onChangePassword}
                  />
                : <div></div> }
                </Grid>
                <Grid item xs={12}>
                  {
                    toggle === false ?
                    <Button variant="contained" onClick={onEdit}>
                    Edit
                    </Button>
                    : <Button variant="contained" onClick={onEdit}>
                    Save Changes
                    </Button>
                  }
                </Grid>
              </Grid>
            </Grid>
          </div>
    );
  }
  else if(current.type === "vendor"){
    return (
      <div>
        <Grid container align={"center"} spacing={0}>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...toggle === false ? {disabled: true} : {disabled: false}}
                  label="Manager"
                  variant="outlined"
                  defaultValue={details.manager}
                  onChange={onChangeManager}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...toggle === false ? {disabled: true} : {disabled: false}}
                  label="Name"
                  variant="outlined"
                  defaultValue={details.name}
                  onChange={onChangeName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...toggle === false ? {disabled: true} : {disabled: false}}
                  label="Email"
                  variant="outlined"
                  defaultValue={details.email}
                  onChange={onChangeEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...toggle === false ? {disabled: true} : {disabled: false}}
                  type={'number'}
                  label="Number"
                  variant="outlined"
                  defaultValue={details.number}
                  onChange={onChangeNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...toggle === false ? {disabled: true} : {disabled: false}}
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
                  defaultValue={details.open_time}
                  onChange={onChangeOpen_time}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...toggle === false ? {disabled: true} : {disabled: false}}
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
                  defaultValue={details.close_time}
                  onChange={onChangeClose_time}
                />
              </Grid>
              <Grid item xs={12}>
                {
                  toggle === true ? 
                  <TextField
                    label="Password"
                    variant="outlined"
                    onChange={onChangePassword}
                  />
                : <div></div> }
              </Grid>
              <Grid item xs={12}>
                {
                  toggle === false ?
                  <Button variant="contained" onClick={onEdit}>
                  Edit
                  </Button>
                  : <Button variant="contained" onClick={onEdit}>
                  Save Changes
                  </Button>
                }
              </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
  
};

export default Profile;
