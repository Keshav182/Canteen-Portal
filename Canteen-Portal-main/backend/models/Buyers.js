const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BuyerSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
        unique: true
	},
    number: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
	batch: {
        type: String,
        required: true
    },
    wallet: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = Buyer = mongoose.model("Buyers", BuyerSchema);
