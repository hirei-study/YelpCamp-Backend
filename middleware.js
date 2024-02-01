const { campgroundSchema, reviewSchema } = require("./schemas");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("req.user: ", req.user);
  if (!req.isAuthenticated()) {
    // 元々リクエストした場所を保存しておく
    console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    req.flash("error", "ログインしてください");
    return res.status(403).json("ログインしてください");
  }
  return next();
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
