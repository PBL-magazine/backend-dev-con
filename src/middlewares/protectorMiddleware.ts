import dotenv from "dotenv";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

// TODO: [요구사항 4] 본인이 선택한 Status Code의 반환 이유를 설명하기
/* 로그인 여부 확인하여 예외 처리 */
export const protectorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    // 로그인 확인 불가 => 401 Unauthorized
    console.log("로그인 확인 불가");
    return res.status(401).json({
      ok: false,
      errorMessage: "로그인이 필요합니다.",
    });
  }

  try {
    console.log("try구문 시작");
    // @ts-ignore
    const { userId } = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log(`userId ${userId}`);
    // @ts-ignore
    User.findByPk(userId).then((user) => {
      console.log(`user: ${user}`);
      res.locals.user = user;
      next();
    });
  } catch (error) {
    // 해당 유저 검증 불가 => 401 Unauthorized
    console.log("유저 검증 불가");
    return res.status(401).json({
      ok: false,
      errorMessage: "로그인이 필요합니다.",
    });
  }
};

/* 로그인 여부 확인하여 예외 처리 (비로그인시 통과) */
export const notSigninMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    // 로그인 확인 불가 => 통과
    return next();
  } else {
    // 토큰 있으면 로그인된 것으로 판단
    // 로그인 된 경우 접근 불가 => 400 Bad Request
    return res
      .status(400)
      .json({ ok: false, message: "이미 로그인이 되어 있습니다." });
  }
};
