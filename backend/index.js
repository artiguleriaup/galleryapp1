const connectToMongo = require('./db');
connectToMongo();
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
const port = 5000;
//jwt secret token
JWT_TOKEN = "testing@jwt"

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
  
app.use(express.json());
app.use(cors());



//available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gallery', require('./routes/gallery'));




app.listen(port , () =>{
    console.log(`Gallery app listening to ${port}`);
});