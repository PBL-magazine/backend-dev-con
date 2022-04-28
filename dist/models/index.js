"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("./user"));
const post_1 = __importDefault(require("./post"));
const comment_1 = __importDefault(require("./comment"));
const like_1 = __importDefault(require("./like"));
const config_1 = __importDefault(require("../config/config"));
const env = process.env.NODE_ENV || "development";
const config = (0, config_1.default)(env);
// TODO: any 타입 수정
const db = {};
// TODO: non-null assertion, ts-ignore
const sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, 
// @ts-ignore
config);
db.sequelize = sequelize;
db.User = user_1.default;
db.Post = post_1.default;
db.Comment = comment_1.default;
db.Like = like_1.default;
user_1.default.init(sequelize); // 모델의 static.init 호출 => 테이블이 모델로 연결
post_1.default.init(sequelize);
comment_1.default.init(sequelize);
like_1.default.init(sequelize);
user_1.default.associate(db);
post_1.default.associate(db);
comment_1.default.associate(db);
like_1.default.associate(db);
exports.default = db;
