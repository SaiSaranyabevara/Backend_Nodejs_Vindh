const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    username: {  // ✅ Fixed typo
        type: String,  // ✅ Fixed "typr" to "type"
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,  // ✅ Fixed "typr" to "type"
        required: true
    },
    firm:[
        {
          type:mongoose.Schema.Types.ObjectId ,
          ref:'Firm' 
        }
]
});

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;
