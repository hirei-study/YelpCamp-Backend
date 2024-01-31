const User = require("../models/User");
const router = require("express").Router();

// CRUD
// ユーザー情報の更新
router.put("/:id/update", async (req, res) => {
  const { id } = req.params;
  if (req.body.userId === id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(id, {
        $set: req.body,
      });
      console.log(user);
      return res.status(200).json("ユーザー情報が更新されました");
    } catch (error) {
      console.log("error: " + error);
      return res.status(500).json({ error: error });
    }
  } else {
    console.log("更新できません。自身のアカウントか確認してください");
    return res.status(403).json("自身のアカウントしか情報を更新できません");
  }
});

// ユーザー情報の削除
router.delete("/:id/delete", async (req, res) => {
  const { id } = req.params;
  if (req.body.userId === id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(id);
      console.log(user);
      return res.status(200).json("ユーザー情報が削除されました");
    } catch (error) {
      console.log("error: " + error);
      return res.status(500).json({ error: error });
    }
  } else {
    console.log("削除できません。自身のアカウントか確認してください");
    return res.status(403).json("自身のアカウントしか情報を削除できません");
  }
});

// ユーザー情報の取得
router.get("/:id/get", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user);
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({ error: error });
  }
});

// ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  const { id } = req.params;
  if (req.body.userId !== id) {
    try {
      // フォローする相手のID
      const user = await User.findById(id);
      // 自身のID
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに自分が居なかったらフォローできる
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: id,
          },
        });
        return res.status(200).json("フォローに成功しました");
      } else {
        return res
          .status(403)
          .json("あなたは既にこのユーザーをフォローしています");
      }
    } catch (error) {
      console.log("error: " + error);
      return res.status(500).json({ error: error });
    }
  } else {
    console.log("自身をフォローできません");
    return res.status(500).json("自身をフォローできません");
  }
});

// ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  const { id } = req.params;
  if (req.body.userId !== id) {
    try {
      // フォローする相手のID
      const user = await User.findById(id);
      // 自身のID
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに存在したらフォローを外せる
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: id,
          },
        });
        return res.status(200).json("フォローを解除しました");
      } else {
        return res
          .status(403)
          .json(
            "このユーザーはフォロー解除できません。既にフォローを解除している、または、フォローしていない可能性があります"
          );
      }
    } catch (error) {
      console.log("error: " + error);
      return res.status(500).json({ error: error });
    }
  } else {
    console.log("自身をフォロー解除できません");
    return res.status(500).json("自身をフォロー解除できません");
  }
});

// router.get("/", (req, res) => {
//   res.send("user router");
// });

module.exports = router;
