const mongoose = require("mongoose");
const Campground = require("../models/Campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
require("dotenv").config();

mongoose
  .connect(process.env.MONGOURL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB connected OK!!");
  })
  .catch((err) => {
    console.log("MongoDB connection failed");
    console.log(err);
  });

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomCityIndex = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 5000) + 1000;
    const camp = new Campground({
      author: "65b348d71ce7ed07e4bf7233",
      location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
      title: `${sample(descriptors)}・${sample(places)}`,
      images: "https://source.unsplash.com/collection/483251",
      // images: [
      //   {
      //     url: "https://res.cloudinary.com/avis-connect-license/image/upload/v1705379270/YelpCamp/yiouu3rqbrlusgzk6ctc.jpg",
      //     filename: "YelpCamp/yiouu3rqbrlusgzk6ctc",
      //   },
      //   {
      //     // url: "https://res.cloudinary.com/avis-connect-license/image/upload/v1705379271/YelpCamp/sflbjuhnpvrz9vmnrg0b.jpg",
      //     // filename: "YelpCamp/sflbjuhnpvrz9vmnrg0b",
      //     url: "https://res.cloudinary.com/avis-connect-license/image/upload/v1705379273/YelpCamp/u9zzxkhsmo2qi0resng0.jpg",
      //     filename: "YelpCamp/u9zzxkhsmo2qi0resng0",
      //   },
      //   {
      //     url: "https://res.cloudinary.com/avis-connect-license/image/upload/v1705379273/YelpCamp/u9zzxkhsmo2qi0resng0.jpg",
      //     filename: "YelpCamp/u9zzxkhsmo2qi0resng0",
      //   },
      // ],
      description:
        "木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。東ざかいの桜沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、二十二里余にわたる長い谿谷の間に散在していた。道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。",
      price: price,
      // geometry: {
      //   type: "Point",
      //   coordinates: [
      //     cities[randomCityIndex].longitude,
      //     cities[randomCityIndex].latitude,
      //   ],
      // },
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
