const router = require("express").Router();
const User = require("../models/User");

const passport = require("passport");
const jwt = require("jsonwebtoken");

// ユーザー登録
// router.post("/register", async (req, res) => {
//   try {
//     const newUser = new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: req.body.password,
//     });

//     const user = await newUser.save();
//     console.log("user: ", user);
//     return res.status(200).json(user);
//   } catch (error) {
//     console.log("error: ", error);
//     return res.status(500).json({ error: error });
//   }
// });

// passportの機能を使ったユーザー登録
router.post("/register", async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    const user = new User({ email: email, username: username });
    const newUser = await User.register(user, password);

    const token = jwt.sign({ userId: newUser._id }, "token", {
      expiresIn: "24h",
    });
    req.login(newUser, (error) => {
      if (error) {
        return next(error);
      }
      console.log("newUser: ", newUser);
      req.flash("success", "Yelp Campへようこそ!");
      return res.status(200).json({
        user: newUser,
        message: "ユーザーを作成しました",
        flash: req.flash("success"),
        token: token,
        // session: req.login(newUser),
      });
    });
  } catch (error) {
    req.flash("error", error.message);
    console.log("error: ", error);
    return res.status(500).json({ error: error, flash: req.flash("error") });
  }
});

// ログイン
// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     if (!user) {
//       console.log("ユーザーが見つかりません。");
//       return res.status(404).send("ユーザーが見つかりません");
//     }

//     const verifyPassword = req.body.password === user.password;
//     if (!verifyPassword) {
//       console.log("passwordが間違っています");
//       return res.status(400).json("パスワードが違います");
//     }

//     console.log("ログインできました");
//     return res.status(200).json(user);
//   } catch (error) {
//     console.log("error: ", error);
//     return res.status(500).json({ error: error });
//   }
// });

// passportの機能を使ったログイン機能
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "login",
  }),
  async (req, res) => {
    const user = req.user;

    const token = jwt.sign({ userId: user._id }, "token", { expiresIn: "24h" });

    req.flash("success", "おかえりなさい");
    const redirectUrl = (await req.session.returnTo) || "/api/campground";
    delete req.session.returnTo;
    console.log(user);
    console.log(token);
    console.log("ログインしました");
    return res.status(200).json({
      url: redirectUrl,
      message: "ログインしました",
      flash: req.flash("success"),
      token: token,
      // session: passport.authenticate("local", {
      //   failureFlash: true,
      //   failureRedirect: "login",
      // }),
    });
  }
);

// passportの機能を使ったログアウト機能
// router.get("/logout", (req, res) => {
//   req.logout();
//   req.flash("success", "ログアウトしました");
//   return res.status(200).json({
//     url: "/api/campground",
//     message: "ログアウトしました",
//     flash: req.flash("success"),
//   });
// });

router.post("/logout", (req, res) => {
  req.flash("success", "ログアウトしました");
  return res
    .status(200)
    .json({ message: "ログアウトしました", flash: req.flash("success") });
});

// router.get("/", (req, res) => {
//   res.send("auth router");
// });

module.exports = router;
