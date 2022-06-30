const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const multer = require('multer'); 
const { Result } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) =>{
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
    cb(null, false);
    }
    
}


const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
});

//Route1: posting images using : POST "api/gallery/addimage"  login required
router.post('/addimage',upload.single('image'),fetchuser,(req, res) => {
    console.log(req.file.filename);
  try{
   const gallery = new Gallery({
       user:req.user.id,
       image: req.file.path  
   })
   gallery
   .save()
   .then(result =>{
       console.log(result);
   })
}catch(error){
    console.error(error.message);
    res.status(500).json("Internal Server error");
}
})

//Route2: fetch all images using : "GET" '/api/gallery/fetchallimages' login require
router.get('/fetchallimages', fetchuser , async (req, res)=>{
    try {
        let gallery = await Gallery.find({user: req.user.id}); 
        res.send(gallery);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal Server Error.");
    }
})




module.exports = router;