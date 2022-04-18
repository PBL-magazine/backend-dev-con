const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// TODO: [요구사항 5] cors 해결하기 (현재는 모든 요청 허용)
app.use(cors({ credentials: true }));

sequelize
  .sync({ force: false }) // true => 테이블 드랍후 재생성(배포시 false)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* 유저, 게시글, 댓글 별로 라우터 분리 */
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/posts/:post_id/comments", commentRouter);

app.get("/", (req, res) => {
  return res.send("hello");
});

app.listen(PORT, () =>
  console.log(`Server started at: http://localhost:${PORT}`)
);
