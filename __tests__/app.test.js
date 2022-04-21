const app = require("../src/app");
const supertest = require("supertest");

test("/ 경로에 요청했을 때 status code가 200이어야 한다.", async () => {
  const res = await supertest(app).get("/");
  expect(res.status).toEqual(200);
});

test("/travel 경로에 요청했을 때 status code가 404여야 한다.", async () => {
  const res = await supertest(app).get("/travel");
  expect(res.status).toEqual(404);
});
