const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);
adminSchema.methods.getName = function () {
  return this.name;
}
adminSchema.methods.comparePassword = async function (Password, hashedPassword) {
  return await bcrypt.compare(Password, hashedPassword);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
