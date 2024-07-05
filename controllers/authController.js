const Users = require("./../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signJWt = require("./../utils/signJwt");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");
const AppError = require("./../utils/AppError");
const { validateUserSignup } = require("./../validations/userValidation");
const { validateUserLogin } = require("./../validations/userValidation");

const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const { error } = validateUserSignup(req.body);
    if (error) {
      throw new AppError(error?.message, 404);
    }

    const { firstname, lastname, email, password } = req.body;
    console.log(password);
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      throw new AppError("User with the email address already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const user = await Users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new AppError("Failed to create user account");
    }

    const options = {
      email: email,
      subject: "Welcome to EventLab, where events management gets better",
      message:
        "Welcome Onboard. We're pleased to have you. Please keep your eyes peeled for the verification link which you will recieve soon. \n Book events with ease.",
    };
    await sendEmail(options);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log(verificationToken);

    const hashedVerificationToken = await bcrypt.hash(verificationToken, salt);
    console.log(hashedVerificationToken);

    user.verification_token = hashedVerificationToken;
    await user.save();


    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/event/v1/auth/verify/${user.email}/${verificationToken}`;

    const verificationMessage = `Please click on the verification link to verify your email. \n ${verificationUrl}`;

    const verificationMailOptions = {
      email: email,
      subject: "verify your email address",
      message: verificationMessage,
    };

    await sendEmail(verificationMailOptions);

    
    const token = signJWt(user._id);

    res.status(201).json({
      status: "sucess",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = validateUserLogin(req.body);
    if (error) {
      throw new AppError(error?.message, 404);
    }

    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Please provide email and password");
    }

    const user = await Users.findOne({ email }).select("+password");
    console.log(user);

    if (!user || !(await user.comparePassword(password, user.password))) {
      throw new ApppError("Invalid email or password");
    }

    const token = signJWt(user._id);
    res.status(200).json({
      status: "sucess",
      message: "User logged in successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const verifyEmailAddress = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.params;
    console.log(verificationToken);

    if (!email || !verificationToken) {
      throw new Error("Please provide email and token");
    }

    // check if user with the email exist
    const user = await Users.findOne({ email });
    if (!user) {
      throw new Error("User with the email not found");
    }

    const tokenValid = await bcrypt.compare(
      verificationToken,
      user.verification_token
    );

    if (!tokenValid) {
      throw new Error("failed to verify user - Invalid token");
    }

    user.email_verified = true;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "User verified successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppErrorr("Please provide email address", 404);
    }

    const user = await Users.findOne({ email });
    if (!user) {
      throw new AppError("User with email not found", 404);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/event/v1/auth/resetpassword/${email}/${resetToken}`;

    const resetMessage = `Please click on the link to reset your password. \n ${resetUrl}`;

    const resetMailOptions = {
      email: email,
      subject: "Reset your password",
      message: resetMessage,
    };

    await sendEmail(resetMailOptions);

    user.reset_password_token = hashedResetToken;
    await user.save();

    res.status(200).json({
      status: "sucess",
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    if (!email || !resetToken || !password || !confirmPassword) {
      throw new AppError("Please provide all required fields", 404);
    }

    const user = await Users.findOne({ email });
    if (!user) {
      throw new AppError("User with the email not found", 404);
    }

    const tokenValid = await bcrypt.compare(
      resetToken,
      user.reset_password_token
    );
    if (!tokenValid) {
      throw new AppError("Invalid password reset token", 404);
    }

    const salt = bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    user.password = hashedpassword;
    user.reset_password_token = undefined;
    await user.save();

    res.status(200).json({
      status: "Sucess",
      message: "Password reset sucessfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  signup,
  login,
  verifyEmailAddress,
  forgotPassword,
  resetPassword,
};
