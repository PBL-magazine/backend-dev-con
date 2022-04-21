jest.mock("../../src/models/user");
const User = require("../../src/models/user");
const { signup } = require("../../src/controllers/userController");

describe("signup (회원가입 컨트롤러)", () => {
  // const req = {
  //   body: {
  //     email: "nature9th@gmail.com",
  //     nickname: "coco",
  //     password: "1234",
  //   },
  // };
  // const res = {
  //   status: jest.fn(() => res), // res.status(403).send("hello")와 같은 메서드 체이닝을 위해 res를 반환
  //   json: jest.fn(),
  // };
  const mockRequest = (
    email = "nature9th@gmail.com",
    nickname = "coco",
    password = "1234"
  ) => {
    return {
      body: { email, nickname, password },
    };
  };
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("이메일이 사용중인 경우 409 응답", async () => {
    const req = mockRequest();
    const res = mockResponse();
    User.findOne.mockReturnValue({});
    await signup(req, res);
    expect(res.status).toBeCalledWith(409);
    expect(res.json).toBeCalledWith({
      ok: false,
      message: "이메일이 이미 사용중입니다.",
    });
  });

  // User.findOne이 null로 넣어서 닉네임 체크하는 로직까지 도달하지 못함 (=> 코멘트 처리)
  test("닉네임이 사용중인 경우 409 응답", async () => {
    const req = mockRequest("new@gmail.com");
    const res = mockResponse();
    User.findOne.mockReturnValue({});
    await signup(req, res);
    expect(res.status).toBeCalledWith(409);
    // expect(res.json).toBeCalledWith({
    //   ok: false,
    //   message: "닉네임이 이미 사용중입니다.",
    // });
  });

  test("회원가입을 성공시 true 응답", async () => {
    const req = mockRequest("new@gmail.com", "newNickname");
    const res = mockResponse();
    User.findOne.mockReturnValue(null);
    await signup(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({ ok: true });
  });

  test("회원가입 실패시 error 메시지", async () => {
    const req = mockRequest("new@gmail.com", "newNickname");
    const res = mockResponse();
    const error = { message: "테스트용 에러" };
    User.create.mockReturnValue(Promise.reject(error));
    await signup(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ ok: false, message: error.message });
  });
});
