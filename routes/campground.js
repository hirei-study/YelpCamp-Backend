const router = require("express").Router({ mergeParams: true });
const Campground = require("../models/Campground");
const Review = require("../models/Review");
const {
  isLoggedIn,
  validateCampground,
  validateReview,
  verifyToken,
} = require("../middleware");

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  // console.log("campgroundsの一覧データ: ", campgrounds);
  return res.status(200).json(campgrounds);
});

router.get("/:id/detail", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate("reviews")
    .populate("author");
  console.log(campground);
  if (!campground) {
    return res
      .status(403)
      .json({ message: "キャンプ場は見つかりませんでした" });
  }
  console.log(`${campground.title}の詳細データ`, campground);
  return res.status(200).json(campground);
});

// isLoggedIn, validateCampground,
router.post("/new", verifyToken, validateCampground, async (req, res, next) => {
  try {
    console.log(req.body);

    const campground = new Campground(req.body);
    // campground.author = req.user._id;
    await campground.save();
    req.flash("success", "新しいキャンプ場を作成しました");
    return res
      .status(200)
      .json({ campground: campground, message: req.flash("success") });
  } catch (error) {
    console.log("error: ", error);
    next(error);
    return res.status(500).json({ error: error });
  }
});

// isLoggedIn, validateCampground,
router.put(
  "/:id/edit",
  verifyToken,
  validateCampground,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const campground = await Campground.findByIdAndUpdate(id, {
        $set: req.body,
      });
      console.log("更新できました: ", campground);
      return res.status(200).json({
        campground: campground,
        message: "更新できました",
      });
    } catch (error) {
      console.log("error: ", error);
      next(error);
      return res.status(500).json({ error: error });
    }
  }
);

// isLoggedIn,
router.delete("/:id/delete", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    console.log("削除できました");
    return res.status(200).json("削除できました");
  } catch (error) {
    console.log("error: ", error);
    next(error);
    return res.status(500).json({ error: error });
  }
});

// isLoggedIn,
router.post(
  "/:id/reviews",
  verifyToken,
  validateReview,
  async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    try {
      const campground = await Campground.findById(id);
      const review = await Review(req.body);
      campground.reviews.push(review);
      await review.save();
      await campground.save();
      console.log("レビューが投稿されました");
      return res.status(200).json("レビューが投稿されました");
    } catch (error) {
      console.log("error: ", error);
      next(error);
      return res.status(500).json(error);
    }
  }
);

// isLoggedIn
router.delete("/:id/reviews/:reviewId", verifyToken, async (req, res, next) => {
  const { id, reviewId } = req.params;
  try {
    const a = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    const b = await Review.findByIdAndDelete(reviewId);
    console.log("a: ", a, "b: ", b);
    console.log("レビューを削除しました");
    return res.status(200).json("レビューを削除しました");
  } catch (error) {
    console.log("error: ", error);
    next(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
