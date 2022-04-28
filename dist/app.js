"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const commentRouter_1 = __importDefault(require("./routes/commentRouter"));
const postRouter_1 = __importDefault(require("./routes/postRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const models_1 = __importDefault(require("./models"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// TODO: [요구사항 5] cors 해결하기 (현재는 모든 요청 허용)
app.use((0, cors_1.default)({ credentials: true }));
models_1.default.sequelize
    .sync({ force: false }) // true => 테이블 드랍후 재생성(배포시 false)
    .then(() => {
    console.log("DB connected");
})
    .catch((err) => {
    // TODO: any 타입
    console.log(err);
});
app.use(express_1.default.static("public"));
app.use("/uploads", express_1.default.static("./uploads"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
/* 유저, 게시글, 댓글 별로 라우터 분리 */
app.use("/api/users", userRouter_1.default);
app.use("/api/posts", postRouter_1.default);
app.use("/api/posts/:post_id/comments", commentRouter_1.default);
app.get("/", (req, res) => {
    // TODO: any 타입
    return res.send("hello");
});
// 진입 스크립트를 판단 (require.main => module | undefined)
if (require.main === module) {
    console.log(`노드에서 JS 파일 직접 실행: ${require.main}`);
    app.listen(PORT, () => console.log(`Server started at: http://localhost:${PORT}`));
}
else {
    // console.log(`다른 스크립트로 임포트된 경우: ${require.main}`);
    module.exports = app;
}
