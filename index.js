//import
require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');

const PORT = process.env.PORT || 4000;

// database connection

mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    });

// session middleware

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));


app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));

//set template engine
app.set("view engine", "ejs");


// middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// route prefix

app.use("", require("./routes/routes"));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})