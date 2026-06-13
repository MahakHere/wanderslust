const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingScema = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const validateListing = (req,res,next)=>{
        let result = listingSchema.validate(req.body);
        console.log(result.error)
        if(result.error){
            throw new ExpressError(400,result.error);
        }else{
            next();
        }
}

//connect with databse
main().then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderslust");
}

//Home route
app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
})

//index route
app.get("/listings", wrapAsync(async(req, res,next) => {
    let result = await Listing.find({})
    res.render("listings/index.ejs", { result })
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//create route --> review
app.post("/listings",validateListing ,wrapAsync(async(req, res,next) => {
        let newListing = req.body;
        New = new Listing(newListing);
        await New.save()
        res.redirect("/listings")
}));

//show route
app.get("/listings/:id", wrapAsync(async(req, res,next) => {
    let { id } = req.params;
    let result = await Listing.findById(id);
    res.render("listings/show.ejs", { result });
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async(req, res,next) => {
    let { id } = req.params;
    let result = await Listing.findById(id);
    res.render("listings/edit.ejs", { result })
}));

//update route
app.put("/listings/:id",validateListing, wrapAsync(async(req, res,next) => {
    let { newTitle, newDescription, newPrice, newImage, newLocation, newCountry } = req.body;
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { title: newTitle, description: newDescription, price: newPrice, image: newImage, location: newLocation, country: newCountry }, { new: true, runValidators: true })
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async(req, res,next) => {
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    console.log("successfully deleted");
    res.redirect("/listings");
}));

//error handling for all non existing routes
app.use((req,res,next)=>{
    next( new ExpressError(404,"Page not Found!"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    let {status = 500,message} = err;
    res.status(status).render("error.ejs",{status,message});
});

//running the server
let port = 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
