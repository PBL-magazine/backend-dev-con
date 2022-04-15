const express = require("express");
const { sequelize } = require("./models");
const userRouter = require("./routes/userRouter");

const app = express();
const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
// app.use("/post", postRouter);
// app.use("/comment", commentRouter);

app.get("/", (req, res) => {
  return res.send("hello");
});

app.listen(PORT, () =>
  console.log(`Server started at: http://localhost:${PORT}`)
);
