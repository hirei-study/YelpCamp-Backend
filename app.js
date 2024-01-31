const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const cors = require("cors");
require("dotenv").config();

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const campgroundRoute = require("./routes/campground");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/User");
// const catchAsync = require("./utils/catchAsync");

const app = express();
// データベース接続
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DBと接続中...");
  })
  .catch((error) => {
    console.log("error: ", error);
  });

const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// ミドルウェア
app.use(morgan("dev")); // ログ用のミドルウェア
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// デモ用
app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "test@example.com", username: "testUser" });
  const newUser = await User.register(user, "test");
  console.log(newUser);
  return res.status(200).json(newUser);
});

// ルート
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/campground", campgroundRoute);

// 存在しないパスの時
app.all("*", (req, res, next) => {
  return next(new ExpressError("ページが見つかりません", 404));
});

// Errorが渡ってきた時
app.use((error, req, res, next) => {
  const { message = "問題が起きました", statusCode = 500 } = error;
  return res.status(statusCode).json(message);
});

app.listen(3000, () => {
  console.log("listening on port 3000...");
});
