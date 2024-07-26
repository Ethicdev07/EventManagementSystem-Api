const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const errorHandler = require('./middleware/error');
const { cloudinaryConfig } = require('./utils/cloudinary');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cors("*"));
app.use("*", cloudinaryConfig);

app.get("/", (req, res)=>{
    res.status(200).json({
        status: "success",
        message: "welcome to eventlab"
    });
});

app.get("/event/v1", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "welcome to eventLab",
    });
});


app.use("/event/v1/auth", authRoutes);
app.use("/event/v1/user", userRoutes);
app.use("/event/v1/admin", adminRoutes);


app.all("*", (req, res)=>{
    res.status(404).json({
        status: "fail",
        message: `can't find ${req.originalUrl} with method ${req.method} on this server. Route not defined`,
    });
});

app.use(errorHandler);

module.exports = app