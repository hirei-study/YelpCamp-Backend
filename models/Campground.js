const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("../models/Review");

const campgroundSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    images: String,
    description: {
      type: String,
      max: 5000,
    },
    location: {
      type: String,
      required: true,
    },
    author: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

campgroundSchema.post("findOneAndDelete", async function (doc) {
  // console.log("削除: ", doc);
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
