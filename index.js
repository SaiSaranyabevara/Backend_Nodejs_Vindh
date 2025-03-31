const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes'); // Correct path for firmRoutes
const productRoutes= require('./routes/productRoutes');
const cors = require('cors')
 
const port = process.env.port || 8000;

dotEnv.config();
app.use(cors())
mongoose.connect(process.env.mongo_uri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.log("MongoDB connection error:", error));

app.use(bodyParser.json());

// Use the correct route for /firm
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes); // Corrected here to '/firm'
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

app.listen(port, () => {
    console.log(`Server started and running at port ${port}`);
});

app.get('/', (req, res) => {
    res.send("<h2>Welcome to Ruby</h2>"); // Fixed the HTML tag for proper formatting
});
