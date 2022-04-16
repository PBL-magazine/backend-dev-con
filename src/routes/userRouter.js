const express = require("express");
const userRouter = express.Router();
const protectorMiddleware = require("../middlewares/protectorMiddleware");
const {
  signupMiddleware,
  signinMiddleware,
} = require("../middlewares/validatorMiddleware");

const { signup, signin } = require("../controllers/userController");

userRouter.post("/signup", signupMiddleware, signup);
userRouter.post("/signin", signinMiddleware, signin);

userRouter.get("/me", protectorMiddleware, async (req, res) => {
  // TODO: user 받아오는지 확인 => 삭제할 것
  const { user } = res.locals;
  console.log(user);

  return res.status(400).send({ user });
});

module.exports = userRouter;
