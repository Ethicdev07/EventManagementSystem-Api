const dotenv = require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 8080;
console.log(port)

connectDB()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  