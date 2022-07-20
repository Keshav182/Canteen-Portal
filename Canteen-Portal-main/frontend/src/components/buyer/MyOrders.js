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
import Rating from '@mui/material/Rating';


const MyOrders = (props) => {
    const current = JSON.parse(localStorage.getItem("currentUser"));
    const [allOrders, setAllOrders] = useState([]);
    const [allVendors, setAllVendors] = useState([]);
    const [newRating, setNewRating] = useState(0);
    
    useEffect(() => {
        axios
            .get("http://localhost:4000/order/my_order", {headers: {token: current.token}})
            .then(response => {
                setAllOrders(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        
        axios
            .get("http://localhost:4000/vendor/all", {headers: {token: current.token}})
            .then(response => {
                setAllVendors(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    },[]);

    const onChange = (item) => {
        axios
            .post("http://localhost:4000/order/changeStatus", item, {headers: {token: current.token}})
            .then(response => {
                // console.log(response.data);
                
                window.location = "/myOrders";
            })
            .catch(error => {
                console.log(error);
            });
    };

    const onAddRating = (item) => {
        item.rating = newRating;
        axios
            .post("http://localhost:4000/order/addRating", item, {headers: {token: current.token}})
            .then(response => {
                console.log(response.data);
                
                // window.location = "/myOrders";
            })
            .catch(error => {
                console.log(error);
            });
    }

    const parseTime = (item) => {
        let par = item.split('T');
        console.log(par);
        let t = par[1].split('.');
        return String(par[0]) + ' ' + String(t[0]);
    }

    return (
        <div>
            <Grid container align={"center"} spacing={0}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Add-Ons</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Placed At</TableCell>
                            <TableCell>Order Value</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allOrders.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                {row.name}
                                </TableCell>
                                <TableCell>{allVendors.map(vendor => vendor._id === row.vendor_id ? vendor.name : null)}</TableCell>
                                <TableCell>{row.add_ons.map(e => e.join(',')).join('; ')}</TableCell>
                                <TableCell>{row.quantity}</TableCell>
                                <TableCell>{parseTime(row.time)}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>
                                    {row.status === "Ready for Pickup" &&
                                        <div>
                                        <TableCell>
                                        <Button variant="contained" onClick={() => onChange(row)}>
                                        Picked up
                                        </Button>
                                        </TableCell>
                                        </div>
                                    }
                                    {row.status === "Completed" && row.rating === -1 &&
                                        <div>
                                        <TableCell>
                                        <Rating
                                        name="simple-controlled"
                                        defaultValue={row.rating}
                                        value={newRating}
                                        onChange={(event, newValue) => {
                                            setNewRating(newValue);
                                            onAddRating(row);
                                            console.log(row.rating);
                                        }}
                                        />   
                                        </TableCell>
                                        </div>
                                    }
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


export default MyOrders;