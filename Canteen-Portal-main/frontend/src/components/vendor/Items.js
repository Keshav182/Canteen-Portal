import { useEffect, useState } from "react";
import axios from "axios";

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';

const Item = (props) => {
  const current = JSON.parse(localStorage.getItem("currentUser"));
  const [allItems, setAllItems] = useState([]);
  const [editToggle, setEditToggle] = useState({});
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(-1);
  // const [rating, setRating] = useState([0,0]);
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
  //   setRating(event.target.value);
  // }
  const onChangeAdd_ons = (event) => {
    setAdd_ons(event.target.value);
  }
  const onChangeTags = (event) => {
    setTags(event.target.value);
  }

  useEffect(() => {
    axios
      .get("http://localhost:4000/vendor/item", {headers: {token: current.token}})
      .then((response) => {
        setAllItems(response.data);
        let temp = {};
        for(var i = 0; i < response.data.length; i++) {
          temp[response.data[i]._id] = false;
        }
        setEditToggle(temp);
      })
      .catch(function (error) {
        console.log(error);
      });
    
  },[])

  
  const onAdd = (item) => {
    window.location = "/addItem";
  }

  const changeEditToggle = (item) => {
    let temp = {};
    for(var i = 0; i < allItems.length; i++) {
      temp[allItems[i]._id] = editToggle[allItems[i]._id];
    }
    temp[item._id] = !temp[item._id];
    setEditToggle(temp);
  };

  const resetData = () => {
    setName("");
    setCategory("");
    setPrice(-1);
    // setRating(-1);
    setAdd_ons("");
    setTags("");
  }

  const onEdit = (item) => {
    changeEditToggle(item);
    // console.log(item);
    if(name !== "")
      item.name = name;
    if(category !== "")
      item.category = category;
    if(price !== -1)
      item.price = price;
    // if(rating !== -1)
    //   item.rating = rating;
    if(add_ons !== ""){
      var br2 = add_ons.split(";");
      for(var i = 0; i < br2.length; i++) {
          br2[i] = br2[i].split(",");
          br2[i][0] = br2[i][0].trim();
          br2[i][1] = br2[i][1].trim();
      }
      item.add_ons = br2;
    }
    if(tags !== ""){
      var br = tags.split(",");
      for(i = 0; i < br.length; i++) {
        br[i] = br[i].trim();
      }
      item.tags = br;
    }
    axios
      .post("http://localhost:4000/vendor/item/edit", item, {headers: {token: current.token}})
      .then((response) => {
        alert("Item edited successfully");
        window.location = "/items";
      })
      .catch((error) => {
        alert("Error: " + error.response.data.error);
        console.log(error.response.data.error);
      })
    resetData();
  }

  const onDelete = (item) => {
    axios
      .post("http://localhost:4000/vendor/item/delete", item , {headers: {token: current.token}})
      .then((response) => {
        alert("Item deleted successfully");
        window.location = "/items";
      })
      .catch((error) => {
        alert("Error: " + error.response.data.error);
        console.log(error.response.data.error);
      })
  }

  while(allItems.length !== Object.keys(editToggle).length) {
    return "Loading page";
  };

  return (
      <div>
        <Grid container align={"center"} spacing={0}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant="contained" onClick={onAdd}>
                  Add Item
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Add-Ons</TableCell>
                      <TableCell>Tags</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allItems.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.price}</TableCell>
                        <TableCell>{row.add_ons.map(e => e.join(',')).join('; ')}</TableCell>
                        <TableCell>{row.tags.join(',')}</TableCell>
                        <TableCell><Rating name="read-only" value={row.rating[0]/row.rating[1]} precision={0.5} readOnly /></TableCell>
                        <TableCell>
                          <div>
                          <Button variant="contained" onClick={() => changeEditToggle(row)}>
                          Edit
                          </Button>
                          <Dialog open={editToggle[row._id]} onClose={() => changeEditToggle(row)}>
                            <DialogTitle>Edit Item</DialogTitle>
                            <DialogContent>
                              <Grid container align={"center"} spacing={2}>
                                  <Grid item xs={12} />
                                  <Grid item xs={12}>
                                      <TextField
                                        label="Name"
                                        variant="outlined"
                                        defaultValue={row.name}
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
                                          defaultValue={row.category}
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
                                      defaultValue={row.price}
                                      onChange={onChangePrice}
                                    />
                                  </Grid>
                                  {/* <Grid item xs={12}>
                                    <TextField
                                      type={'number'}
                                      label="Rating"
                                      variant="outlined"
                                      defaultValue={row.rating}
                                      onChange={onChangeRating}
                                      
                                    />
                                  </Grid> */}
                                  <Grid item xs={12}>
                                    <TextField
                                      label="Add-Ons"
                                      variant="outlined"
                                      defaultValue={row.add_ons.map(e => e.join(',')).join('; ')}
                                      onChange={onChangeAdd_ons}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      label="Tags"
                                      variant="outlined"
                                      defaultValue={row.tags}
                                      onChange={onChangeTags}
                                    />
                                  </Grid>
                              </Grid>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => {onEdit(row)}}>Save Changes</Button>
                            </DialogActions>
                          </Dialog>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="contained" onClick={() => onDelete(row)}>
                          Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </div>
  );

};

export default Item;
