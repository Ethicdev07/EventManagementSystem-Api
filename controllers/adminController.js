const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const signJWt = require("../utils/signJwt");


const signupAdmin = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return next(new AppError("Admin already exists", 400));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const admin = await Admin.create({ 
        email, 
        password: hashedPassword, 
        name 
    });

    if (!admin) {
     throw new AppError("Failed to create admin", 400);
    } 

    const token = signJWt(admin._id);

    res.status(201).json({
      status: "success",
      message: "Admin created successfully",
      data: {
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
        },
        token,
      },
    })
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const admin = await Admin.findOne({ email }).select("+password");
    console.log(admin)

    if (!admin || !(await admin.comparePassword(password, admin.password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = signJWt(admin._id);
    console.log(token)

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      data: {
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
        },
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = { signupAdmin, loginAdmin };