const app = require("../../src/app");
const request = require("supertest");
const { sequelize } = require("../../src/models");

beforeAll(async () => {
  await sequelize.sync();
});

const API_USERS = "/api/users";

describe(`POST ${API_USERS}/signup`, () => {
  test("회원가입 수행", async () => {
    const res = await request(app)
      .post(`${API_USERS}/signup`)
      .send({ email: "coco1@gmail.com", nickname: "coco1", password: "1234" });
    expect(res.statusCode).toBe(201);
  });
});

describe(`POST ${API_USERS}/signin`, () => {
  // const agent = request.agent(app);
  test("로그인 수행", async () => {
    const res = await request(app)
      .post(`${API_USERS}/signin`)
      .send({ email: "coco1@gmail.com", password: "1234" });
    expect(res.statusCode).toBe(201);
  });

  // 사용중인 닉네임으로 로그인한 경우 테스트 작성

  // test("이미 로그인된 경우", async () => {
  //   const res = await agent
  //     .post(`${API_USERS}/signin`)
  //     .send({ email: "coco1@gmail.com", password: "1234" });
  //   expect(res.statusCode).toBe(400);
  // });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
