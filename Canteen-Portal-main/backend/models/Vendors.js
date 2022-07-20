const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VendorSchema = new Schema({
    manager: {
        type: String,
        required: true
    },
	name: {
		type: String,
		required: true,
        unique: true
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
    open_time: {
        type: String,
        required: true
    },
    close_time: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = Vendor = mongoose.model("Vendors", VendorSchema);
