const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: { exclude: ["user_id", "deletedAt"] },
      include: {
        model: User,
        as: "author",
        attributes: ["user_id", "email", "nickname", "role"],
      },
    });

    // TODO: likes 보내줘야함
    return res.json({ ok: true, posts });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const uploadPost = async (req, res) => {
  // const { user } = res.locals;
  const user_id = 1;
  const { content } = req.body;
  const { path: image } = req.file;

  try {
    // TODO: content, image, user_id 중 하나라도 없으면 예외 처리
    await Post.create({ content, image, user_id });
    // 포스트 생성 완료되었으므로 => 201 Created
    return res.status(201).json({});
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const detailPost = async (req, res) => {
  const { post_id } = req.params;
  try {
    const post = await Post.findOne({
      attributes: { exclude: ["user_id", "deletedAt"] },
      where: {
        post_id,
      },
      include: {
        model: User,
        as: "author",
        attributes: ["user_id", "email", "nickname", "role"],
      },
    });
    if (!post) {
      return res
        .status(400)
        .json({ ok: false, message: "게시글이 존재하지 않습니다." });
    }

    return res.json({ ok: true, post });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const editPost = async (req, res) => {
  const { post_id } = req.params;
  const { content } = req.body;
  const { path: image } = req.file;

  try {
    await Post.update(
      {
        content,
        image,
      },
      {
        where: {
          post_id,
        },
      }
    );

    return res.json({ ok: true });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const removePost = async (req, res) => {
  const { post_id } = req.params;
  try {
    await Post.destroy({
      where: { post_id },
    });

    return res.json({ ok: true });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const toggleLike = async (req, res) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;

  try {
    const like = await Like.findOne({ where: { user_id, post_id } });
    if (like) {
      await Like.destroy({ where: { user_id, post_id } });
    } else {
      await Like.create({ user_id, post_id });
    }

    return res.json({ ok: true });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

module.exports = {
  getPosts,
  uploadPost,
  detailPost,
  editPost,
  removePost,
  toggleLike,
};
