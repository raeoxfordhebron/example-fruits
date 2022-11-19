// Dependencies
// - express => web framework for creating servers and writing routes

// - mongoose => ODM for connecting to and sending queries to a mongo database

// - method-override => allows us to swap the method of a request based on a URL query

// - ejs => our templating engine

// - dotenv => will allow us to use a `.env` file to define environmental variables we can access via the `process.env` object

// - morgan => logs details about requests to our server, mainly to help us debug
require("dotenv").config() // Load env variables
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const PORT = process.env.PORT // check this .env file for anything that has this name
const app = express()

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

////////////////////////////////////////////////
// Fruits Models
////////////////////////////////////////////////
// pull schema and model from mongoose
const {Schema, model} = mongoose // destructuring, grabbing model and Schema off of mongoose variable

// make fruits schema
const fruitsSchema = new Schema({ // can take a secondary argument, like a timestamp
    name: String,
    color: String,
    readyToEat: Boolean
})

// make fruit model
const Fruit = model("Fruit", fruitsSchema) // takes the name of the model we're making and the schema as arguments

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")) // logging
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("your server is running... better catch it")
})

app.get("/fruits/seed", (req, res) => {
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
app.get("/fruits", (req, res) => {
    // Get all fruits from Mongo and send them back
    Fruit.find({})
    .then((fruits) => {
        res.render("fruits/index.ejs", {fruits});
    })
})

// New Route
app.get("fruits/new", (req, res) => {
    res.render("fruits/new.ejs")
})

// Show Route
app.get("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    // find the particular fruit from the database
    Fruit.findById(id, (err, fruit) => { // findById comes from Mongoose
        //render the template with the data from the database
        res.render("fruits/show.ejs", {fruit})
    })
})


//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
app.listen(PORT, () => {
    console.log(`Who let the dogs out of port ${PORT}`)
})