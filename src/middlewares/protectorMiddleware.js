const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models");

dotenv.config();

const protectorMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    // 로그인 확인 불가 => 401 Unauthorized
    return res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
  }

  try {
    const { userId } = jwt.verify(authToken, process.env.JWT_SECRET);
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    // 해당 유저 검증 불가 => 401 Unauthorized
    return res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
  }
};

const notSigninMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    // 로그인 확인 불가 => 통과
    return next();
  } else {
    // 토큰 있으면 로그인된 것으로 판단
    return res
      .status(400)
      .json({ ok: false, message: "이미 로그인이 되었습니다." });
  }
};

module.exports = { protectorMiddleware, notSigninMiddleware };
