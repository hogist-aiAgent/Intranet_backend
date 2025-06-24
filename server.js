const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyparser = require("body-parser");
const authRoute=require('./routes/User')
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.get("/api", (req, res) => {
  res.status(200).json({ message: "API is working fine!" });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
app.listen(7002, () => {
  console.log("Server is running on port 7002");
});
