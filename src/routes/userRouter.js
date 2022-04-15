const express = require("express");
const userRouter = express.Router();
const protectorMiddleware = require("../middlewares/protectorMiddleware");

const { signup, signin } = require("../controllers/userController");

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

userRouter.get("/me", protectorMiddleware, async (req, res) => {
  const { user } = res.locals;
  console.log(user);
  return res.status(400).send({});
});

module.exports = userRouter;
