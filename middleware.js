const jwt = require("jsonwebtoken");
const { campgroundSchema, reviewSchema } = require("./schemas");

module.exports.verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "トークンが提供されていません" });
  }

  jwt.sign(token, "secret", (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "トークンが無効です" });
    }

    req.userId = decoded.userId;
    return next();
  });
};

module.exports.isLoggedIn = (req, res, next) => {
  // フロントから送られてくるトークン
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  console.log(token);

  if (token) {
    // トークンがある場合、検証してユーザーを取得
    jwt.verify(token, "token", (error, decoded) => {
      if (error) {
        req.flash("error", "ログインしてください");
        console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        return res
          .status(403)
          .json({ message: "ログインしてください", flash: req.flash("error") });
      }

      // トークンが有効な場合、ユーザーをreq.userにセット
      req.user = { _id: decoded.userId };
      console.log(req.user);
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
