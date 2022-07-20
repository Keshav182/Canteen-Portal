var express = require("express");
var router = express.Router();

const auth = require("./auth");

//Load required models
const Order = require("../models/Orders");
const Item = require("../models/Items");
const Buyer = require("../models/Buyers");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'test.dass.2020@gmail.com',
      pass: 'pass@1234567890'
    }
  });

// GET request 
// Just a test API to check if server is working properly or not
// router.get("/", function(req, res) {
// 	Order.find(function(err, orders){
//         if(err){
//             console.log(err);
//         }
//         else{
//             res.json(orders);
//         }
//     })
// });

//GET request
//Get all orders of a particular buyer
router.get("/my_order", auth, function(req, res) {
    const id = req.user.id;
	if(!id){
        return res.status(404).json({
            error: "No User Logined",
        });
    }
    Order.find({buyer_id: id}).then(buyer => {
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


// GET request
// Get all orders of a particular vendor
router.get("/", auth, function(req, res) {
    const id = req.user.id; 
    if(!id){
        return res.status(404).json({
            error: "No User Logined",
        });
    }
    Order.find({vendor_id: id}).then(vendor => {
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
//Add an order to db
router.post("/add", auth, (req,res) => {
    const newOrder = new Order({
        buyer_id: req.user.id,
        vendor_id: req.body.vendor_id,
        item_id: req.body.item_id,
        name: req.body.name,
        add_ons: req.body.add_ons,
        status: "Placed",
        quantity: req.body.quantity,
        value: req.body.value,
        rating: -1
    });
    // console.log(req.body);
    Buyer.findOne({_id: newOrder.buyer_id}).then(buyer => {
        if(!buyer){
            return res.status(404).json({
                error: "Buyer does not exist"
            });
        }
        else{
            if(buyer.wallet < newOrder.value){
                return res.status(400).json({
                    error: "Not enough balance"
                });
            }
            else{
                buyer.wallet -= newOrder.value;
                Buyer.findOneAndUpdate({_id: newOrder.buyer_id}, buyer, {new: true})
                .then(b => {
                    newOrder.save()
                    .then(order => {
                        res.status(200).json(order);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).send(err);
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send(err);
                });
            }
        }
    })
});

//POST request
//Change status of order
router.post("/changeStatus", auth, (req,res) => {
    Order.findOne({_id: req.body._id}).then(order => {
        if(req.body.status === "Rejected"){
            order.status = "Rejected";
            Buyer.findOne({_id: order.buyer_id}).then(buyer => {
                var mailOptions = {
                    from: 'test.dass.2020@gmail.com',
                    subject: 'Order Status',
                    text: 'Your order has been rejected'
                };
                mailOptions.to = buyer.email;
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            });
            Buyer.findOne({_id: req.body.buyer_id})
            .then(buyer =>{
                buyer.wallet += req.body.value;
                Buyer.findOneAndUpdate({_id: req.body.buyer_id}, buyer, {new: true})
                .then(b => {
                    res.status(200).json(b);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            })
            .catch(err => {
                res.status(400).send(err);
            });
        }
        else{
            if(order.status === "Placed"){
                order.status = "Accepted";

                Buyer.findOne({_id: order.buyer_id}).then(buyer => {
                    var mailOptions = {
                        from: 'test.dass.2020@gmail.com',
                        subject: 'Order Status',
                        text: 'Your order has been accepted'
                    };
                    mailOptions.to = buyer.email;
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                });

            }
            else if(order.status === "Accepted")
                order.status = "Cooking";
            else if(order.status === "Cooking")
                order.status = "Ready for Pickup";
            else if(order.status === "Ready for Pickup")
                order.status = "Completed";
        }
        Order.findOneAndUpdate({_id: req.body._id},{status: order.status})
            .then(o => {
                res.status(200).json(o);
            })
            .catch(err => {
                res.status(400).send(err);
            })
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

module.exports = router;


//POST request
//Add rating to order
router.post("/addRating", auth, (req,res) => {
    // console.log(req.body);
    Order.findOneAndUpdate({_id: req.body._id},{
        $set: {
            rating: req.body.rating
        }
    })
    .then(o => {
        res.status(200).json(o);
    })
    .catch(err => {
        res.status(400).send(err);
    });

    Item.findOne({_id: req.body.item_id})
    .then(item => {
        // console.log(item.rating)
        item.rating[0] += req.body.rating;
        item.rating[1] += 1;
        Item.findOneAndUpdate({_id: req.body.item_id},item,{new: true})
        .then(o => {
            // console.log(o);
            res.status(200).json(o);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        })
    })
    .catch(err => {
        console.log(err);
        res.status(400).send(err);
    });
});