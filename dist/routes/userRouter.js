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
const express_1 = __importDefault(require("express"));
const protectorMiddleware_1 = require("../middlewares/protectorMiddleware");
const validatorMiddleware_1 = require("../middlewares/validatorMiddleware");
const userController_1 = require("../controllers/userController");
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRouter = express_1.default.Router();
// TODO: [요구사항 3-3] 로그인한 사용자가 회원가입 또는 로그인 페이지 접근시 예외처리 (notSigninMiddleware 미들웨어 적용했음)
userRouter.post("/signup", protectorMiddleware_1.notSigninMiddleware, validatorMiddleware_1.signupValidator, userController_1.signup);
userRouter.post("/signin", protectorMiddleware_1.notSigninMiddleware, validatorMiddleware_1.signinValidator, userController_1.signin);
userRouter.get("/auth", protectorMiddleware_1.protectorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");
    if (!authToken || authType !== "Bearer") {
        // 로그인 확인 불가 => 401 Unauthorized
        console.log("로그인 확인 불가");
        return res.status(401).json({
            ok: false,
            errorMessage: "로그인이 필요합니다.",
        });
    }
    // @ts-ignore
    const { userId } = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET);
    try {
        // @ts-ignore
        user_1.default.findByPk(userId).then((user) => {
            console.log(user);
            return res.status(200).send({ ok: true, user });
        });
    }
    catch (error) {
        // 해당 유저 검증 불가 => 401 Unauthorized
        console.log("유저 검증 불가");
        return res.status(401).json({
            ok: false,
            errorMessage: "로그인이 필요합니다.",
        });
    }
    // const { user } = res.locals;
    // return res.status(200).send({ ok: true, user });
}));
exports.default = userRouter;
