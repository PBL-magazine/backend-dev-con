import Joi from "joi";
import { Request, Response, NextFunction } from "express";

/* 회원가입시 입력값 검증 */
export const signupValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: [요구사항 1-2] 비밀번호에 닉네임과 같은 값이 포함된 경우 에러 던지기
  const { nickname, password } = req.body;
  const checkPassIncludesNick = (pw: any) => {
    if (pw.includes(nickname))
      throw new Error("비밀번호에 닉네임을 포함할 수 없습니다.");
  };
  try {
    checkPassIncludesNick(password);
  } catch (error: any) {
    // 비밀번호를 잘못 요청한 경우 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  }

  const signupSchema = Joi.object({
    email: Joi.string().email().max(30).required().messages({
      "any.required": "이메일을 입력해 주세요.",
      "string.empty": "이메일을 입력해 주세요.",
      "string.email": "이메일 형식을 지켜주세요.",
      "string.max": "이메일은 최대 30자 입력해 주세요.",
    }),
    // TODO: [요구사항 1-1] 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
    nickname: Joi.string().alphanum().min(3).max(30).required().messages({
      "any.required": "닉네임을 입력해 주세요.",
      "string.empty": "닉네임을 입력해 주세요.",
      "string.alphanum": "닉네임은 알파벳 대소문자, 숫자만 가능해요.",
      "string.min": "닉네임은 최소 3자 이상 입력해 주세요.",
      "string.max": "닉네임은 최대 30자 까지 입력해 주세요.",
    }),
    // TODO: [요구사항 1-2] 최소 4자이상, (닉네임과 같은 값이 포함된 경우 회원가입에 실패) => 별도 처리
    password: Joi.string().min(4).max(20).required().messages({
      "any.required": "비밀번호를 입력해 주세요.",
      "string.empty": "비밀번호를 입력해 주세요.",
      "string.min": "비밀번호는 최소 4자 이상 입력해 주세요",
      "string.max": "비밀번호는 최대 20자 까지 입력해 주세요",
    }),
    role: Joi.number(),
    // TODO: [요구사항 1-3] 비밀번호 확인 => 프런트에서 처리하기로 협의
  });

  const options = {
    abortEarly: false,
  };

  const { error, value } = signupSchema.validate(req.body, options);

  if (error) {
    // 이메일, 닉네임, 비밀번호를 잘못 요청한 경우 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  } else {
    req.body = value;
    next();
  }
};

/* 로그인시 입력값 검증 */
export const signinValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    return res.status(400).json({ ok: false, message: error.message });
  } else {
    req.body = value;
    next();
  }
};

/* 게시글 작성시 입력값 검증 */
export const postValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postSchema = Joi.object({
    content: Joi.string().allow(""), // 게시글 수정시 내용없을 수 있으므로 공란 허용
    image: Joi.string().allow(""),
  });

  const { error, value } = postSchema.validate(req.body);

  if (error) {
    // 검증 불합격시 => 400 Bad Request
    return res.status(400).json({ ok: false, message: error.message });
  } else {
    req.body = value;
    next();
  }
};

/* 댓글 작성시 입력값 검증 */
export const commentValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentSchema = Joi.object({
    content: Joi.string().required(),
  });

  const { error, value } = commentSchema.validate(req.body);

  if (error) {
    // 내용이 string이 아닌경우 => 400 Bad Request (string이 아닌경우가 있나?)
    return res.status(400).json({ ok: false, message: error.message });
  } else {
    req.body = value;
    next();
  }
};
