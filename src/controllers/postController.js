const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");

const getPosts = async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      attributes: { exclude: ["user_id", "deletedAt"] },
      include: {
        model: User,
        as: "author",
        attributes: ["user_id", "email", "nickname", "role"],
      },
    });

    // 좋아요 수 포스트에 저장하기
    // 1. 좋아요 테이블 생성
    // 2. 좋아요 테이블 돌면서, 좋아요 테이블에 post_id 별로 좋아요 수 count 저장
    // 3. 포스트 테이블 돌면서, post_id 별 좋아요 count 할당
    const likesTable = {}; // { '1': 1 }
    // TODO: 종아요의 주인인지 아닌지도 판단할 수 있게 좋아요 주인id도?
    const allLikes = await Like.findAll({});
    allLikes.forEach((like) => {
      if (!likesTable[like.post_id]) {
        likesTable[like.post_id] = 1;
      } else {
        likesTable[like.post_id] += 1;
      }
    });

    allPosts.map((post) => {
      post.dataValues.likes = likesTable[String(post.dataValues.post_id)];
    });

    return res.json({ ok: true, posts: allPosts });
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

    post.dataValues.likes = await Like.count({ where: { post_id } });
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
