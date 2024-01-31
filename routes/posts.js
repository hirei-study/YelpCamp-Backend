const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { postSchema } = require("../schemas");

const validatePost = (req, res, next) => {
  const result = postSchema.validate(req.body);
  if (result.error) {
    console.log(result.error.details);
    const msg = result.error.details.map((detail) => detail.message).join(", ");
    console.log("msg: ", msg);
    return res.status(400).json(msg);
  } else {
    return next();
  }
};

// 投稿を作成する
router.post("/create", validatePost, async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    console.log("Saved post: ", savedPost);
    return res.status(200).json(savedPost);
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json(error);
  }
});

// 投稿を更新する
router.put("/update/:id", validatePost, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res
        .status(200)
        .json("投稿の編集は成功しました。内容を確認してください。");
    } else {
      console.log("他の人の投稿を編集することはできません!");
      return res.status(403).json("他の人の投稿を編集することはできません!");
    }
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json(error);
  }
});

// 投稿を削除する
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res
        .status(200)
        .json("投稿の削除に成功しました。内容を確認してください。");
    } else {
      console.log("他の人の投稿を削除することはできません!");
      return res.status(403).json("他の人の投稿を削除することはできません!");
    }
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json(error);
  }
});

// 投稿を取得する
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    return res.status(200).json(post);
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json(error);
  }
});

// 特定の投稿にいいねを押す
router.put("/:id/like", validatePost, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    // まだ投稿にいいねが押されていなかったらいいねが押せる
    // includes...含めるという意味。
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      console.log("投稿にいいねを押しました");
      return res.status(200).json("投稿にいいねを押しました");
      // 投稿に既にいいねが押されていたら、いいねをしているユーザーIDを取り除く(いいね押していない状態)
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      console.log("この投稿のいいねを取り消しました");
      return res.status(403).json("この投稿のいいねを取り消しました");
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(error);
  }
});

// タイムラインの投稿を取得
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });

    // 自分がフォローしているユーザーの投稿内容を全て取得する
    const followerPosts = await Promise.all(
      currentUser.followings.map((followerId, index) => {
        return Post.find({ userId: followerId });
      })
    );
    return res.status(200).json(userPosts.concat(...followerPosts));
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(error);
  }
});

module.exports = router;
