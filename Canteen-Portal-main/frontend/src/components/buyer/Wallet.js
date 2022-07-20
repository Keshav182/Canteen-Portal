import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

const Wallet = (props) => {
    const current = JSON.parse(localStorage.getItem("currentUser"));
    const [balance, setBalance] = useState(0);
    const [addAmount, setAddAmount] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:4000/buyer", {headers: {token: current.token}})
            .then(response => {
                setBalance(response.data.wallet);
            })
            .catch(error => {
                console.log(error);
            })
    },[]);

    const OnAddMoney = () => {
        axios
            .post("http://localhost:4000/buyer/add_money", {amount: addAmount}, {headers: {token: current.token}})
            .then(response => {
                setBalance(response.data.wallet);
                window.location = "/wallet";
                alert("Money added successfully");
            })
            .catch(error => {
                console.log(error);
            })
        setAddAmount(0);
    }

    return (
        <div>
            <h1>Wallet</h1>
            <h3>Your current balance is: {balance}</h3>
            <h3>Add amount:</h3>
            <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)}/>
            <Button onClick={OnAddMoney}>Add Money</Button>
        </div>
    )

};

export default Wallet;