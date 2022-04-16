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
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
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

module.exports = protectorMiddleware;
