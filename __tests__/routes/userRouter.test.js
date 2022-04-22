const app = require("../../src/app");
const request = require("supertest");
const { sequelize } = require("../../src/models");

beforeAll(async () => {
  await sequelize.sync();
});

const API_USERS = "/api/users";

describe(`POST ${API_USERS}/signup`, () => {
  test("회원가입 수행", (done) => {
    request(app)
      .post(`${API_USERS}/signup`)
      .send({
        email: "fullahead@gmail.com",
        nickname: "coco",
        password: "1234",
      })
      .expect(201, done);
  });

  test("사용 중인 닉네임으로 회원가입 수행", (done) => {
    request(app)
      .post(`${API_USERS}/signup`)
      .send({
        email: "coco@gmail.com",
        nickname: "coco",
        password: "1234",
      })
      .expect(409, done);
  });
});

describe(`POST ${API_USERS}/signin`, () => {
  const agent = request.agent(app);

  beforeEach((done) => {
    agent
      .post(`${API_USERS}/signin`)
      .send({ email: "coco@gmail.com", password: "1234" })
      .end(done);
  });

  test("이미 로그인된 경우", (done) => {
    agent
      .post(`${API_USERS}/signin`)
      .send({ email: "coco@gmail.com", password: "1234" })
      .expect(400, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
