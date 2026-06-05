const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const sampleListings = require("./data.js");

//connecting with database
main().then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderslust");
}

Listing.insertMany(sampleListings).then(() => {
    console.log("Inserted successfully");
}).catch((err) => {
    console.log(err);
});

