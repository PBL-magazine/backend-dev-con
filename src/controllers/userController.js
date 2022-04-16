const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();

const signup = async (req, res) => {
  try {
    const { email, nickname, password } = req.body;
    const role = 0;

    const checkEmail = await User.findOne({
      where: { email },
    });
    if (checkEmail !== null) {
      // 이메일 사용중 => 409 Conflict
      return res.status(409).json({
        ok: false,
        message: "이메일이 이미 사용중입니다.",
      });
    }
    const checkNickname = await User.findOne({
      where: { nickname },
    });
    if (checkNickname !== null) {
      // 닉네임 사용중 => 409 Conflict
      return res.status(409).json({
        ok: false,
        message: "닉네임이 이미 사용중입니다.",
      });
    }

    await User.create({ email, nickname, password, role });
    // 유저 생성 완료되었으므로 => 201 Created
    return res.status(201).json({});
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user || password !== user.password) {
      // 해당 이메일을 가진 유저가 없거나, 패스워드 오류 => 400 Bad Request
      return res.status(400).json({
        ok: false,
        message: "이메일 또는 패스워드를 확인해 주세요.",
      });
    }

    return res.json({
      token: jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET),
    });
  } catch (error) {
    // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }
};

module.exports = { signup, signin };
