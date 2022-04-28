import express from "express";
import {
  notSigninMiddleware,
  protectorMiddleware,
} from "../middlewares/protectorMiddleware";
import {
  signupValidator,
  signinValidator,
} from "../middlewares/validatorMiddleware";
import { signin, signup } from "../controllers/userController";
import User from "../models/user";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

// TODO: [요구사항 3-3] 로그인한 사용자가 회원가입 또는 로그인 페이지 접근시 예외처리 (notSigninMiddleware 미들웨어 적용했음)
userRouter.post("/signup", notSigninMiddleware, signupValidator, signup);
userRouter.post("/signin", notSigninMiddleware, signinValidator, signin);

userRouter.get("/auth", protectorMiddleware, async (req, res) => {
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
  // @ts-ignore
  const { userId } = jwt.verify(authToken, process.env.JWT_SECRET);
  try {
    // @ts-ignore
    User.findByPk(userId).then((user) => {
      console.log(user);
      return res.status(200).send({ ok: true, user });
    });
  } catch (error) {
    // 해당 유저 검증 불가 => 401 Unauthorized
    console.log("유저 검증 불가");
    return res.status(401).json({
      ok: false,
      errorMessage: "로그인이 필요합니다.",
    });
  }

  // const { user } = res.locals;
  // return res.status(200).send({ ok: true, user });
});

export default userRouter;
