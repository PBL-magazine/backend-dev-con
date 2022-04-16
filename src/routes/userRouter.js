const express = require("express");
const userRouter = express.Router();
const {
  protectorMiddleware,
  notSigninMiddleware,
} = require("../middlewares/protectorMiddleware");
const {
  signupValidator,
  signinValidator,
} = require("../middlewares/validatorMiddleware");

const { signup, signin } = require("../controllers/userController");

userRouter.post("/signup", notSigninMiddleware, signupValidator, signup);
userRouter.post("/signin", notSigninMiddleware, signinValidator, signin);

// TODO: user 받아오는지 확인 => 삭제할 것
userRouter.get("/me", protectorMiddleware, async (req, res) => {
  const { user } = res.locals;
  console.log(`/me 유저 확인: ${user.user_id}`);
  return res.status(400).send({ user });
});

module.exports = userRouter;
