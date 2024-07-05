const Users = require("./../models/User");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");

const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      console.log(req.headers.authorization);
      token = req.headers.authorization.split(" ")[1];
    }

    console.log(token);

    if (!token) {
      throw new AppError("You're not logged in, please login", 401);
    }

    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log(decoded);

    const user = await Users.findOne(decoded.id);
    if (!user) {
      throw new AppError("User with specified ID not found", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const verifyIsAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new Error(
        "You are not authorized to access this route, this route belongs to admin users"
      );
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};


module.exports = { protectRoute, verifyIsAdmin }
