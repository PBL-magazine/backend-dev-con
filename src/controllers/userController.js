const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();

const signup = async (req, res) => {
  try {
    const { email, nickname, password } = req.body;
    const id = 1234;
    const role = 0;

    const existsUsers = await User.findAll({
      where: {
        [Op.or]: [{ email }, { nickname }],
      },
    });
    if (existsUsers.length) {
      return res.status(409).send({
        errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
      });
    }

    await User.create({ id, email, nickname, password, role });
    return res.status(201).send({});
  } catch (error) {
    return res.status(400).send({ error: error.message });
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
    console.log(user);

    if (!user || password !== user.password) {
      return res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
      });
    }

    return res.send({
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
    });
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports = { signup, signin };
