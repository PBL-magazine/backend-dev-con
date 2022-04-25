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

const userRouter = express.Router();

// TODO: [요구사항 3-3] 로그인한 사용자가 회원가입 또는 로그인 페이지 접근시 예외처리 (notSigninMiddleware 미들웨어 적용했음)
userRouter.post("/signup", notSigninMiddleware, signupValidator, signup);
userRouter.post("/signin", notSigninMiddleware, signinValidator, signin);

userRouter.get("/auth", protectorMiddleware, async (req, res) => {
  const { user } = res.locals;
  return res.status(200).send({ ok: true, user });
});

export default userRouter;
