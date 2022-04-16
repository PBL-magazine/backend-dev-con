const express = require("express");
const { sequelize } = require("./models");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");

const app = express();
const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: true }) // TODO: true => 테이블 드랍후 재생성, 배포시 false로 수정
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.get("/", (req, res) => {
  return res.send("hello");
});

app.listen(PORT, () =>
  console.log(`Server started at: http://localhost:${PORT}`)
);
