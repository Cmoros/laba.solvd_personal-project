/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// import supertest from "supertest";
// import app from "../../src/app";
import { LoginResponse, RegisterResponse } from "../../src/types/Auth";
import { loginHandler, registerHandler } from "../../src/modules/auth";
import { User } from "../../src/types/User";
import dotenv from "dotenv";

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

describe("registerHandler", () => {
  const createStatusMethod = (expected: number) => (code: number) =>
    expect(expected).toBe(code);
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
      expect(!body.success && body.error).toBeTruthy();
    };

    const status = createStatusMethod(400);
    const res: any = { json, status };
    await registerHandler(req, res);
  });
});
