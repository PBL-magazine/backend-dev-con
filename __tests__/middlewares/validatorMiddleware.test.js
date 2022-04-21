jest.mock("../../src/models/user");
const {
  signupValidator,
} = require("../../src/middlewares/validatorMiddleware");

describe("회원가입 검증 미들웨어", () => {
  const mockRequest = (email, nickname, password) => {
    return {
      body: { email, nickname, password },
    };
  };
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn();
    return res;
  };
  const next = jest.fn();

  describe("이메일: 이메일 형식 확인", () => {
    test("이메일을 비워두면 에러", () => {
      const req = mockRequest("", "coco", "1234");
      const res = mockResponse();
      signupValidator(req, res, next);
      expect(res.json).toBeCalledWith({
        ok: false,
        message: "이메일을 입력해 주세요.",
      });
    });
    test("이메일 형식에 맞지 않으면 에러", () => {
      const req = mockRequest("cocogmail.com", "coco", "1234");
      const res = mockResponse();
      signupValidator(req, res, next);
      expect(res.json).toBeCalledWith({
        ok: false,
        message: "이메일 형식을 지켜주세요.",
      });
    });
    test("이메일 형식 확인되면 next 호출", () => {
      const req = mockRequest("coco@gmail.com", "coco", "1234");
      const res = mockResponse();
      signupValidator(req, res, next);
      expect(next).toBeCalledTimes(1);
    });
  });

  describe("닉네임: 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)", () => {
    test("닉네임에 알파펫 대소문자, 숫자 외 포함시 에러", () => {
      const req = mockRequest("abc@gmail.com", "b-c", "1234");
      const res = mockResponse();
      signupValidator(req, res, next);
      expect(res.json).toBeCalledWith({
        ok: false,
        message: "닉네임은 알파벳 대소문자, 숫자만 가능해요.",
      });
    });
    test("닉네임이 3자 미만인 경우 에러", () => {
      const req = mockRequest("abc@gmail.com", "bc", "1234");
      const res = mockResponse();
      signupValidator(req, res, next);
      expect(res.json).toBeCalledWith({
        ok: false,
        message: "닉네임은 최소 3자 이상 입력해 주세요.",
      });
    });
    test("닉네 검증 통과시 next 호출", () => {
      const req = mockRequest("abc@gmail.com", "bc", "1234");
      const res = mockResponse();
      signupValidator(req, res, next);
      expect(next).toBeCalledTimes(1);
    });
  });

  describe("비밀번호: 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패", () => {
    test("비밀번호에 닉네임 포함될 경우 에러", () => {
      const req = mockRequest("abc@gmail.com", "abc", "abc1234");
      const res = mockResponse();
      signupValidator(req, res, next);
      expect(res.json).toBeCalledWith({
        ok: false,
        message: "비밀번호에 닉네임을 포함할 수 없습니다.",
      });
    });
    test("비밀번호가 4자 미만인 경우 에러", () => {
      const req = mockRequest("abc@gmail.com", "abc", "123");
      const res = mockResponse();
      signupValidator(req, res, next);
      expect(res.json).toBeCalledWith({
        ok: false,
        message: "비밀번호는 최소 4자 이상 입력해 주세요",
      });
    });
    test("비밀번호 검증 통과시 next 호출", () => {
      const req = mockRequest("abc@gmail.com", "abc", "1234");
      const res = mockResponse();
      signupValidator(req, res, next);
      expect(next).toBeCalledTimes(1);
    });
  });
});
