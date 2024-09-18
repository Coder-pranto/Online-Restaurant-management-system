const express = require("express");
const cors = require("cors");
const session = require('express-session');
const morgan = require('morgan');
const app = express();
const Routes = require("./routes/v1/index");
const errorHandler = require("./middleware/errorHandler");
const CustomError = require("./utils/customError");
const cookieParser = require("cookie-parser");
const { super_admin_token } = require("./config");
const path = require('path')

// global middlewares
app.use(cors({
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));


app.use(express.json());
app.use(morgan('tiny'));
// app.use(viewCount);
// app.use(limiter);

// application middlewares
//for local use 
// app.use("/api/v1", Routes);
// app.use("/api/v1", express.static(path.join(__dirname, "images")));

// for hosting purpose
app.use("/api/v1", Routes);
app.use("/api/v1/images", express.static("images"));

//server root Route
app.get("/", async (req, res) => {
  // const id = await generateRestaurantUniqueId();
  res.send('E-Food server is running');
});


// route not found middleware
app.use((req, res, next) => {
  next(new CustomError(`No route found in ${req.url}`, 404))
});

// global error handler middleware
app.use(errorHandler);


module.exports = app;
