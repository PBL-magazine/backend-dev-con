"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config();
// TODO: [요구사항 4] 본인이 선택한 Status Code의 반환 이유를 설명하기
/* 회원가입 기능 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, nickname, password, role } = req.body;
        // @ts-ignore
        const findUserByEmail = yield user_1.default.findOne({
            where: { email },
        });
        if (findUserByEmail !== null) {
            // 이메일 사용중 => 409 Conflict
            return res.status(409).json({
                ok: false,
                message: "이메일이 이미 사용중입니다.",
            });
        }
        // @ts-ignore
        const findUserByNickname = yield user_1.default.findOne({
            where: { nickname },
        });
        if (findUserByNickname !== null) {
            // 닉네임 사용중 => 409 Conflict
            return res.status(409).json({
                ok: false,
                message: "닉네임이 이미 사용중입니다.",
            });
        }
        // @ts-ignore
        yield user_1.default.create({ email, nickname, password, role });
        // 유저 생성 완료되었으므로 => 201 Created
        return res.status(201).json({ ok: true });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.signup = signup;
// TODO: [요구사항 4] 본인이 선택한 Status Code의 반환 이유를 설명하기
/* 로그인 기능 */
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // @ts-ignore
        const user = yield user_1.default.findOne({ where: { email } });
        // @ts-ignore
        if (!user || password !== user.password) {
            // TODO: [요구사항 2] 이메일 또는 비밀번호가 DB와 맞지 않는 경우 예외처리
            // 이메일 또는 패스워드 잘못 요청 => 400 Bad Request
            return res.status(400).json({
                ok: false,
                message: "이메일 또는 패스워드를 확인해 주세요.",
            });
        }
        return res
            .status(201)
            .cookie("token", 
        // @ts-ignore
        jsonwebtoken_1.default.sign({ userId: user.user_id }, process.env.JWT_SECRET))
            .json({ ok: true });
    }
    catch (error) {
        // 클라이언트 요청에 문제가 있었다고 보고 => 400 Bad Request
        return res.status(400).json({ ok: false, message: error.message });
    }
});
exports.signin = signin;
