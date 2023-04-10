/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  LoginResponse,
  ProtectResponse,
  RegisterResponse,
} from "../../../src/types/Auth";
import {
  loginHandler,
  protect,
  registerHandler,
} from "../../../src/modules/auth";
import { User } from "../../../src/types/User";
import dotenv from "dotenv";

process.env.JWT_SECRET_KEY = "my-secret-key";

beforeEach(() => {
  dotenv.config();
});
describe("loginHandler", () => {
  const status = (code: number) => expect(code).toBe(401);
  it("should login when provided proper user and password", async () => {
    const req: { body: Pick<User, "username" | "password"> } = {
      body: { username: "admin", password: "admin123" },
    };
    const json = (body: LoginResponse) => {
      expect(body.success && body.data.token).toBeTruthy();
    };

    const res: any = { json };
    await loginHandler(req as any, res);
  });

  it("should respond error when no username provided", async () => {
    const req: any = { body: {} };
    const json = (body: LoginResponse) => {
      expect(
        !body.success &&
          body.error === "not authorized: No user or password found"
      ).toBeTruthy();
    };

    const res: any = { json, status };
    await loginHandler(req, res);
  });

  it("should respond error when wrong username provided", async () => {
    const req: any = { body: { username: "admi", password: "admin123" } };
    const json = (body: LoginResponse) => {
      expect(
        !body.success && body.error === "not authorized: Wrong user or password"
      ).toBeTruthy();
    };
    const res: any = { json, status };
    await loginHandler(req, res);
  });

  it("should respond error when wrong password provided", async () => {
    const req: any = { body: { username: "admim", password: "admin124" } };
    const json = (body: LoginResponse) => {
      expect(
        !body.success && body.error === "not authorized: Wrong user or password"
      ).toBeTruthy();
    };
    const res: any = { json, status };
    await loginHandler(req, res);
  });
});

const createStatusMethod = (expected: number) => (code: number) =>
  expect(expected).toBe(code);

describe("registerHandler", () => {
  it("should respond token when provided new username and password", async () => {
    const req: any = {
      body: { username: "admin2", password: "admin1234" },
    };
    const json = (body: RegisterResponse) => {
      expect(body.success && body.data.token).toBeTruthy();
    };

    const status = createStatusMethod(201);
    const res: any = { json, status };
    await registerHandler(req, res);
  });

  it("should respond error when provided duplicated username", async () => {
    const req: any = {
      body: { username: "admin", password: "admin1234" },
    };
    const json = (body: RegisterResponse) => {
      expect(
        !body.success && body.error === "Invalid user, not able to register"
      ).toBeTruthy();
    };

    const status = createStatusMethod(400);
    const res: any = { json, status };
    await registerHandler(req, res);
  });

  it("should respond error when body is incomplete (no username)", async () => {
    const req: any = {
      body: { password: "admin1234" },
    };
    const json = (body: RegisterResponse) => {
      expect(
        !body.success && body.error === "Invalid user, not able to register"
      ).toBeTruthy();
    };

    const status = createStatusMethod(400);
    const res: any = { json, status };
    await registerHandler(req, res);
  });

  it("should respond error when body is incomplete (no password)", async () => {
    const req: any = {
      body: { admin: "admin2" },
    };
    const json = (body: RegisterResponse) => {
      expect(
        !body.success && body.error === "Invalid user, not able to register"
      ).toBeTruthy();
    };
    const status = createStatusMethod(400);
    const res: any = { json, status };

    await registerHandler(req, res);
  });
});

describe("protect middleware", () => {
  jest.useFakeTimers().setSystemTime(new Date(2023, 1, 1));

  const TOKEN =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE2NzUyMjEwMDAwMDB9.z2Gwro0COzvWNuc+3w/JuC4uecaUs5HWsG2hXmfBrao=";
  const setHeader = (key: string, value: string) => {
    expect(key).toBe("WWW-Authenticate");
    expect(value).toBe(`Bearer`);
  };
  const status = createStatusMethod(401);

  it("should respond with 401 when no authorization header is provided", async () => {
    const next = jest.fn();
    const req: any = {
      headers: {},
    };
    const res: any = {
      status,
      setHeader,
      json: (body: ProtectResponse) => {
        expect(!body.success && body.error).toBeTruthy();
      },
    };

    await protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should respond with 401 when authorization header is provided but not correct", async () => {
    const next = jest.fn();
    const req: any = {
      headers: {
        authorization: "Bearer 123.123.123",
      },
    };
    const res: any = {
      status,
      setHeader,
      json: (body: ProtectResponse) => {
        expect(!body.success && body.error).toBeTruthy();
      },
    };

    await protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should respond with 401 when user in token is not found", async () => {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjk5OTk5OTk5OTk5OSwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTY3NTIyMTAwMDAwMH0=.+Av5eKqA1H6V+8bRpfa+P/IMlg6/LyAQp1iERTA/Bls=";
    const next = jest.fn();
    const req: any = {
      headers: { authorization: `Bearer ${token}` },
    };
    const res: any = {
      status,
      setHeader,
      json: (body: ProtectResponse) => {
        expect(
          !body.success && body.error === "not authorized: User not found"
        ).toBeTruthy();
      },
    };

    await protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when authorization header is provided and correct", async () => {
    const next = jest.fn();
    const req: any = {
      headers: {
        authorization: `Bearer ${TOKEN}`,
      },
    };
    const res: any = {};

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeTruthy();
    expect(req.user.username).toBe("admin");
    expect(req.user.userId).toBe(1);
    expect(req.user.password).toBeTruthy();
  });
});
