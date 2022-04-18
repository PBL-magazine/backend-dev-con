const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const getComments = async (req, res) => {
  const { post_id } = req.params;
  try {
    // 포스트, 라이크 테이블 조회를 병렬적으로 처리하기 위해 Promise.all 적용
    const comments = await Comment.findAll({
      where: { post_id },
      attributes: { exclude: ["deletedAt"] },
      include: [{ model: User }, { model: Post }],
    });

    return res.json({ ok: true, comments });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const uploadComment = async (req, res) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;
  const { content } = req.body;
  // TODO: user_id, post_id, content 중 하나라도 없으면 예외 처리

  try {
    await Comment.create({ user_id, post_id, content });
    // 코멘트 생성 완료되었으므로 => 201 Created
    return res.status(201).json({ ok: true });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const editComment = async (req, res) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;
  const { content } = req.body;

  try {
    await Comment.update({ content }, { where: { user_id, post_id } });

    return res.json({ ok: true });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const removeComment = async (req, res) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;
  try {
    await Comment.destroy({ where: { post_id, user_id } });

    return res.json({ ok: true });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

module.exports = {
  getComments,
  uploadComment,
  editComment,
  removeComment,
};
