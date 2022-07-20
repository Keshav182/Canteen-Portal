import { useEffect, useState } from "react";
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

const AddItem = (props) => {
    const current = JSON.parse(localStorage.getItem("currentUser"));
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(0);
    // const [rating, setRating] = useState(0);
    const [add_ons, setAdd_ons] = useState("");
    const [tags, setTags] = useState("");

    const onChangeName = (event) => {
        setName(event.target.value);
    }
    const onChangeCategory = (event) => {
        setCategory(event.target.value);
    }
    const onChangePrice = (event) => {
        setPrice(event.target.value);
    }
    // const onChangeRating = (event) => {
    //     setRating(event.target.value);
    // }
    const onChangeAdd_ons = (event) => {
        setAdd_ons(event.target.value);
    }
    const onChangeTags = (event) => {
        setTags(event.target.value);
    }

    const resetInputs = () => {
        setName("");
        setCategory("");
        setPrice(0);
        // setRating(0);
        setAdd_ons("");
        setTags("");
    };

    const onSubmit = (event) => {
        event.preventDefault();
        var br1 = [];
        var br2 = [];
        if(tags !== ""){
          br1 = tags.split(",");
          // console.log(br1);
          for(var i = 0; i < br1.length; i++) {
              br1[i] = br1[i].trim();
          }
        }
        // console.log(br1);
        if(add_ons !== ""){
          br2 = add_ons.split(";");
          for(var i = 0; i < br2.length; i++) {
              br2[i] = br2[i].split(",");
              br2[i][0] = br2[i][0].trim();
              br2[i][1] = br2[i][1].trim();
          }
        }
        const newItem = {
            name: name,
            category: category,
            price: price,
            // rating: rating,
            add_ons: br2,
            tags: br1
        };
        console.log(newItem);
        axios
            .post("http://localhost:4000/vendor/item/add", newItem, {headers: {token: current.token}})
            .then((response) => {
                alert("Item successfully added");
                resetInputs();
                window.location = "/items";
            })
            .catch((error) => {
                console.log(error);
                alert("Error: " + error.response.data.error);
                console.log(error.response.data.error);
            });
        resetInputs();
    }
    
    return (
        <Grid container align={"center"} spacing={2}>
            <Grid item xs={12}>
                <TextField
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={onChangeName}
                />
            </Grid>
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
                    <MenuItem value={"Veg"}>Veg</MenuItem>
                    <MenuItem value={"Non Veg"}>Non Veg</MenuItem>
                    </Select>
                </FormControl>
                </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type={'number'}
                label="Price"
                variant="outlined"
                value={price}
                onChange={onChangePrice}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Add Ons"
                variant="outlined"
                value={add_ons}
                onChange={onChangeAdd_ons}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tags"
                variant="outlined"
                value={tags}
                onChange={onChangeTags}
              />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" onClick={onSubmit}>
                  Submit
                </Button>
            </Grid> 
        </Grid>
    );

}

export default AddItem;