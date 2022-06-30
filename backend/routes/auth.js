const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



//Route1: creating an user using : POST "api/auth/createuser" no login required
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password atleast of 8 character').isLength({min: 8})
],async (req, res) =>{
    let success = false;
    //if there are errors return bad request
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({success, errors: errors.array() })
    }
    //check weather the user is exist with this id already 
    try {
        let user = await User.findOne({email: req.body.email});
        if(user){
            sucees:false;
            return res.status(404).json({success , error: "Sorry a user with this id already exist "})
        }
        //create salt
        const salt = await bcrypt.genSalt(10);
        //secure password
        const secPas = await bcrypt.hash(req.body.password, salt);
        //create a new user
        user = await User.create({
            name: req.body.name,
            email:req.body.email,
            password:secPas
        })

        const data = {
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_TOKEN);
        success = true;
        res.json({success, authToken});

    } 
    //catch errors if exist
    catch (error) {
        console.error(error.message);
        res.status(500).json("Internal Server Error.");
    }
});

//Route2: Authentication of user using : POST "api/auth/login" no login required
router.post('/login',[
    body('email', 'enter a valid email').isEmail(),
    body('password', 'Password can not be empty').exists()
], async (req,res)=>{
    let success = false;
    //if there are errors return bad request
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({success, errors: errors.array()})
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email})
        if(!user){
            success: false;
            return res.status(400).json({success, error: "Please try to login with correct credentials"})   
        }
        const passwordCompare = await bcrypt.compare(password , user.password)
        if(!passwordCompare){
            success:false;
            return res.status(400).json({success, error: "Please try to login with correct credentials"})   
        }

        const data ={
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_TOKEN);
        success = true;
        res.json({success, authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal Server error");
    }

})






module.exports = router;