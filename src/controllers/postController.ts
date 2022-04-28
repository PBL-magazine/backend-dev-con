import Post from "../models/post";
import User from "../models/user";
import Like from "../models/like";
import { Request, Response } from "express";

/* 게시글 전체 조회 기능 */
export const getPosts = async (req: Request, res: Response) => {
  try {
    // 포스트, 라이크 테이블 조회를 병렬적으로 처리하기 위해 Promise.all 적용
    const [allPosts, allLikes] = await Promise.all([
      // @ts-ignore
      Post.findAll({
        attributes: { exclude: ["user_id", "deletedAt"] },
        include: {
          model: User,
          as: "author",
          attributes: ["user_id", "email", "nickname", "role"],
        },
      }),
      // @ts-ignore
      Like.findAll({}),
    ]);

    // 좋아요 데이터 포스트에 저장하기
    // 1. 좋아요 테이블 생성
    // 2. 좋아요 테이블 돌면서, 좋아요 테이블에 post_id 별 좋아요 로우를 배열로 저장
    // 3. 포스트 테이블 돌면서, post_id 별 좋아요 배열을 할당
    const likesTable: any = {}; // { '1': [like] }

    allLikes.forEach((like) => {
      // @ts-ignore
      if (!likesTable[like.post_id]) {
        // @ts-ignore
        likesTable[like.post_id] = [like];
      } else {
        // @ts-ignore
        likesTable[like.post_id].push(like);
      }
    });

    allPosts.forEach((post) => {
      // @ts-ignore
      post.dataValues.likes = likesTable[String(post.dataValues.post_id)] || []; // 라이크없으면 빈 배열이라도 발송
    });

    return res.json({ ok: true, rows: allPosts });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

/* 게시글 등록 기능 */
export const uploadPost = async (req: Request, res: Response) => {
  const {
    user: { user_id },
  } = res.locals;
  const { content } = req.body;
  // @ts-ignore
  const { path: image } = req.file;

  try {
    // @ts-ignore
    await Post.create({ content, image, user_id });
    // 포스트 생성 완료되었으므로 => 201 Created
    return res.status(201).json({ ok: true });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

/* 특정 게시글 조회 기능 */
export const detailPost = async (req: Request, res: Response) => {
  const { post_id } = req.params;

  try {
    const [post, likes] = await Promise.all([
      // @ts-ignore
      Post.findOne({
        attributes: { exclude: ["deletedAt"] },
        where: { post_id },
        include: {
          model: User,
          as: "author",
          attributes: ["user_id", "email", "nickname", "role"],
        },
      }),
      // @ts-ignore
      Like.findAll({ where: { post_id } }),
    ]);

    if (!post) {
      return res
        .status(400)
        .json({ ok: false, message: "게시글이 존재하지 않습니다." });
    }

    // 좋아요 데이터 post에 저장
    // @ts-ignore
    post.dataValues.likes = likes;

    return res.json({ ok: true, row: post });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

/* 게시글 수정 기능 */
export const editPost = async (req: Request, res: Response) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;
  let { content } = req.body;
  // @ts-ignore
  let { path: image } = req.file || "";

  // 게시글 내용 또는 이미지 안보내줄 경우 기존 게시글 또는 이미지 사용
  if (!content || !image) {
    // @ts-ignore
    const post = await Post.findOne({ where: { post_id } });
    // @ts-ignore
    if (!content) content = post.content;
    // @ts-ignore
    if (!image) image = post.image;
  }

  try {
    // @ts-ignore
    await Post.update({ content, image }, { where: { post_id, user_id } });

    return res.json({ ok: true });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

/* 게시글 삭제 기능 */
export const removePost = async (req: Request, res: Response) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;

  try {
    // @ts-ignore
    const user = await User.findOne({ where: user_id });
    // TODO: [요구사항 6] 관리자 권한 추가하여 모든 게시글, 댓글 삭제 가능하도록 (user의 role이 1이면 post_id만으로 삭제가능)
    // @ts-ignore
    if (user.role === 1) {
      // @ts-ignore
      await Post.destroy({ where: { post_id } });
    } else {
      // @ts-ignore
      await Post.destroy({ where: { post_id, user_id } });
    }

    return res.json({ ok: true });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  const {
    user: { user_id },
  } = res.locals;
  const { post_id } = req.params;

  try {
    // @ts-ignore
    const like = await Like.findOne({ where: { user_id, post_id } });
    if (like) {
      // @ts-ignore
      await Like.destroy({ where: { user_id, post_id } });
    } else {
      // @ts-ignore
      await Like.create({ user_id, post_id });
    }
    return res.json({ ok: true });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};
