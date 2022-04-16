const Joi = require("joi");

const signupMiddleware = (req, res, next) => {
  // TODO: [완료] 비밀번호에 닉네임과 같은 값이 포함된 경우 에러 던지기
  const { nickname, password } = req.body;
  const checkPassIncludesNick = (pw) => {
    if (pw.includes(nickname))
      throw new Error("비밀번호에 닉네임을 포함할 수 없습니다.");
  };
  try {
    checkPassIncludesNick(password);
  } catch (error) {
    // 비밀번호를 잘못 요청한 경우 => 400 Bad Request
    return res.status(400).send({ ok: false, message: error.message });
  }

  const signupSchema = Joi.object({
    // TODO: [완료] 이메일 형식
    email: Joi.string().email().max(30).required(),
    // TODO: [완료] 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
    nickname: Joi.string().alphanum().min(3).max(30).required(),
    // TODO: [완료] 최소 4자이상, (닉네임과 같은 값이 포함된 경우 회원가입에 실패) => 별도 처리
    password: Joi.string().min(4).max(200).required(),
  });

  const options = {
    abortEarly: false,
  };

  const { error, value } = signupSchema.validate(req.body, options);

  if (error) {
    // 이메일, 닉네임, 비밀번호를 잘못 요청한 경우 => 400 Bad Request
    return res.status(400).send({ ok: false, message: error.message });
  } else {
    req.body = value;
    next();
  }
};

const signinMiddleware = (req, res, next) => {
  const signinSchema = Joi.object({
    email: Joi.string().email().max(30).required(),
    password: Joi.string().min(4).max(200).required(),
  });

  const options = {
    abortEarly: false,
  };

  const { error, value } = signinSchema.validate(req.body, options);

  if (error) {
    // 이메일, 비밀번호를 잘못 요청한 경우 => 400 Bad Request
    return res.status(400).send({ ok: false, message: error.message });
  } else {
    req.body = value;
    next();
  }
};

module.exports = { signupMiddleware, signinMiddleware };
