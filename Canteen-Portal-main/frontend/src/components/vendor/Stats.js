import { useState, useEffect } from "react";
import axios from "axios";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { VictoryBar, VictoryChart, VictoryPie, VictoryTooltip, VictoryContainer } from "victory";
import { Typography } from "@mui/material";
const Stats = (props) => {
    const current = JSON.parse(localStorage.getItem("currentUser"));
    const [allOrders, setAllOrders] = useState([]);
    const [allBuyers, setAllBuyers] = useState([]);
    const [vendorID, setVendorID] = useState(0);
    const [batchOrders, setBatchOrders] = useState([]);
    const [ageOrders, setAgeOrders] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:4000/order", {headers: {token: current.token}})
            .then(response => {
                setAllOrders(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        
        axios
            .get("http://localhost:4000/buyer/all", {headers: {token: current.token}})
            .then(response => {
                setAllBuyers(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        axios
            .get("http://localhost:4000/vendor", {headers: {token: current.token}})
            .then(response => {
                setVendorID(response.data._id);
            })
            .catch(error => {
                console.log(error);
            });
        
    },[]);

    const getData = (item) => {
        let age = [];
        let batch = [];
        for(let i = 0; i < allOrders.length; i++){
            if(allOrders[i].status === "Completed"){
                for(let j = 0; j < allBuyers.length; j++){
                    if(allOrders[i].buyer_id === allBuyers[j]._id){
                        let f1 = false;
                        for(let k = 0; k < age.length; k++){
                            if(age[k].x === allBuyers[j].age){
                                age[k].y += 1;
                                f1 = true;
                            }
                        }
                        if(!f1){
                            age.push({x: allBuyers[j].age, y: 1});
                        }
                        let f2 = false;
                        for(let k = 0; k < batch.length; k++){
                            if(batch[k].x === allBuyers[j].batch){
                                batch[k].y += 1;
                                f2 = true;
                            }
                        }
                        if(!f2){
                            batch.push({x: allBuyers[j].batch, y: 1});
                        }
                    }
                }
            }
        }
        // setAgeOrders(age);
        // setBatchOrders(batch);
        // age.push({x: 18, y: 9});
        // age.push({x: 4, y: 20});
        // age.push({x: 2, y: 3});
        // age.push({x: 50, y: 8});
        // age.push({x: 27, y: 16});
        
        // batch.push({x: "ug1", y: 16});
        // batch.push({x: "ug3", y: 4});
        // batch.push({x: "ug4", y: 9});

        if(item === "age"){
            console.log(age)
            return age;
        }
        else{
            console.log(batch);
            return batch;
        }
    };

    const topOrderItems = () => {
        let orderQty = [];
        for(let i = 0; i < allOrders.length; i++){
            let temp = {name: allOrders[i].name, qty: allOrders[i].quantity};
            let flag = false;
            for(let j = 0; j < orderQty.length; j++){
                if(orderQty[j].name === temp.name){
                    orderQty[j].qty += temp.qty;
                    flag = true;
                }
            }
            if(!flag){
                orderQty.push(temp);
            }
        }
        orderQty.sort((a, b) => b.qty - a.qty);

        let topItems = [];
        for(let i = 0; i < Math.min(5,orderQty.length); i++){
            topItems.push(orderQty[i]);
        }
        return topItems;
    };

    while(vendorID === 0){
        return null;
    }

    return (
        <Grid container align="center" spacing={0}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>Top 5 Items Sold</Grid>
                    <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ maxWidth: 450 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Qty sold</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            topOrderItems().map((row,index) => (
                                <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                    {row.name}
                                    </TableCell>
                                    <TableCell>{row.qty}</TableCell>
                                </TableRow>
                            ))
                        }    
                        </TableBody>
                        </Table>
                    </TableContainer>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12}>Orders Placed: {allOrders.length}</Grid>
                    <Grid item xs={12}>Pending Orders: {allOrders.filter(order => order.status !== "Rejected" && order.status !== "Completed").length}</Grid>
                    <Grid item xs={12}>Completed Orders: {allOrders.filter(order => order.status === "Completed").length}</Grid>
                </Grid>
                <Grid item xs={12} style={{marginTop:"100px"}}>
                    <Typography variant="h3" gutterBottom>Age-wise Order Distribution</Typography>
                    <VictoryPie
                        width={400}
                        height={400}
                        data={getData("age")}
                        colorScale={[ "#fbc02d", "#8e24aa", "#d81b60", "#039be5"]}
                        // innerRadius={({ datum }) => datum.y * 20}
                        labels={({ datum }) => `Age: ${datum.x},
                         Number of orders: ${datum.y}`}
                        labelComponent={<VictoryTooltip />}
                        containerComponent={<VictoryContainer responsive={false}/>}
                    />
                </Grid>
                <Grid item xs={12} style={{marginTop:"100px"}}>
                    <Typography variant="h3" gutterBottom>Batch-wise Order Distribution</Typography>
                    <VictoryPie
                        width={400}
                        height={400}
                        data={getData("batch")}
                        colorScale={[ "#fbc02d", "#8e24aa", "#d81b60", "#039be5"]}
                        // innerRadius={({ datum }) => datum.y * 20}
                        labels={({ datum }) => `Batch: ${datum.x},
                         Number of orders: ${datum.y}`}
                        labelComponent={<VictoryTooltip />}
                        containerComponent={<VictoryContainer responsive={false}/>}
                    />
                </Grid>
        </Grid>

    )
};

export default Stats;