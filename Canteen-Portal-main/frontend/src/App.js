import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

// import UsersList from "./components/users/UsersList";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import Navbar from "./components/templates/Navbar";
import Logout from "./components/common/Logout";
import Profile from "./components/common/Profile";
import Items from "./components/vendor/Items";
import AddItem from "./components/vendor/AddItem";
import Orders from "./components/vendor/Orders";
import OrderItem from "./components/buyer/OrderItem";
import MyOrders from "./components/buyer/MyOrders";
import Wallet from "./components/buyer/Wallet";
import Stats from "./components/vendor/Stats";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Login/>} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
          <Route path="items" element={<Items />} />
          <Route path="addItem" element={<AddItem />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orderItem" element={<OrderItem />} />
          <Route path="myOrders" element={<MyOrders />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<Profile />} />
          <Route path="stats" element={<Stats />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
