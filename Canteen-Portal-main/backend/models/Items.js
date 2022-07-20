const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ItemSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: [Number, Number],
        required: true
    },
	add_ons: {
        type: Array,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    vendor_id: {
        type: String,
        required: true,
        ref: "Vendor"
    },
    favourite: {
        type: Array,
        required: true
    }
});

module.exports = Item = mongoose.model("Items", ItemSchema);
