const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  images: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required(),
  body: Joi.string().required(),
});

module.exports.postSchema = Joi.object({
  userId: Joi.string().required(),
  desc: Joi.string(),
  image: Joi.string(),
  likes: Joi.array(),
});

module.exports.userSchema = Joi.object({});

// username: {
//   type: String,
//   required: true,
//   min: 3,
//   max: 25,
//   unique: true,
// },
// email: {
//   type: String,
//   required: true,
//   max: 50,
//   unique: true,
// },
// password: {
//   type: String,
//   required: true,
//   min: 6,
//   max: 50,
// },
// profilePicture: {
//   type: String,
//   default: "",
// },
// coverPicture: {
//   type: String,
//   default: "",
// },
// followers: {
//   type: Array,
//   default: [],
// },
// followings: {
//   type: Array,
//   default: [],
// },
// isAdmin: {
//   type: Boolean,
//   default: false,
// },
// desc: {
//   type: String,
//   max: 100,
// },
// city: {
//   type: String,
//   max: 70,
// },
