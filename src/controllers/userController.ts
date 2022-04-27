import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user";
import { Request, Response } from "express";

dotenv.config();

// TODO: [요구사항 4] 본인이 선택한 Status Code의 반환 이유를 설명하기
/* 회원가입 기능 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, nickname, password, role } = req.body;

    // @ts-ignore
    const findUserByEmail = await User.findOne({
      where: { email },
    });
    if (findUserByEmail !== null) {
      // 이메일 사용중 => 409 Conflict
      return res.status(409).json({
        ok: false,
        message: "이메일이 이미 사용중입니다.",
      });
    }

    // @ts-ignore
    const findUserByNickname = await User.findOne({
      where: { nickname },
    });
    if (findUserByNickname !== null) {
      // 닉네임 사용중 => 409 Conflict
      return res.status(409).json({
        ok: false,
        message: "닉네임이 이미 사용중입니다.",
      });
    }

    // @ts-ignore
    await User.create({ email, nickname, password, role });
    // 유저 생성 완료되었으므로 => 201 Created
    return res.status(201).json({ ok: true });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

// TODO: [요구사항 4] 본인이 선택한 Status Code의 반환 이유를 설명하기
/* 로그인 기능 */
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // @ts-ignore
    const user = await User.findOne({ where: { email } });

    // @ts-ignore
    if (!user || password !== user.password) {
      // TODO: [요구사항 2] 이메일 또는 비밀번호가 DB와 맞지 않는 경우 예외처리
      // 이메일 또는 패스워드 잘못 요청 => 400 Bad Request
      return res.status(400).json({
        ok: false,
        message: "이메일 또는 패스워드를 확인해 주세요.",
      });
    }

    return res
      .status(201)
      .cookie(
        "token",
        // @ts-ignore
        jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET)
      )
      .json({ ok: true });
  } catch (error: any) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};
