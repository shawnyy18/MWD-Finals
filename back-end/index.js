// Server Setup
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Enable CORS
app.use(cors());

// Define Routes
app.use('/users', require('./routes/User-Routes'));

// Backend Routes
app.use("/courses", require("./routes/Course-Routes.js"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));