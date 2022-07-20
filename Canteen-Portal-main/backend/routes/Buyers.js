var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./auth");

//Load Buyer model
const Buyer = require("../models/Buyers");

// GET request 
// Getting all the buyers
router.get("/all", auth, function(req, res) {
    Buyer.find(function(err, buyers) {
		if (err) {
			console.log(err);
		} else {
			res.json(buyers);
		}
	})
});

// GET request
// Get a particular user from its id
router.get("/",auth, function(req, res) {
    const id = req.user.id;
    if(!id){
        return res.status(404).json({
            error: "No User Logined",
        });
    }
    Buyer.findOne({_id: id}).then(buyer => {
        if(!buyer){
            return res.status(404).json({
				error: "ID not found",
			});
        }
        else{
            res.status(200).json(buyer);
        }
    }) 
});


// POST request 
// Add a buyer to db
router.post("/register", (req, res) => {
    const newBuyer = new Buyer({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        age: req.body.age,
        batch: req.body.batch,
        password: req.body.password,
		wallet: 0
    });

    Buyer.findOne({email: req.body.email}).then(async buyer => {
        if(buyer){
            return res.status(409).json({
                error: "Email already exists"
            });
        }
        else{
            const salt = await bcrypt.genSalt();
            newBuyer.password = await bcrypt.hash(newBuyer.password, salt);
            newBuyer.save()
            .then(buyer => {
                res.status(200).json(buyer);
            })
            .catch(err => {
                res.status(400).send(err);
            });
        }
    })
});

// POST request 
// Login
router.post("/login", async (req, res) => {
	const email = req.body.email;
    const pass = req.body.password;
	// Find buyer by email
	Buyer.findOne({ email }).then( async buyer => {
		// Check if buyer email exists
		if (!buyer) {
			return res.status(404).json({
				error: "Email not found",
			});
        }
        else{
            // res.send("Email Found");
            const check = await bcrypt.compare(pass, buyer.password);
            if(!check){
                return res.status(403).json({
                    error: "Password Incorrect",
                });
            }
            else{
                const token = jwt.sign({ id: buyer._id, type: "buyer" }, "abrakadabra");
                return res.status(200).json({token, type: "buyer"});
            }
        }
	})
    .catch(err => {
        console.log(err);
        res.status(400).send(err);
    });
});

//POST request
//Edit profile
router.post("/edit_profile", auth, async (req, res) => {
    console.log(req.body);
    const updates = {
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        age: req.body.age,
        batch: req.body.batch,
        password: req.body.password,
		wallet: req.body.wallet
    };
    const salt = await bcrypt.genSalt();
    updates.password = await bcrypt.hash(req.body.password, salt);

	Buyer.findOneAndUpdate({ _id: req.user.id }, updates, {new: true}).then(buyer => {
		res.status(200).json(buyer);
	})
	.catch(err =>{
		res.status(400).send(err);
	})
});


//POST request
//Add money to wallet
router.post("/add_money", auth, async (req, res) => {
    Buyer.findOneAndUpdate({_id: req.user.id},{$inc: {wallet: req.body.amount}}, {new: true}).then(buyer => {
        res.status(200).json(buyer);
    })
    .catch(err =>{
        res.status(400).send(err);
    })
});

//Test request
router.get("/test", auth, (req,res)=>{
    res.json("success");
});

module.exports = router;
