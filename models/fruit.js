//////////////////////////////////////////////
// Import Dependencies
//////////////////////////////////////////////
const mongoose = require("./connection")

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

///////////////////////////////////////////////////
// Export Model
///////////////////////////////////////////////////
module.exports = Fruit