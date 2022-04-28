import express from "express";
import cors from "cors";
import commentRouter from "./routes/commentRouter";
import postRouter from "./routes/postRouter";
import userRouter from "./routes/userRouter";
import db from "./models";

const app = express();
const PORT = process.env.PORT || 3000;

// TODO: [요구사항 5] cors 해결하기 (현재는 모든 요청 허용)
app.use(cors({ credentials: true }));

db.sequelize
  .sync({ force: false }) // true => 테이블 드랍후 재생성(배포시 false)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err: any) => {
    // TODO: any 타입
    console.log(err);
  });

app.use(express.static("public"));
app.use("/uploads", express.static("./uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* 유저, 게시글, 댓글 별로 라우터 분리 */
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/posts/:post_id/comments", commentRouter);

app.get("/", (req: any, res: any) => {
  // TODO: any 타입
  return res.send("hello");
});

// 진입 스크립트를 판단 (require.main => module | undefined)
if (require.main === module) {
  console.log(`노드에서 JS 파일 직접 실행: ${require.main}`);
  app.listen(PORT, () =>
    console.log(`Server started at: http://localhost:${PORT}`)
  );
} else {
  // console.log(`다른 스크립트로 임포트된 경우: ${require.main}`);
  module.exports = app;
}
