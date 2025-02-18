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

// insert an user into database route
router.post('/add', upload, async (req,res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename
        });
        await user.save();
        req.session.message = {
            type:'success',
            text: 'User added successfully'
        };
        res.redirect('/');
    }
    catch (err) {
        console.error(err);
        req.session.message = {
            type:'error',
            text: 'Error adding user'
        };
        res.redirect('/add');
    }
})

// get all users route
router.get("/", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from MongoDB
        res.render('home', { title: 'Home Page', users: users }); // Pass users to template
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching users");
    }
});

// Delete a user by ID
router.get('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);
        req.session.message = { type: 'success', text: 'User deleted successfully!' };
        res.redirect('/');
    } catch (err) {
        req.session.message = { type: 'danger', text: 'Failed to delete user!' };
        res.redirect('/');
    }
});

//update user
router.get('/edit/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            req.session.message = { type: 'danger', text: 'User not found!' };
            return res.redirect('/');
        }
        res.render('edit', { title: 'Edit User', user });
    } catch (err) {
        req.session.message = { type: 'danger', text: 'Failed to load user data!' };
        res.redirect('/');
    }
});

// Post route to update user data
router.post('/update/:id', upload, async (req, res) => {
    const userId = req.params.id;
    const { name, email, phone } = req.body;
    let image = req.body.oldImage;

    if (req.file) {
        image = req.file.filename;
    }

    try {
        await User.findByIdAndUpdate(userId, {
            name,
            email,
            phone,
            image
        });
        req.session.message = { type: 'success', text: 'User updated successfully!' };
        res.redirect('/');
    } catch (err) {
        req.session.message = { type: 'danger', text: 'Failed to update user!' };
        res.redirect('/');
    }
});

router.get("/add",(req,res)=>{
    res.render('add',{title: 'Add Page'});
})

module.exports = router;