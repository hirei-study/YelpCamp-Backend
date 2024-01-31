const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    // username: {
    //   type: String,
    //   required: true,
    //   min: 3,
    //   max: 25,
    //   unique: true,
    // },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    //   min: 6,
    //   max: 50,
    // },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 100,
    },
    city: {
      type: String,
      max: 70,
    },
  },
  {
    timestamps: true,
  }
);

// この定義をすることで「username, password(ハッシュ、ソルト)」はスキーマーに含まれる。passportLocalMongooseのドキュメントを読めば書いてある
userSchema.plugin(passportLocalMongoose, {
  errorMessages: {
    UserExistsError: "そのユーザー名は既に使用されています。",
    MissingPasswordError: "パスワードを入力してください。",
    AttemptTooSoonError:
      "アカウントがロックされています。時間を空けて再度試してください。",
    TooManyAttemptsError:
      "ログインの失敗が続いたため、アカウントをロックしました。",
    NoSaltValueStoredError: "認証ができませんでした。",
    IncorrectPasswordError: "パスワードまたはユーザー名が間違っています。",
    IncorrectUsernameError: "パスワードまたはユーザー名が間違っています。",
  },
});

module.exports = mongoose.model("User", userSchema);
