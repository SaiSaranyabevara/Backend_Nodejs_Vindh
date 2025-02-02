const mongoose = require("mongoose");

const firmSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    category: [{
        type: String,
        enum: ['veg', 'non-veg']
    }],
    region: [{
        type: String,
        enum: ['south-indian', 'north-indian', 'chinese', 'bakery']
    }],
    offer: {
        type: String
    },
    image: {
        type: String
    },
    vendor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'  // Ensure this matches Vendor model
    }],
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }]


}, { timestamps: true });  // Automatically adds createdAt & updatedAt

const Firm = mongoose.model('Firm', firmSchema);

module.exports = Firm
