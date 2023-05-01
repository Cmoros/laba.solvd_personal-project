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
import {
  createTestUser,
  deleteTestUsers,
} from "../../utilities/testDataFactory";
import pool from "../../../src/db/pool";
import { generateToken } from "../../../src/modules/auth/utils";

process.env.JWT_SECRET_KEY = "my-secret-key";
// jest.useFakeTimers().setSystemTime(new Date(2023, 1, 1));

beforeAll(() => {
  dotenv.config();
});

afterAll(async () => {
  delete process.env.JWT_SECRET_KEY;
  await deleteTestUsers();
  await pool.end();
});

describe("loginHandler", () => {
  afterEach(async () => {
    await deleteTestUsers();
  });
  const status = (code: number) => expect(code).toBe(401);
  it("should login when provided proper user and password", async () => {
    const { returned, notHashedPassword } = await createTestUser();
    const { username } = returned;
    const req: { body: Pick<User, "username" | "password"> } = {
      body: { username, password: notHashedPassword },
    };
    const json = (body: LoginResponse) => {
      expect(body.success && body.data.token).toBeTruthy();
    };
    const status = jest.fn();
    const res: any = { json, status };
    await loginHandler(req as any, res);
    expect(status).not.toHaveBeenCalled();
  });

  it("should respond error when no username provided", async () => {
    const req: any = { body: {} };
    const json = (body: LoginResponse) => {
      expect(
        !body.success &&
          body.errors[0] === "not authorized: No user or password found"
      ).toBeTruthy();
    };

    const res: any = { json, status };
    await loginHandler(req, res);
  });

  it("should respond error when wrong username provided", async () => {
    const { notHashedPassword } = await createTestUser();
    const req: any = {
      body: { username: "admi", password: notHashedPassword },
    };
    const json = (body: LoginResponse) => {
      expect(
        !body.success &&
          body.errors[0] === "not authorized: Wrong user or password"
      ).toBeTruthy();
    };
    const res: any = { json, status };
    await loginHandler(req, res);
  });

  it("should respond error when wrong password provided", async () => {
    const { returned } = await createTestUser();
    const req: any = {
      body: { username: returned.username, password: "admin124" },
    };
    const json = (body: LoginResponse) => {
      expect(
        !body.success &&
          body.errors[0] === "not authorized: Wrong user or password"
      ).toBeTruthy();
    };
    const res: any = { json, status };
    await loginHandler(req, res);
  });
});

const createStatusMethod = (expected: number) => (code: number) =>
  expect(expected).toBe(code);

describe("registerHandler", () => {
  afterEach(async () => {
    await deleteTestUsers();
  });
  it("should respond token when provided new username and password", async () => {
    const req: any = {
      body: { username: "test 10", password: "admin1234" },
    };
    const json = (body: RegisterResponse) => {
      expect(body.success && body.data.token).toBeTruthy();
    };

    const status = createStatusMethod(201);
    const res: any = { json, status };
    await registerHandler(req, res);
  });

  it("should respond error when provided duplicated username", async () => {
    const { returned } = await createTestUser();
    const req: any = {
      body: { username: returned.username, password: "any password" },
    };
    const json = (body: RegisterResponse) => {
      expect(
        !body.success && body.errors[0] === "Invalid user, not able to register"
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
        !body.success && body.errors[0] === "Invalid user, not able to register"
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
      expect(!body.success && body.errors).toBeTruthy();
    };
    const status = createStatusMethod(400);
    const res: any = { json, status };

    await registerHandler(req, res);
  });
});

describe("protect middleware", () => {
  // jest.useFakeTimers().setSystemTime(new Date(2023, 1, 1));
  // beforeEach(() => {
  //   // jest.spyOn(Date, "now").mockImplementation(() => 1675221000000);
  //   jest
  //     .spyOn(Date.prototype, "getTime")
  //     .mockImplementation(() => 1675221000000);
  // });

  // const TOKEN =
  //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE2NzUyMjEwMDAwMDB9.z2Gwro0COzvWNuc+3w/JuC4uecaUs5HWsG2hXmfBrao=";
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
        expect(
          !body.success && body.errors[0] === "not authorized: No token found"
        ).toBeTruthy();
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
        expect(!body.success && body.errors).toBeTruthy();
      },
    };

    await protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should respond with 401 when user in token is not found", async () => {
    jest
      .spyOn(Date.prototype, "getTime")
      .mockImplementation(() => 1675220000000);
    // { userId: 9999999999999, username: "test test" } 1675221000000
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjk5OTk5OTk5OTk5OTksInVzZXJuYW1lIjoidGVzdCB0ZXN0IiwiZXhwIjoxNjc1MjIxNjAwMDAwfQ==.Q1zof5mgo2mTJdAX5Fq8FOGK4T5x5+yswgTYNONsjUM=";
    const next = jest.fn();
    const req: any = {
      headers: { authorization: `Bearer ${token}` },
    };
    const res: any = {
      status,
      setHeader,
      json: (body: ProtectResponse) => {
        expect(!body.success && body.errors[0]).toBe(
          "not authorized: User not found"
        );
      },
    };

    await protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should respond with 401 when id is found but username doesn't match", async () => {
    const { returned } = await createTestUser();
    const { userId } = returned;
    const token = generateToken(
      { userId, username: "not matching username" },
      process.env.JWT_SECRET_KEY!
    );
    const next = jest.fn();
    const req: any = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res: any = {
      status,
      setHeader,
      json: (body: ProtectResponse) => {
        expect(!body.success && body.errors[0]).toBe(
          "not authorized: User not found"
        );
      },
    };

    await protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when authorization header is provided and correct", async () => {
    const { returned } = await createTestUser();
    const { userId, username } = returned;
    const token = generateToken(
      { userId, username },
      process.env.JWT_SECRET_KEY!
    );
    const next = jest.fn();
    const req: any = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res: any = {};

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeTruthy();
    expect(req.user.username).toBe(username);
    expect(req.user.userId).toBe(userId);
    expect(req.user.password).toBeTruthy();
  });
});
