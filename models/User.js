const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please add a first name"],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, "Please add a last name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [8, "Password must be up to 8 characters"],
        select: false
    },
    bio: {
        type: String,
        default: "Bio here",
        trim: true
    },
    profile_images: {
        type:  String,
        default: "https://asset.cloudinary.com/dzevwuugz/9eb72e1358fd2ce5bd445af83c7c2504",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user", 
    },
    verification_token: {
        type: String,
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    reset_password_token: {
        type: String,
    },
    
});

UserSchema.methods.getFullname = function () {
    return `${this.firstname} ${this.lastname}`;
};

UserSchema.methods.comparePassword = async function (password, hashedpassowrd) {
    return await bcrypt.compare(password, hashedpassowrd);
};

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;