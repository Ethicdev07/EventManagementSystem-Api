const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cors("*"));

app.get("/", (req, res)=>{
    res.status(200).json({
        status: "success",
        message: "welcome to eventlab"
    });
});


module.exports = app