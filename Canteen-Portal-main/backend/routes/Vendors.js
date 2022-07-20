var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./auth");

// Load Vendor model
const Vendor = require("../models/Vendors");

// GET request 
// Getting all the vendors
router.get("/all", auth, function(req, res) {
    Vendor.find(function(err, vendors) {
		if (err) {
			console.log(err);
		} else {
			res.json(vendors);
		}
	})
});

// GET request
// Get a particular user from its id
router.get("/", auth, function(req, res) {
    const id = req.user.id;
    if(!id){
        return res.status(404).json({
            error: "No User Logined",
        });
    }
    Vendor.findOne({_id: id}).then(vendor => {
        if(!vendor){
            return res.status(404).json({
				error: "ID not found",
			});
        }
        else{
            res.status(200).json(vendor);
        }
    }) 
});


// POST request 
// Add a vendor to db
router.post("/register", (req, res) => {
    const newVendor = new Vendor({
        manager: req.body.manager,
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        open_time: req.body.open_time,
        close_time: req.body.close_time,
        password: req.body.password
    });
    Vendor.findOne({email: req.body.email}).then(async vendor => {
        if(vendor){
            return res.status(409).json({
                error: "Email already exists"
            });
        }
        else{
            const salt = await bcrypt.genSalt();
            newVendor.password = await bcrypt.hash(newVendor.password, salt);

            newVendor.save()
            .then(vendor => {
                res.status(200).json(vendor);
            })
            .catch(err => {
                res.status(400).send(err);
            });
        }
    }) 
});

// POST request 
// Login
router.post("/login", (req, res) => {
	const email = req.body.email;
    const pass = req.body.password;
	// Find vendor by email
	Vendor.findOne({ email }).then(async vendor => {
		// Check if vendor email exists
		if (!vendor) {
			return res.status(404).json({
				error: "Email not found",
			});
        }
        else{
            // res.send("Email Found");
            const check = await bcrypt.compare(pass, vendor.password);
            if(!check){
                return res.status(403).json({
                    error: "Password Incorrect",
                });
            }
            else{
                const token = jwt.sign({ id: vendor._id, type: "vendor" }, "abrakadabra");
                return res.status(200).json({token,type: "vendor"});
            }
            
        }
	});
});

//POST request
//Edit profile
router.post("/edit_profile", auth, async (req, res) => {
    const updates = {
        manager: req.body.manager,
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        open_time: req.body.open_time,
        close_time: req.body.close_time,
    };
    const salt = await bcrypt.genSalt();
    updates.password = await bcrypt.hash(req.body.password, salt);

    Vendor.findOneAndUpdate({ _id: req.user.id }, updates, {new: true}).then(vendor => {
		res.status(200).json(vendor);
	})
	.catch(err =>{
		res.status(400).send(err);
	})
});

// Test request
router.get("/test",auth,(req,res)=>{
    res.json("success");
});

module.exports = router;

