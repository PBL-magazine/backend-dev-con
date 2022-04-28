"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidator = exports.postValidator = exports.signinValidator = exports.signupValidator = void 0;
const joi_1 = __importDefault(require("joi"));
/* 회원가입시 입력값 검증 */
const signupValidator = (req, res, next) => {
    // TODO: [요구사항 1-2] 비밀번호에 닉네임과 같은 값이 포함된 경우 에러 던지기
    const { nickname, password } = req.body;
    const checkPassIncludesNick = (pw) => {
        if (pw.includes(nickname))
            throw new Error("비밀번호에 닉네임을 포함할 수 없습니다.");
    };
    try {
        checkPassIncludesNick(password);
    }
    catch (error) {
        // 비밀번호를 잘못 요청한 경우 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
    const signupSchema = joi_1.default.object({
        email: joi_1.default.string().email().max(30).required().messages({
            "any.required": "이메일을 입력해 주세요.",
            "string.empty": "이메일을 입력해 주세요.",
            "string.email": "이메일 형식을 지켜주세요.",
            "string.max": "이메일은 최대 30자 입력해 주세요.",
        }),
        // TODO: [요구사항 1-1] 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
        nickname: joi_1.default.string().alphanum().min(3).max(30).required().messages({
            "any.required": "닉네임을 입력해 주세요.",
            "string.empty": "닉네임을 입력해 주세요.",
            "string.alphanum": "닉네임은 알파벳 대소문자, 숫자만 가능해요.",
            "string.min": "닉네임은 최소 3자 이상 입력해 주세요.",
            "string.max": "닉네임은 최대 30자 까지 입력해 주세요.",
        }),
        // TODO: [요구사항 1-2] 최소 4자이상, (닉네임과 같은 값이 포함된 경우 회원가입에 실패) => 별도 처리
        password: joi_1.default.string().min(4).max(20).required().messages({
            "any.required": "비밀번호를 입력해 주세요.",
            "string.empty": "비밀번호를 입력해 주세요.",
            "string.min": "비밀번호는 최소 4자 이상 입력해 주세요",
            "string.max": "비밀번호는 최대 20자 까지 입력해 주세요",
        }),
        confirmPassword: joi_1.default.string().min(4).max(20).required().messages({
            "any.required": "비밀번호를 입력해 주세요.",
            "string.empty": "비밀번호를 입력해 주세요.",
            "string.min": "비밀번호는 최소 4자 이상 입력해 주세요",
            "string.max": "비밀번호는 최대 20자 까지 입력해 주세요",
        }),
        role: joi_1.default.number(),
        // TODO: [요구사항 1-3] 비밀번호 확인 => 프런트에서 처리하기로 협의
    });
    const options = {
        abortEarly: false,
    };
    const { error, value } = signupSchema.validate(req.body, options);
    if (error) {
        // 이메일, 닉네임, 비밀번호를 잘못 요청한 경우 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
    else {
        req.body = value;
        next();
    }
};
exports.signupValidator = signupValidator;
/* 로그인시 입력값 검증 */
const signinValidator = (req, res, next) => {
    const signinSchema = joi_1.default.object({
        email: joi_1.default.string().email().max(30).required(),
        password: joi_1.default.string().min(4).max(200).required(),
    });
    const options = {
        abortEarly: false,
    };
    const { error, value } = signinSchema.validate(req.body, options);
    if (error) {
        // 이메일, 비밀번호를 잘못 요청한 경우 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
    else {
        req.body = value;
        next();
    }
};
exports.signinValidator = signinValidator;
/* 게시글 작성시 입력값 검증 */
const postValidator = (req, res, next) => {
    const postSchema = joi_1.default.object({
        content: joi_1.default.string().allow(""),
        image: joi_1.default.string().allow(""),
    });
    const { error, value } = postSchema.validate(req.body);
    if (error) {
        // 검증 불합격시 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
    else {
        req.body = value;
        next();
    }
};
exports.postValidator = postValidator;
/* 댓글 작성시 입력값 검증 */
const commentValidator = (req, res, next) => {
    const commentSchema = joi_1.default.object({
        content: joi_1.default.string().required(),
    });
    const { error, value } = commentSchema.validate(req.body);
    if (error) {
        // 내용이 string이 아닌경우 => 400 Bad Request (string이 아닌경우가 있나?)
        return res.status(400).json({ ok: false, message: error.message });
    }
    else {
        req.body = value;
        next();
    }
};
exports.commentValidator = commentValidator;
