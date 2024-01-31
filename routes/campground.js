const router = require("express").Router();
const Campground = require("../models/Campground");
const Review = require("../models/Review");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("../schemas");
const {
  isLoggedIn,
  validateCampground,
  validateReview,
} = require("../middleware");

router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  console.log("campgroundsの一覧データ: ", campgrounds);
  return res.status(200).json(campgrounds);
});

router.get("/:id/detail", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate("reviews")
    .populate("author");
  console.log(campground);
  console.log(`${campground.title}の詳細データ`, campground);
  return res.status(200).json(campground);
});

router.post("/new", isLoggedIn, validateCampground, async (req, res) => {
  try {
    console.log(req.body);

    const campground = new Campground(req.body);
    // console.log(req.user);
    // campground.author = req.user._id;
    // console.log(campground);
    await campground.save();
    return res.status(200).json(campground);
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: error });
  }
});

router.put("/:id/edit", isLoggedIn, validateCampground, async (req, res) => {
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
    return res.status(500).json({ error: error });
  }
});

router.delete("/:id/delete", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    console.log("削除できました");
    return res.status(200).json("削除できました");
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: error });
  }
});

router.post("/:id/reviews", isLoggedIn, validateReview, async (req, res) => {
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
    return res.status(500).json(error);
  }
});

router.delete("/:id/reviews/:reviewId", isLoggedIn, async (req, res) => {
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
    return res.status(500).json(error);
  }
});

module.exports = router;
