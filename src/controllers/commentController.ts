import Post from "../models/post";
import User from "../models/user";
import Comment from "../models/comment";
import { Request, Response } from "express";

/* 게시글에 달란 댓글 조회 기능 */
export const getComments = async (req: Request, res: Response) => {
  const { post_id } = req.params;
  try {
    // @ts-ignore
    const comments = await Comment.findAll({
      where: { post_id },
      attributes: { exclude: ["deletedAt"] },
      include: [
        { model: User, attributes: ["user_id", "email", "nickname", "role"] },
        { model: Post, attributes: ["post_id"] },
      ],
    });

    return res.json({ ok: true, rows: comments });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

/* 게시글에 댓글 등록 기능 */
export const uploadComment = async (req: Request, res: Response) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;
  const { content } = req.body;

  try {
    // @ts-ignore
    await Comment.create({ user_id, post_id, content });
    // 코멘트 생성 완료되었으므로 => 201 Created
    return res.status(201).json({ ok: true });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

/* 게시글에 달린 댓글 수정 기능 */
export const editComment = async (req: Request, res: Response) => {
  const {
    user: { user_id },
  } = res.locals;
  const { comment_id } = req.params;
  const { content } = req.body;

  try {
    // @ts-ignore
    await Comment.update({ content }, { where: { user_id, comment_id } });

    return res.json({ ok: true });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

/* 게시글에 달린 댓글 삭제 기능 */
export const removeComment = async (req: Request, res: Response) => {
  const {
    user: { user_id },
  } = res.locals;
  const { comment_id } = req.params;

  try {
    // TODO: [요구사항 6] 관리자 권한 추가하여 모든 게시글, 댓글 삭제 가능하도록 (user의 role이 1이면 comment_id만으로 삭제가능)
    // @ts-ignore
    const user = await User.findOne({ where: user_id });
    // @ts-ignore
    if (user.role === 1) {
      // @ts-ignore
      await Comment.destroy({ where: { comment_id } });
    } else {
      // @ts-ignore
      await Comment.destroy({ where: { user_id, comment_id } });
    }

    return res.json({ ok: true });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};
