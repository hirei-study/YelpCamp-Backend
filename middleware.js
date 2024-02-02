const jwt = require("jsonwebtoken");
const { campgroundSchema, reviewSchema } = require("./schemas");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("req.user: ", req.user);
  // フロントから送られてくるトークン
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (token) {
    // トークンがある場合、検証してユーザーを取得
    jwt.verify(token, "token", (error, decoded) => {
      if (error) {
        req.flash("error", "トークンが無効です");
        console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        return res
          .status(403)
          .json({ message: "トークンが無効です", flash: req.flash("error") });
      }

      // トークンが有効な場合、ユーザーをreq.userにセット
      req.user = { _id: decoded.userId };
      return next();
    });
  } else {
    // ログインしている場合、next()を呼ぶ
    return next();
  }
  // if (!req.isAuthenticated()) {
  //   // 元々リクエストした場所を保存しておく
  //   console.log(req.path, req.originalUrl);
  //   req.session.returnTo = req.originalUrl;
  //   req.flash("error", "ログインしてください");
  //   return res
  //     .status(403)
  //     .json({ message: "ログインしてください", flash: req.flash("error") });
  // }
  // return next();
};

module.exports.validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);
  if (result.error) {
    console.log(result.error.details);
    const msg = result.error.details.map((detail) => detail.message).join(", ");
    console.log("msg: ", msg);
    return res.status(400).json(msg);
  } else {
    return next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    console.log(result.error.details);
    const msg = result.error.details.map((detail) => detail.message).join(", ");
    console.log("msg: ", msg);
    return res.status(400).json(msg);
  } else {
    return next();
  }
};
