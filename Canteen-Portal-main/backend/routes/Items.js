var express = require("express");
var router = express.Router();

const auth = require("./auth");
//Load Item model
const Item = require("../models/Items");

// GET request 
// Getting all the items
router.get("/all", auth, function(req, res) {
	Item.find(function(err, items){
        if(err)
            console.log(err);
        else
            res.json(items);
    })
});

//GET request
//Get all items of a particular vendor
router.get("/", auth, function(req, res) {
    const id = req.user.id; 
    if(!id){
        return res.status(404).json({
            error: "No User Logined",
        });
    }
    Item.find({vendor_id: id}).then(vendor => {
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

//POST request
//Add an item to db
router.post("/add", auth, (req,res) => {
    const newItem = new Item({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        rating: [0,0],
        add_ons: req.body.add_ons,
        tags: req.body.tags,
        vendor_id: req.user.id
    });

    Item.findOne({vendor_id: req.user.id, name: req.body.name}).then(item => {
        if(item){
            return res.status(409).json({
                error: "Item already exists"
            });
        }
        else{
            newItem.save()
            .then(item => {
                res.status(200).json(item);
            })
            .catch(err => {
                console.log(err);
                res.status(400).send(err);
            });
        }
    })
});

//POST request
//Delete an item from db
router.post("/delete", auth, (req,res) => {
    Item.deleteOne({_id: req.body._id}).then(item => {
        res.status(200).json(item);
    })
    .catch(err => {
        res.status(400).send(err);
    })
});

//POST request
//Edit an item in db
router.post("/edit", auth, (req,res) => {
    const updates = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        rating: req.body.rating,
        add_ons: req.body.add_ons,
        tags: req.body.tags,
    };
    Item.findOneAndUpdate({_id: req.body._id}, updates, {new: true}).then(item => {
        res.status(200).json(item);
    })
    .catch(err => {
        res.status(400).send(err);
    })
});

//POST request
//Remove a item from favourite
router.post("/togglefav", auth, (req,res) => {
    Item.findOne({_id: req.body._id}).then(item => {
        if(item.favourite.includes(req.user.id))
            item.favourite.splice(item.favourite.indexOf(req.user.id), 1);
        else
            item.favourite.push(req.user.id);
        item.save()
        .then(i => {
            console.log(i);
            if(i.favourite.includes(req.user.id))
                res.status(200).json({val:false});
            else
                res.status(200).json({val:true});
        })
        .catch(err => {
            res.status(400).send(err);
        })
    })
});


module.exports = router;
