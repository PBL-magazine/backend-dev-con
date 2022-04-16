const express = require("express");
const userRouter = express.Router();
const protectorMiddleware = require("../middlewares/protectorMiddleware");
const {
  signupValidator,
  signinValidator,
} = require("../middlewares/validatorMiddleware");

const { signup, signin } = require("../controllers/userController");

userRouter.post("/signup", signupValidator, signup);
userRouter.post("/signin", signinValidator, signin);

// TODO: user 받아오는지 확인 => 삭제할 것
userRouter.get("/me", protectorMiddleware, async (req, res) => {
  const { user } = res.locals;
  console.log(user);
  return res.status(400).send({ user });
});

module.exports = userRouter;
