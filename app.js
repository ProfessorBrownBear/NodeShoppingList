require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // For static files like CSS

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define Mongoose Model
const Item = mongoose.model("Item", new mongoose.Schema({
    name: String,
    quantity: Number
}));

// Serve Static HTML Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

// API to Fetch Items (for Frontend)
app.get("/items", async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

// Create Item (C)
app.post("/add", async (req, res) => {
    await new Item({ name: req.body.name, quantity: req.body.quantity }).save();
    res.redirect("/");
});

// Update Item (U) - Update name & quantity
app.post("/update", async (req, res) => {
    await Item.findByIdAndUpdate(req.body.id, { 
        name: req.body.name, 
        quantity: req.body.quantity 
    });
    res.redirect("/");
});

// Delete Item (D)
app.post("/delete", async (req, res) => {
    await Item.findByIdAndDelete(req.body.id);
    res.redirect("/");
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
