import AuthError from "../../../src/modules/auth/AuthError";
import {
  TIME_TO_EXPIRE,
  generateToken,
  verifyToken,
} from "../../../src/modules/auth/utils";
import crypto from "crypto";

jest.useFakeTimers().setSystemTime(new Date(2023, 1, 1));

/*
  ----------------- ACLARATION ------------------

  These are not the best tests, I tried to match my jwt with the one provided to me with other
  websites like https://jwt.io/, but they didn't match. First because of padding and special chars.
  Second because I don't really know what implementation they have creating the token
  and how they differ from mine, and why. I tried to look it up but couldn't find in a couple of hours
  At least these tests verify that the token provided by me, can be verified by me as well.
  And this authentication can check for exp date and on.
  */

const SECRET = "my-secret-key";
// userId: 1 username: admin exp: 1675220460000
const TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE2NzUyMjEwMDAwMDB9.z2Gwro0COzvWNuc+3w/JuC4uecaUs5HWsG2hXmfBrao=";
const HEADER = {
  typ: "JWT",
  alg: "HS256",
};

describe("generateToken()", () => {
  /*
  ---- SIGNATURE ----
  HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    my-secret-key
  )
  */
  const toBase64 = (body: string) => Buffer.from(body).toString("base64");

  const payload = {
    userId: 1,
    username: "admin",
    exp: new Date().getTime() + TIME_TO_EXPIRE,
  };

  it("should generate a well formatted token", () => {
    const token = generateToken(payload, SECRET);
    expect(token.split(".")).toHaveLength(3);
  });

  it("should generate a token with expected header, payload and signature ", () => {
    const token = generateToken(payload, SECRET);
    const [header64, payload64, signature64] = token.split(".");

    expect(header64).toBe(toBase64(JSON.stringify(HEADER)));
    expect(payload64).toBe(toBase64(JSON.stringify(payload)));
    expect(signature64).toBe(
      crypto
        .createHmac("sha256", SECRET)
        .update(`${header64}.${payload64}`)
        .digest("base64")
    );
  });

  it("should change its payload and signature due to time", () => {
    const token1 = generateToken(payload, SECRET);
    jest.advanceTimersByTime(1000);
    const token2 = generateToken(payload, SECRET);
    const [h1, p1, s1] = token1.split(".");
    const [h2, p2, s2] = token2.split(".");

    expect(h1).toBe(h2);
    expect(p1).not.toBe(p2);
    expect(s1).not.toBe(s2);
  });

  it("should match propperly with advanced time", () => {
    // Arrange
    const TIME_ADVANCED = 1000;
    jest.advanceTimersByTime(TIME_ADVANCED);

    // Act
    const token = generateToken(payload, SECRET);
    const expectedPayload = {
      ...payload,
      exp: new Date().getTime() + TIME_TO_EXPIRE,
    };
    const [h, p, s] = token.split(".");

    // Assert
    expect(p).toEqual(toBase64(JSON.stringify(expectedPayload)));
    expect(s).toBe(
      crypto.createHmac("sha256", SECRET).update(`${h}.${p}`).digest("base64")
    );
  });
});

describe("verifyToken", () => {
  it("should throw if invalid signature", () => {
    const invalidToken = "saudisahd.asdjoasdija.hello";

    expect(() => verifyToken(invalidToken, SECRET)).toThrow(
      new AuthError(["Not matching signatures"])
    );
  });

  it("should throw if invalid payload (no id/exp/username)", () => {
    const noId =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjc1MjIxMDAwMDAwfQ==.K4VrkycdlX3PDcEN0YLZa9jxymzerQUWFIQTaGUW9dk=";
    const noUsername =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6MTY3NTIyMTAwMDAwMH0=.2NvzLjfEjuaktYouMY9PVIYIBzMrSngGHlYe9u0phXM=";
    const noExp =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0=.B3GMktQQJKSoo+MUMKH5CWzpLOIx5ThOUVLzOKqMtLE=";
    const badPayloads = [noId, noUsername, noExp];

    for (const badPayload of badPayloads) {
      expect(() => verifyToken(badPayload, SECRET)).toThrow(
        new AuthError(["Unexpected Signature"])
      );
    }
  });

  it("should throw if expired token", () => {
    jest.advanceTimersByTime(TIME_TO_EXPIRE * 2);

    expect(() => verifyToken(TOKEN, SECRET)).toThrow(
      new AuthError(["Expired token"])
    );
  });

  it("should get from token all the needed info", () => {
    jest.useFakeTimers().setSystemTime(new Date(2023, 1, 1));
    const user = verifyToken(TOKEN, SECRET);

    expect(user).toEqual({ username: "admin", userId: 1 });
  });
});

describe("verifyToken()-generateToken()", () => {
  const payload = {
    userId: 1,
    username: "admin",
    exp: new Date().getTime() + TIME_TO_EXPIRE,
  };
  test("token generated by generateToken() can be verified by verifyToken()", () => {
    const token = generateToken(payload, SECRET);

    const user = verifyToken(token, SECRET);
    expect(user).toEqual({
      username: payload.username,
      userId: payload.userId,
    });
  });

  test("token with random info can be generated and verified", () => {
    const getRandomNumber = () => Math.floor(Math.random() * 100);
    for (let i = 0; i < 100; i++) {
      const newSecret = `${SECRET} ${getRandomNumber()}`;
      const newPayload = {
        username: `user number ${getRandomNumber()}`,
        userId: getRandomNumber(),
      };

      const token = generateToken(newPayload, newSecret);
      const user = verifyToken(token, newSecret);

      expect(user).toEqual({
        username: newPayload.username,
        userId: newPayload.userId,
      });
    }
  });
});
