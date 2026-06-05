const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))

//connect with databse
main().then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderslust");
}

//running the server
let port = 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
