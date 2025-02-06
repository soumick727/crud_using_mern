const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/user');

//image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.filename + '_' + Date.now() + '_' + file.originalname);
    }
});

var upload  = multer({
    storage: storage,
}).single("image");

router.get("/",(req,res)=>{
    res.render('home',{title: 'Home Page'});
})

router.get("/add",(req,res)=>{
    res.render('add',{title: 'Add Page'});
})

module.exports = router;