const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");

const getPosts = async (req, res) => {
  try {
    // 포스트, 라이크 테이블 조회를 병렬적으로 처리하기 위해 Promise.all 적용
    const [allPosts, allLikes] = await Promise.all([
      Post.findAll({
        attributes: { exclude: ["user_id", "deletedAt"] },
        include: {
          model: User,
          as: "author",
          attributes: ["user_id", "email", "nickname", "role"],
        },
      }),
      Like.findAll({}),
    ]);

    // 좋아요 수 포스트에 저장하기
    // 1. 좋아요 테이블 생성
    // 2. 좋아요 테이블 돌면서, 좋아요 테이블에 post_id 별 좋아요 로우를 배열로 저장
    // 3. 포스트 테이블 돌면서, post_id 별 좋아요 배열을 저장
    const likesTable = {}; // { '1': [like] }

    allLikes.forEach((like) => {
      if (!likesTable[like.post_id]) {
        likesTable[like.post_id] = [like];
      } else {
        likesTable[like.post_id].push(like);
      }
    });

    allPosts.forEach((post) => {
      post.dataValues.likes = likesTable[String(post.dataValues.post_id)];
    });

    return res.json({ ok: true, posts: allPosts });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const uploadPost = async (req, res) => {
  const {
    user: { user_id },
  } = res.locals;
  const { content } = req.body;
  const { path: image } = req.file;

  try {
    // TODO: content, image, user_id 중 하나라도 없으면 예외 처리
    await Post.create({ content, image, user_id });
    // 포스트 생성 완료되었으므로 => 201 Created
    return res.status(201).json({ ok: true });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const detailPost = async (req, res) => {
  const { post_id } = req.params;

  try {
    const [post, likes] = await Promise.all([
      Post.findOne({
        attributes: { exclude: ["user_id", "deletedAt"] },
        where: {
          post_id,
        },
        include: {
          model: User,
          as: "author",
          attributes: ["user_id", "email", "nickname", "role"],
        },
      }),
      Like.findAll({ where: { post_id } }),
    ]);

    if (!post) {
      return res
        .status(400)
        .json({ ok: false, message: "게시글이 존재하지 않습니다." });
    }

    // 좋아요 수, 좋아요한 사람인지 여부 post에 저장
    post.dataValues.likes = likes;

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
