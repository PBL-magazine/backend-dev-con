const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

/* 게시글에 달란 댓글 조회 기능 */
const getComments = async (req, res) => {
  const { post_id } = req.params;
  try {
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

/* 게시글에 댓글 등록 기능 */
const uploadComment = async (req, res) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;
  const { content } = req.body;

  try {
    await Comment.create({ user_id, post_id, content });
    // 코멘트 생성 완료되었으므로 => 201 Created
    return res.status(201).json({ ok: true });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

/* 게시글에 달린 댓글 수정 기능 */
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

/* 게시글에 달린 댓글 삭제 기능 */
const removeComment = async (req, res) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;

  try {
    // TODO: [요구사항 6] 관리자 권한 추가하여 모든 게시글, 댓글 삭제 가능하도록 (user의 role이 1이면 comment_id만으로 삭제가능)
    const user = await User.findOne({ where: user_id });
    if (user.role === 1) {
      await Comment.destroy({ where: { post_id } });
    } else {
      await Comment.destroy({ where: { post_id, user_id } });
    }

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
