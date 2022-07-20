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

const Orders = (props) => {
    const current = JSON.parse(localStorage.getItem("currentUser"));
    const [allOrders, setAllOrders] = useState([]);


    useEffect(() => {
        axios
            .get("http://localhost:4000/order/", {headers: {token: current.token}})
            .then(response => {
                setAllOrders(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    },[]);

    const onChange = (item) => {
        if(item.status === "Placed"){
            let count = 0;
            for(let i = 0; i < allOrders.length; i++){
                if(allOrders[i].status === "Cooking" || allOrders[i].status === "Accepted"){
                    count++;
                }
            }
            if(count === 10){
                alert("You can only have 10 orders in cooking or accepted status");
                return;
            }
        }
        axios
            .post("http://localhost:4000/order/changeStatus", item, {headers: {token: current.token}})
            .then(response => {
                console.log(response.data);
                window.location = "/orders";
            })
            .catch(error => {
                console.log(error);
            });
    };

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
                            <TableCell>Add-Ons</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Placed At</TableCell>
                            <TableCell>Order Value</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
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
                                <TableCell>{row.add_ons.map(e => e.join(',')).join('; ')}</TableCell>
                                <TableCell>{row.quantity}</TableCell>
                                <TableCell>{row.time.date}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>
                                    {row.status === "Placed" ? (
                                        <div>
                                        <TableCell>
                                        <Button variant="contained" onClick={() => onChange(row)}>
                                        Accept
                                        </Button>
                                        </TableCell>
                                        <TableCell>
                                        <Button variant="contained" onClick={() => {row.status = "Rejected"; onChange(row)}}>
                                        Reject
                                        </Button>
                                        </TableCell>
                                        </div>
                                    )
                                    : ( row.status !== "Rejected" && row.status !== "Ready for Pickup" && row.status !== "Completed" &&
                                        <TableCell>
                                        <Button variant="contained" onClick={() => onChange(row)}>
                                        Move To Next Stage
                                        </Button>
                                        </TableCell>
                                    )}
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

export default Orders;