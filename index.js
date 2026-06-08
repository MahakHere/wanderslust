const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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
app.get("/listings", (req, res) => {
    Listing.find({}).then((result) => {
        // console.log(result)
        res.render("listings/index.ejs", { result })
    }).catch((err) => {
        console.log(err)
        res.send("Some error occured!")
    })
})

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//create route
app.post("/listings", (req, res) => {
    let newListing = req.body;
    // console.log(newListing);
    New = new Listing(newListing);
    New.save().then(() => {
        console.log("Inserted successfully");
    })
    res.redirect("/listings")
});

//show route
app.get("/listings/:id", (req, res) => {
    let { id } = req.params;
    Listing.findById(id).then((result) => {
        // console.log(result)
        res.render("listings/show.ejs", { result });
    }).catch((err) => {
        console.log(err)
    })
});

//edit route
app.get("/listings/:id/edit", (req, res) => {
    let { id } = req.params
    Listing.findById(id).then((result) => {
        // console.log(result)
        res.render("listings/edit.ejs", { result })
    }).catch((err) => {
        console.log(err);
    })
});

//update route
app.put("/listings/:id", (req, res) => {
    let { newTitle, newDescription, newPrice, newImage, newLocation, newCountry } = req.body;
    let { id } = req.params
    Listing.findByIdAndUpdate(id, { title: newTitle, description: newDescription, price: newPrice, image: newImage, location: newLocation, country: newCountry }, { new: true, runValidators: true })
        .then(() => {
            // console.log("Successfully updated");
        }).catch((err) => {
            console.log(err);
        })
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", (req, res) => {
    let { id } = req.params;
    console.log(id);
    Listing.findByIdAndDelete(id).then(() => {
        console.log("successfully deleted");
    }).catch((err) => {
        console.log(err);
    });
    res.redirect("/listings");
});

//running the server
let port = 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
