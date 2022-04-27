import { Sequelize } from "sequelize";
import User from "./user";
import Post from "./post";
import Comment from "./comment";
import Like from "./like";

import sequelizeConfig from "../config/config";

const env = process.env.NODE_ENV || "development";
const config = sequelizeConfig(env);
// TODO: any 타입 수정
const db: any = {};

// TODO: non-null assertion, ts-ignore
const sequelize = new Sequelize(
  config!.database,
  config!.username,
  config!.password,
  // @ts-ignore
  config
);

db.sequelize = sequelize;

db.User = User;
db.Post = Post;
db.Comment = Comment;
db.Like = Like;

User.init(sequelize); // 모델의 static.init 호출 => 테이블이 모델로 연결
Post.init(sequelize);
Comment.init(sequelize);
Like.init(sequelize);

User.associate(db);
Post.associate(db);
Comment.associate(db);
Like.associate(db);

export default db;
