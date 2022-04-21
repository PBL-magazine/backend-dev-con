jest.mock("../../src/models/user");
const User = require("../../src/models/user");
const {
  protectorMiddleware,
} = require("../../src/middlewares/protectorMiddleware");

describe("protectorMiddleware", () => {
  // const mockRequest = (
  //   email = "nature9th@gmail.com",
  //   nickname = "coco",
  //   password = "1234"
  // ) => {
  //   return {
  //     body: { email, nickname, password },
  //   };
  // };
  // const mockResponse = () => {
  //   const res = {};
  //   res.status = jest.fn().mockReturnValue(res);
  //   res.json = jest.fn().mockReturnValue(res);
  //   return res;
  // };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
    locals: jest.fn(),
    json: jest.fn(),
  };
  const next = jest.fn();

  test("로그인되어 있지 않으면 protectorMiddleware가 에러를 응답해야 함", () => {
    const req = {
      headers: {
        authorization: "Bearer ",
      },
    };

    protectorMiddleware(req, res, next);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({
      ok: false,
      errorMessage: "로그인이 필요합니다.",
    });
  });

  // TODO: 정상적인 토큰을 넣은 경우에 try...catch문으로 넘어갈 방법 찾아야 함
  // test("정상적인 토큰을 넣은 경우 User.findByPk가 실행된다.", () => {
  //   const req = {
  //     headers: {
  //       authorization:
  //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk5LCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.27uuQ34QFqdzibQrQSJ0OKyI4wqIXz6wVvJ1uSlcESQ",
  //     },
  //     // headers: jest.fn(() => true),
  //   };
  //   User.findByPk.mockReturnValue(Promise.resolve({ user: "123" }));
  //   protectorMiddleware(req, res, next);
  //   expect(res.status).toBeCalledWith(401);
  //   expect(next).toBeCalledTimes(1);
  // });

  // TODO: 정상적인 토큰을 넣은 경우에 try...catch문으로 넘어갈 방법 찾아야 함
  // TODO: res.json이 test 개수에 따라 늘어 나는 문제 수정해야 함
  // test("유저 검증 불가시 error", () => {
  //   const req = {
  //     headers: {
  //       authorization:
  //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk5LCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.27uuQ34QFqdzibQrQSJ0OKyI4wqIXz6wVvJ1uSlcESQ",
  //     },
  //     // headers: jest.fn(() => true),
  //   };
  //   const error = { message: "테스트용 에러" };
  //   User.findByPk.mockReturnValue(Promise.reject(error));
  //   protectorMiddleware(req, res, next);
  //   expect(res.status).toBeCalledWith(401);
  //   expect(res.json).toBeCalledWith({ ok: false, message: error.message });
  // });
});
