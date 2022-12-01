////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require('express')
const Fruit = require("../models/fruit")

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

router.get("/seed", (req, res) => {
    // array of starter fruits
    const startFruits = [
        {name: "Orange", color: "orange", readyToEat: false},
        {name: "Grape", color: "purple", readyToEat: false},
        {name: "Banana", color: "orange", readyToEat: false},
        {name: "Strawberry", color: "red", readyToEat: false},
        {name: "Coconut", color: "brown", readyToEat: true},
    ]
    // Delete all fruits
    Fruit.deleteMany({}, (err, data) => {
        // Seed Starter fruits - create new fruits once old fruits are deleted
        Fruit.create(startFruits, (err, createdFruits) => {
            // send created fruits as response to confirm creation
            res.json(createdFruits);
        })
    })
})

// Index Route
router.get("/", (req, res) => {
    // Get all fruits from Mongo and send them back
    Fruit.find({})
    .then((fruits) => {
        res.render("fruits/index.ejs", {fruits});
    })
})

// New Route
router.get("/new", (req, res) => {
    res.render("fruits/new.ejs")
})

// Delete Route
router.delete("/:id", (req, res) => {
    const id = req.params.id
    Fruit.findByIdAndRemove(id, (err, fruit) => {
        res.redirect("/fruits")
    })
})

// Update Route
router.put("/:id", (req, res) => {
    const id = req.params.id
    //check if the readyToEat property should be true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false
    // update the fruit
    Fruit.findByIdAndUpdate(id, req.body, {new: true}, (err, fruit) => {
        res.redirect("/fruits")
    })
})

// Create Route
router.post("/", (req, res) => {
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false
    Fruit.create(req.body, (err, fruit) => {
        res.redirect("/fruits")
    })
})

// Edit Route
router.get("/:id/edit", (req, res) => {
    const id = req.params.id
    Fruit.findById(id, (err, fruit) => {
        res.render("fruits/edit.ejs", {fruit})
    })
})


// Show Route
router.get("/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    // find the particular fruit from the database
    Fruit.findById(id, (err, fruit) => { // findById comes from Mongoose
        //render the template with the data from the database
        res.render("fruits/show.ejs", {fruit})
    })
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router