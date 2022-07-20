import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Navbar = () => {
  const navigate = useNavigate();
  const current = JSON.parse(localStorage.getItem("currentUser"));
  const [wallet, setWallet] = useState(0);
  useEffect(() => {
    if(current != null && current.type === "buyer")
    axios
    .get("http://localhost:4000/buyer", {headers: {token: current.token}})
    .then(response => {
        // console.log(response.data.wallet);
        setWallet(response.data.wallet);
    })
    .catch(error => {
        console.log(error);
    })
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Canteen
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          
          {
            localStorage.getItem("currentUser")
            ? <div>
              {
                JSON.parse(localStorage.getItem("currentUser")).type === "buyer"
                ? <div>
                    <Button color="inherit" onClick={() => navigate("/orderItem")}>
                    Order Item
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/myOrders")}>
                    My Orders
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/profile")}>
                    My Profile
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/wallet")}>
                    Wallet : {wallet}
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/logout")}>
                    Logout
                    </Button>
                    
                  </div>
                : <div>
                    <Button color="inherit" onClick={() => navigate("/orders")}>
                    Orders
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/items")}>
                    Items
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/stats")}>
                    Stats
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/profile")}>
                    My Profile
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/logout")}>
                    Logout
                    </Button>
                  </div>
                }
              </div>
            : <div>
                <Button color="inherit" onClick={() => navigate("/register")}>
                Register
                </Button>
                <Button color="inherit" onClick={() => navigate("/")}>
                Login
                </Button>
              </div>
          }
          
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
