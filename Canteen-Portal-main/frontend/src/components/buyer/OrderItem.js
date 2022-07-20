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
import TextField from "@mui/material/TextField";
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import IconButton from '@mui/material/IconButton';
import DialogContentText from '@mui/material/DialogContentText';
import fuzzy from 'fuzzy';

const OrderItem = (props) => {
    const current = JSON.parse(localStorage.getItem("currentUser"));
    const [allVendors, setAllVendors] = useState([-1]);
    const [allItems, setAllItems] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [vendorNames, setVendorNames] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [sortToggle, setSortToggle] = useState(false);
    const anchorRef = React.useRef(null);
    const [sortIndex, setSortIndex] = useState(0);
    const [filterCategory, setFilterCategory] = useState("Both");
    const [filterVendor, setFilterVendor] = useState([]);
    const [filterTags, setFilterTags] = useState([]);
    const [filterPrice, setFilterPrice] = useState([0,100]);
    const [filterToggle, setFilterToggle] = useState(false);
    const [buyToggle, setBuyToggle] = useState({});
    const [orderQty, setOrderQty] = useState(0);
    const [buyAdd_ons, setBuyAdd_ons] = useState([]);
    const [orderValue, setOrderValue] = useState(0);
    const [buyerID, setBuyerID] = useState("");
    const [favToggle, setFavToggle] = useState(false);


    const sortOptions = ["Original order","Sort by Ascending Price", "Sort by Descending Price", "Sort by Ascending Rating", "Sort by Descending Rating"];

    useEffect(() => {
        axios
        .get("http://localhost:4000/vendor/item/all", {headers: {token: current.token}})
        .then(response => {
            setAllItems(response.data);
            let tags = [];
            for(let i = 0; i < response.data.length; i++)
                for(let j = 0; j < response.data[i].tags.length; j++)
                    if(!tags.includes(response.data[i].tags[j]))
                        tags.push(response.data[i].tags[j]);

            let temp = {};
            for(var i = 0; i < response.data.length; i++) {
                temp[response.data[i]._id] = false;
            }
            setBuyToggle(temp);
            setAllTags(tags);
        })
        .catch(error => {
            alert(error.response.data.error);
            console.log(error);
        });

        axios
        .get("http://localhost:4000/vendor/all", {headers: {token: current.token}})
        .then(response => {
            let temp = []
            for(let i = 0; i < Object.keys(response.data).length; i++){
                temp.push(response.data[i].name);
            }
            setAllVendors(response.data);
            setVendorNames(temp);
        })
        .catch(error => {
            alert(error.response.data.error);
            console.log(error);
        });

        axios
        .get("http://localhost:4000/buyer/", {headers: {token: current.token}})
        .then(response => {
            setBuyerID(response.data._id);
        });
    },[]);

    const onChangeSearch = (event) => {
        setSearchName(event.target.value);
    }
    const handleMenuItemClick = (event, index) => {
        setSortIndex(index);
        setSortToggle(false);
    };
    const handleToggle = () => {
        setSortToggle((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
          return;
        }
        setSortToggle(false);
    };

    const handleVendorChange = (event) => {
        const {
          target: { value },
        } = event;
        setFilterVendor(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
        // console.log(filterVendor);
    };

    const handleTagsChange = (event) => {
        const {
          target: { value },
        } = event;
        setFilterTags(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
        // console.log(filterVendor);
    };

    const handleFilterPrice = (event, newValue) => {
        setFilterPrice(newValue);
    };

    const sortItems = (item) => {
        if(sortIndex === 0)
            return item.sort((x,y) => {
                if(x.name < y.name) { return -1; }
                if(x.name > y.name) { return 1; }
                return 0;});
        else if(sortIndex === 1)
            return item.sort((x,y) => x.price - y.price);
        else if(sortIndex === 2)
            return item.sort((x,y) => y.price - x.price);
        else if(sortIndex === 3)
            return item.sort((x,y) => x.rating[0]/x.rating[1] - y.rating[0]/y.rating[1]);
        else if(sortIndex === 4)
            return item.sort((x,y) => y.rating[0]/y.rating[1] - x.rating[0]/x.rating[1]);
    };

    const changeBuyToggle = (item) => {
        let temp = {};
        for(var i = 0; i < allItems.length; i++) {
        temp[allItems[i]._id] = buyToggle[allItems[i]._id];
        }
        temp[item._id] = !temp[item._id];
        setBuyToggle(temp);
    };

    const changeOrderValue = (item, qty,add) => {
        let sum = Number(item);
        for(var i = 0; i < add.length; i++){
            sum += Number(add[i][1]);
        }
        sum = sum * qty;
        setOrderValue(sum);     
    }
   
    const changeOrderQty = (item, event) => {
        setOrderQty(event.target.value);
        changeOrderValue(item.price, event.target.value, buyAdd_ons);
    }
    
    const handleAdd_onsChange = (item, event) => {
        const {
          target: { value },
        } = event;
        setBuyAdd_ons(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
        changeOrderValue(item.price, orderQty, value);
    };

    const onBuy = (item) => {
        changeBuyToggle(item);

        const order = {
            vendor_id: item.vendor_id,
            item_id: item._id,
            name: item.name,
            quantity: orderQty,
            value: orderValue,
            add_ons: buyAdd_ons,
        }

        axios
            .post("http://localhost:4000/order/add", order, {headers: {token: current.token}})
            .then(response => {
                alert("Order placed successfully!");
                setBuyAdd_ons([]);
                setOrderQty(0);
                window.location = "/myOrders";
            })
            .catch(error => {
                alert(error.response.data.error);
                console.log(error);
                setBuyAdd_ons([]);
                setOrderQty(0);
            });
        
        
    };

    const ifOpen = (item) => {
        // console.log(allVendors);
        // console.log(item);
        let vendor = allVendors.find(vendor => vendor._id === item.vendor_id);
        // console.log(vendor);
        let openingTime = vendor.open_time.split(":");
        openingTime = new Date(0, 0, 0, openingTime[0], openingTime[1], 0).getTime();
        let closingTime = vendor.close_time.split(":");
        closingTime = new Date(0, 0, 0, closingTime[0], closingTime[1], 0).getTime();
        const currentTime = new Date(0, 0, 0, new Date().getHours(), new Date().getMinutes(), 0).getTime();

        if (currentTime < openingTime || currentTime > closingTime)
            return false;
        else
            return true;
    }

    const toggleFav = (item) => {
        axios
            .post("http://localhost:4000/vendor/item/togglefav", item, {headers: {token: current.token}})
            .then(response => {
                // console.log(response.data);
                window.location = "/orderItem";
                if(response.data.val === true)
                    alert("Removed from favorites!");
                else
                    alert("Added to favorites!");
            })
            .catch(error => {
                alert(error.response.data.error);
                console.log(error);
            });
        
    }

    while(allVendors[0] === -1)
        return null;

    return (
        <div>
            <Grid container align={"center"} spacing={0}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            value = {searchName}
                            onChange={onChangeSearch}
                            style={{margin: "10px"}}
                        />
                        
                        <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" style={{margin: "10px"}}>
                            <Button>{sortOptions[sortIndex]}</Button>
                            <Button
                            size="small"
                            aria-controls={sortToggle ? 'split-button-menu' : undefined}
                            aria-expanded={sortToggle ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                            >
                            <ArrowDropDownIcon />
                            </Button>
                        </ButtonGroup>
                        <Popper
                            open={sortToggle}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                transformOrigin:
                                    placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                    {sortOptions.map((option, index) => (
                                        <MenuItem
                                        key={option}
                                        selected={index === sortIndex}
                                        onClick={(event) => handleMenuItemClick(event, index)}
                                        >
                                        {option}
                                        </MenuItem>
                                    ))}
                                    </MenuList>
                                </ClickAwayListener>
                                </Paper>
                            </Grow>
                            )}
                        </Popper>
                        <Button variant="outlined" onClick={() => setFilterToggle(true)} style={{margin: "10px"}}>
                            Filter
                        </Button>
                        <Dialog open={filterToggle} onClose={() => setFilterToggle(false)}>
                            <DialogTitle>Filter</DialogTitle>
                            <DialogContent>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Category</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={filterCategory}
                                        onChange={(event) => setFilterCategory(event.target.value)}
                                    >
                                        <FormControlLabel value="Veg" control={<Radio />} label="Veg" />
                                        <FormControlLabel value="Non Veg" control={<Radio />} label="Non Veg" />
                                        <FormControlLabel value="Both" control={<Radio />} label="Both" />
                                    </RadioGroup>
                                </FormControl>
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <InputLabel id="demo-multiple-checkbox-label">Vendors</InputLabel>
                                    <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={filterVendor}
                                    onChange={handleVendorChange}
                                    input={<OutlinedInput label="Vendors" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={{PaperProps: {
                                        style: {
                                          maxHeight: 48 * 4.5 + 8,
                                          width: 250,
                                        },
                                      },}}
                                    >
                                    {vendorNames.map((name) => (
                                        <MenuItem key={name} value={name}>
                                        <Checkbox checked={filterVendor.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <InputLabel id="demo-multiple-checkbox-label">Tags</InputLabel>
                                    <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={filterTags}
                                    onChange={handleTagsChange}
                                    input={<OutlinedInput label="Tags" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={{PaperProps: {
                                        style: {
                                          maxHeight: 48 * 4.5 + 8,
                                          width: 250,
                                        },
                                      },}}
                                    >
                                    {allTags.map((name) => (
                                        <MenuItem key={name} value={name}>
                                        <Checkbox checked={filterTags.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <FormLabel>Price Range</FormLabel>
                                    <Box sx={{ width: 300 }}>
                                    <Slider
                                        getAriaLabel={() => 'Temperature range'}
                                        value={filterPrice}
                                        onChange={handleFilterPrice}
                                        valueLabelDisplay="auto"
                                        // getAriaValueText={valuetext}
                                    />
                                    </Box>
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={() => setFilterToggle(false)}>Filter</Button>
                            </DialogActions>
                        </Dialog>
                        <Button variant="outlined" onClick={() => setFavToggle(true)} style={{margin: "10px"}}>
                            All Favourites
                        </Button>
                        <Dialog
                            open={favToggle}
                            onClose={() => setFavToggle(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                            {"All Favourites"}
                            </DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Vendor</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Tags</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allItems.map((row) => (
                                     row.favourite.includes(buyerID)
                                        ? <TableRow
                                            key={row._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                            <TableCell component="th" scope="row">
                                            {row.name}
                                            </TableCell>
                                            <TableCell>{row.category}</TableCell>
                                            <TableCell>{row.price}</TableCell>
                                            <TableCell>{allVendors.map(vendor => vendor._id === row.vendor_id ? vendor.name : null)}</TableCell>
                                            <TableCell><Rating name="read-only" value={row.rating[0]/row.rating[1]} precision={0.5} readOnly /></TableCell>
                                            <TableCell>{row.tags.join(',')}</TableCell>
                                            </TableRow>
                                        : null
                                    ))}
                                </TableBody>
                                </Table>
                            </TableContainer>
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={() => setFavToggle(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                    <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Tags</TableCell>
                            <TableCell>Favourite</TableCell>
                            <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortItems(allItems).map((row) => (
                             (searchName == "" || fuzzy.test(searchName.toLowerCase(), row.name.toLowerCase()))
                             && (filterCategory === "Both" || row.category === filterCategory)
                             && (filterVendor.length === 0 || filterVendor.includes(allVendors.find(vendor => vendor._id === row.vendor_id).name))
                             && (filterTags.length === 0 || filterTags.every(tag => row.tags.includes(tag)))
                             && (row.price >= filterPrice[0] && row.price <= filterPrice[1])
                             && ifOpen(row)
                                ? <TableRow
                                    key={row._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">
                                    {row.name}
                                    </TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.price}</TableCell>
                                    <TableCell>{allVendors.map(vendor => vendor._id === row.vendor_id ? vendor.name : null)}</TableCell>
                                    <TableCell><Rating name="read-only" value={row.rating[0]/row.rating[1]} precision={0.5} readOnly /></TableCell>
                                    <TableCell>{row.tags.join(',')}</TableCell>
                                    <TableCell>
                                        { row.favourite.includes(buyerID) ?
                                            <div>
                                             <IconButton onClick={() => toggleFav(row)}>
                                                <FavoriteIcon />
                                                </IconButton>
                                                </div>
                                            :<div><IconButton onClick={() => toggleFav(row)}>
                                                <FavoriteBorderOutlinedIcon />
                                                </IconButton>
                                            </div>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                        <Button variant="contained" onClick={() => changeBuyToggle(row)}>
                                        Buy
                                        </Button>
                                        <Dialog open={buyToggle[row._id]} onClose={() => changeBuyToggle(row)}>
                                            <DialogTitle>Buy Item</DialogTitle>
                                            <DialogContent>
                                            <Grid container align={"center"} spacing={2}>
                                                <Grid item xs={12} />
                                                <Grid item xs={12}>
                                                    <TextField
                                                        disabled
                                                        label="Item"
                                                        variant="outlined"
                                                        defaultValue={row.name}
                                                    /> 
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                    type={'number'}
                                                    label="Quantity"
                                                    variant="outlined"
                                                    // defaultValue={row.price}
                                                    onChange={(e) => changeOrderQty(row,e)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="demo-multiple-checkbox-label">Add-Ons</InputLabel>
                                                    <Select
                                                    labelId="demo-multiple-checkbox-label"
                                                    id="demo-multiple-checkbox"
                                                    multiple
                                                    value={buyAdd_ons}
                                                    onChange={(e) => handleAdd_onsChange(row,e)}
                                                    input={<OutlinedInput label="Add-Ons" />}
                                                    renderValue={(selected) => selected.join(', ')}
                                                    MenuProps={{PaperProps: {
                                                        style: {
                                                        maxHeight: 48 * 4.5 + 8,
                                                        width: 250,
                                                        },
                                                    },}}
                                                    >
                                                    {row.add_ons.map((name) => (
                                                        <MenuItem key={name} value={name}>
                                                        <Checkbox checked={buyAdd_ons.indexOf(name) > -1} />
                                                        <ListItemText primary={name} />
                                                        </MenuItem>
                                                    ))}
                                                    </Select>
                                                </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        disabled
                                                        label="Order Value"
                                                        variant="outlined"
                                                        value = {orderValue}
                                                    />
                                                </Grid>
                                            </Grid>
                                            </DialogContent>
                                            <DialogActions>
                                            <Button onClick={() => {onBuy(row)}}>Place Order</Button>
                                            </DialogActions>
                                        </Dialog>
                                        </div> 
                                    </TableCell>
                                </TableRow>
                                : null
                            ))}
                        </TableBody>
                        <TableBody>
                            {sortItems(allItems).map((row) => (
                                (searchName == "" || fuzzy.test(searchName.toLowerCase(), row.name.toLowerCase()))
                                && (filterCategory === "Both" || row.category === filterCategory)
                                && (filterVendor.length === 0 || filterVendor.includes(allVendors.find(vendor => vendor._id === row.vendor_id).name))
                                && (filterTags.length === 0 || filterTags.every(tag => row.tags.includes(tag)))
                                && (row.price >= filterPrice[0] && row.price <= filterPrice[1])
                                && !ifOpen(row)
                                    ? <TableRow
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell component="th" scope="row">
                                        {row.name}
                                        </TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>{allVendors.map(vendor => vendor._id === row.vendor_id ? vendor.name : null)}</TableCell>
                                        <TableCell><Rating name="read-only" value={row.rating[0]/row.rating[1]} precision={0.5} readOnly /></TableCell>
                                        <TableCell>{row.tags.join(',')}</TableCell>
                                        <TableCell>
                                        { row.favourite.includes(buyerID) ?
                                            <div>
                                             <IconButton onClick={() => toggleFav(row)}>
                                                <FavoriteIcon />
                                                </IconButton>
                                                </div>
                                            :<div><IconButton onClick={() => toggleFav(row)}>
                                                <FavoriteBorderOutlinedIcon />
                                                </IconButton>
                                            </div>
                                        }
                                        </TableCell>
                                        <TableCell>Shop Closed</TableCell>
                                    </TableRow>
                                    : null
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


export default OrderItem;