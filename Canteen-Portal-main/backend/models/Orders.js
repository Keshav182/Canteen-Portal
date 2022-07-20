const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
	buyer_id: {
		type: String,
		required: true
	},
    vendor_id: {
		type: String,
		required: true
	},
    item_id: {
		type: String,
		required: true
	},
    name: {
        type: String,
        required: true
    },
    add_ons: {
        type: Array,
        required: true
    },
    time: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        required: true
    },
	quantity: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

module.exports = Order = mongoose.model("Orders", OrderSchema);
