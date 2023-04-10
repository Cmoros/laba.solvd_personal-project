/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import createStandardController from "../../src/controllers/standard.controller";
import QueryError from "../../src/modules/QueryError";
import JSONResponse from "../../src/types/JSONResponse";
import crypto from "crypto";
import {
  deleteAllTests,
  insert1Test,
  insertTestWithOptionals,
  createTestDB,
  dropTestDB,
} from "../utilities/testDataFactory";
import TestModel, { newTestModelSchema } from "../utilities/TestModel";
import pool from "../../src/db/pool";

beforeAll(async () => {
  await createTestDB();
});

beforeEach(async () => {
  await deleteAllTests();
});

afterAll(async () => {
  await dropTestDB();
  await pool.end();
});

describe("createStandardController", () => {
  it("should return a standard controller with all the methods", () => {
    const standardController = createStandardController(
      "Test",
      newTestModelSchema
    );
    expect(standardController).toHaveProperty("getTests");
    expect(standardController).toHaveProperty("getTest");
    expect(standardController).toHaveProperty("postTest");
    expect(standardController).toHaveProperty("putTest");
    expect(standardController).toHaveProperty("patchTest");
    expect(standardController).toHaveProperty("deleteTest");
  });

  describe("getTests", () => {
    it("should return a function", () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      expect(typeof standardController.getTests).toBe("function");
      expect(standardController.getTests).toHaveLength(3);
    });

    it("should respond with a 200 and an array of tests", async () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn((code: number) => expect(code).toBe(200))
          .mockReturnThis(),
        json: jest.fn((data: JSONResponse<"Test", TestModel[]>) => {
          expect(data).toHaveProperty("success");
          expect(data.success).toBe(true);
          expect(data).toHaveProperty("data");
          expect(data.data).toBeInstanceOf(Array);
        }),
      };
      const next = jest.fn();
      await standardController.getTests({ query: {} } as any, res as any, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it("should call next with a QueryError if something went wrong (table does not exist)", async () => {
      const standardController = createStandardController(
        "Inexisting",
        newTestModelSchema
      );
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn((error: Error) =>
        expect(error).toBeInstanceOf(QueryError)
      );
      await standardController.getInexistings(
        { query: {} } as any,
        res as any,
        next as any
      );
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should respond with a 200 and an array of tests filtered by query", async () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn((code: number) => expect(code).toBe(200))
          .mockReturnThis(),
        json: jest.fn((data: JSONResponse<"Test", TestModel[]>) => {
          expect(data).toHaveProperty("success");
          expect(data.success).toBe(true);
          expect(data).toHaveProperty("data");
          expect(data.data).toBeInstanceOf(Array);
        }),
      };
      const next = jest.fn();
      await standardController.getTests(
        { query: { name: "Test" } } as any,
        res as any,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("getTest", () => {
    it("should return a function", () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      expect(typeof standardController.getTest).toBe("function");
      expect(standardController.getTest).toHaveLength(3);
    });

    it("should respond with a 200 and a test", async () => {
      const { returned } = await insert1Test();
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn((code: number) => expect(code).toBe(200))
          .mockReturnThis(),
        json: jest.fn((data: JSONResponse<"Test", TestModel>) => {
          expect(data).toHaveProperty("success");
          expect(data.success).toBe(true);
          expect(data).toHaveProperty("data");
          expect(data.data).toEqual(returned);
        }),
      };
      const next = jest.fn();
      await standardController.getTest(
        { params: { id: returned.testId } } as any,
        res as any,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it("should call next with a QueryError if something went wrong", async () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn(() => {
            throw new QueryError(["Not found"]);
          })
          .mockReturnThis(),
        json() {
          throw new QueryError(["Not found"]);
        },
      };
      const next = jest.fn((error: Error) =>
        expect(error).toBeInstanceOf(QueryError)
      );
      await standardController.getTest(
        { params: { id: "123" } } as any,
        res as any,
        next as any
      );
      expect(next).toHaveBeenCalled();
    });

    it("should call next if the test is not found", async () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn((error: Error) => {
        expect(error).toBeInstanceOf(QueryError);
      });
      await standardController.getTest(
        { params: { id: crypto.randomUUID() } } as any,
        res as any,
        next as any
      );
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("postTest", () => {
    it("should return a function", () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      expect(typeof standardController.postTest).toBe("function");
      expect(standardController.postTest).toHaveLength(3);
    });

    it("should respond with a 201 and the created test", async () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn((code: number) => expect(code).toBe(201))
          .mockReturnThis(),
        json: jest.fn((data: JSONResponse<"Test", TestModel>) => {
          expect(data).toHaveProperty("success");
          expect(data.success).toBe(true);
          expect(data).toHaveProperty("data");
          expect(data.data).toHaveProperty("testId");
          expect(data.data).toHaveProperty("name");
        }),
      };
      const next = jest.fn();
      await standardController.postTest(
        { body: { name: "Test" } } as any,
        res as any,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it("should call next with a QueryError if Test was not created (not existing table)", async () => {
      const standardController = createStandardController(
        "Inexisting",
        newTestModelSchema
      );
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn((error: Error) =>
        expect(error).toBeInstanceOf(QueryError)
      );
      await standardController.postInexisting(
        { body: { name: "This is gonna fail anyway" } } as any,
        res as any,
        next as any
      );
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("putTest", () => {
    it("should return a function", () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      expect(typeof standardController.putTest).toBe("function");
      expect(standardController.putTest).toHaveLength(3);
    });

    it("should respond with a 200 and the updated test", async () => {
      const { returned } = await insert1Test();
      const { testId } = returned;
      const toUpdate = { name: "Updated" };

      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn((code: number) => expect(code).toBe(200))
          .mockReturnThis(),
        json: jest.fn((data: JSONResponse<"Test", TestModel>) => {
          expect(data).toHaveProperty("success");
          expect(data.success).toBe(true);
          expect(data).toHaveProperty("data");
          expect(data.data).toHaveProperty("testId");
          expect(data.data).toHaveProperty("name");
          expect(data.data).toEqual({
            testId,
            description: null,
            number: null,
            ...toUpdate,
          });
          expect(data.data).not.toEqual(returned);
        }),
      };
      const next = jest.fn();

      await standardController.putTest(
        { params: { id: testId }, body: toUpdate } as any,
        res as any,
        next
      );

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it("should call next with a QueryError if Test was not updated (not existing testId)", async () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn((error: Error) =>
        expect(error).toBeInstanceOf(QueryError)
      );
      await standardController.putTest(
        {
          params: { id: crypto.randomUUID() },
          body: { name: "Updated" },
        } as any,
        res as any,
        next as any
      );
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should replace the test with the new one", async () => {
      const { returned } = await insertTestWithOptionals();
      const { testId } = returned;
      const toUpdate = { name: "Updated" };

      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn((code: number) => expect(code).toBe(200))
          .mockReturnThis(),
        json: jest.fn((data: JSONResponse<"Test", TestModel>) => {
          expect(data).toHaveProperty("success");
          expect(data.success).toBe(true);
          expect(data).toHaveProperty("data");
          expect(data.data).toHaveProperty("testId");
          expect(data.data).toHaveProperty("name");
          expect(data.data).toEqual({
            testId,
            description: null,
            number: null,
            ...toUpdate,
          });
          expect(data.data).not.toEqual(returned);
        }),
      };
      const next = jest.fn();
      await standardController.putTest(
        { params: { id: testId }, body: toUpdate } as any,
        res as any,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("patchTest", () => {
    it("should return a function", () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      expect(typeof standardController.patchTest).toBe("function");
      expect(standardController.patchTest).toHaveLength(3);
    });

    it("should respond with a 200 and the patched test", async () => {
      const { returned } = await insert1Test();
      const { testId } = returned;
      const toPatch = { name: "Updated", description: "Updated description" };

      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn((code: number) => expect(code).toBe(200))
          .mockReturnThis(),
        json: jest.fn((data: JSONResponse<"Test", TestModel>) => {
          expect(data).toHaveProperty("success");
          expect(data.success).toBe(true);
          expect(data).toHaveProperty("data");
          expect(data.data).toHaveProperty("testId");
          expect(data.data).toHaveProperty("name");
          expect(data.data).toEqual({
            ...returned,
            ...toPatch,
          });
          expect(data.data).not.toEqual(returned);
        }),
      };
      const next = jest.fn();
      await standardController.patchTest(
        { params: { id: testId }, body: toPatch } as any,
        res as any,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it("should call next with a QueryError if Test was not patched (not existing testId)", async () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn((error: Error) =>
        expect(error).toBeInstanceOf(QueryError)
      );
      await standardController.patchTest(
        {
          params: { id: crypto.randomUUID() },
          body: { name: "Updated" },
        } as any,
        res as any,
        next as any
      );
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should patch the test with the new values that were required", async () => {
      const { returned } = await insertTestWithOptionals();
      const { testId } = returned;
      const toPatch = {
        name: "updated name",
      };

      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest

          .fn((code: number) => expect(code).toBe(200))
          .mockReturnThis(),
        json: jest.fn((data: JSONResponse<"Test", TestModel>) => {
          expect(data).toHaveProperty("success");
          expect(data.success).toBe(true);
          expect(data).toHaveProperty("data");
          expect(data.data).toHaveProperty("testId");
          expect(data.data).toHaveProperty("name");
          expect(data.data).toEqual({
            ...returned,
            ...toPatch,
          });
          expect(data.data).not.toEqual(returned);
        }),
      };
      const next = jest.fn();
      await standardController.patchTest(
        { params: { id: testId }, body: toPatch } as any,
        res as any,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it("should patch the test with the new values that were optionals", async () => {
      const { returned } = await insertTestWithOptionals();
      const { testId } = returned;
      const toPatch = {
        description: "updated description",
        number: 999,
      };

      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn((code: number) => expect(code).toBe(200))
          .mockReturnThis(),
        json: jest.fn((data: JSONResponse<"Test", TestModel>) => {
          expect(data).toHaveProperty("success");
          expect(data.success).toBe(true);
          expect(data).toHaveProperty("data");
          expect(data.data).toHaveProperty("testId");
          expect(data.data).toHaveProperty("name");
          expect(data.data).toEqual({
            ...returned,
            ...toPatch,
          });
          expect(data.data).not.toEqual(returned);
        }),
      };
      const next = jest.fn();
      await standardController.patchTest(
        { params: { id: testId }, body: toPatch } as any,
        res as any,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("deleteTest", () => {
    it("should return a function", () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      expect(typeof standardController.deleteTest).toBe("function");
      expect(standardController.deleteTest).toHaveLength(3);
    });

    it("should respond with a 204", async () => {
      const { returned } = await insert1Test();
      const { testId } = returned;

      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest
          .fn((code: number) => expect(code).toBe(204))
          .mockReturnThis(),
        end: jest.fn(),
      };
      const next = jest.fn();
      await standardController.deleteTest(
        { params: { id: testId } } as any,
        res as any,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
    });

    it("should call next with a QueryError if Test was not deleted (not existing testId)", async () => {
      const standardController = createStandardController(
        "Test",
        newTestModelSchema
      );
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
      };
      const next = jest.fn((error: Error) =>
        expect(error).toBeInstanceOf(QueryError)
      );
      await standardController.deleteTest(
        { params: { id: crypto.randomUUID() } } as any,
        res as any,
        next as any
      );
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.end).not.toHaveBeenCalled();
    });
  });
});
