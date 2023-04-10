import pool from "../../src/db/pool";
import createStandardModel from "../../src/models/standard.model";
import QueryError from "../../src/modules/QueryError";
import TestModel, { newTestModelSchema } from "../utilities/TestModel";
import {
  // testQueriesWithTableId,
  createTestDB,
  dropTestDB,
  deleteAllTests,
  insert1Test,
  insertManyTests,
  insertTestWithOptionals,
  queryId,
} from "../utilities/testDataFactory";

// const tableNumber = Math.floor(Math.random() * 100000);
// const tableId = `${tableNumber}`;
// const tableName = `Test${tableId}`;
// const tableName = "Test";

// const {
//   createTestDB,
//   deleteAllTests,
//   dropTestDB,
//   insert1Test,
//   insertManyTests,
//   insertTestWithOptionals,
//   queryId,
// } = testQueriesWithTableId(tableNumber);

beforeAll(async () => {
  await createTestDB();
});

beforeEach(async () => {
  // await pool.connect();
  await deleteAllTests();
});

afterAll(async () => {
  await dropTestDB();
  await pool.end();
});

describe("createStandardModel", () => {
  it("should return a model with the correct methods", () => {
    const standardModel = createStandardModel("Test", newTestModelSchema);
    expect(standardModel).toHaveProperty("getAllTests");
    expect(standardModel).toHaveProperty("getTestsByQuery");
    expect(standardModel).toHaveProperty("getTestById");
    expect(standardModel).toHaveProperty("createTest");
    expect(standardModel).toHaveProperty("replaceTestById");
    expect(standardModel).toHaveProperty("patchTestById");
    expect(standardModel).toHaveProperty("deleteTestById");
  });

  describe("getAllTests", () => {
    it("should return an array of 1 test", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel("Test", newTestModelSchema);
      const tests = await standardModel.getAllTests();
      expect(tests).toEqual([returned]);
    });

    it("should return an empty array if there are no tests", async () => {
      const standardModel = createStandardModel("Test", newTestModelSchema);
      const tests = await standardModel.getAllTests();
      expect(tests).toEqual([]);
    });

    it("should return an array of many tests", async () => {
      const tests = await insertManyTests();
      const standardModel = createStandardModel("Test", newTestModelSchema);
      const returnedTests = await standardModel.getAllTests();
      expect(returnedTests).toHaveLength(tests.length);
      const set = new Set(returnedTests.map(({ testId }) => testId));
      expect(set.size).toBe(tests.length);
      expect(tests.every(({ returned: { testId } }) => set.has(testId))).toBe(
        true
      );
    });
  });

  describe("getTestsByQuery", () => {
    it("should return an array of 1 test", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const tests = await standardModel.getTestsByQuery({
        name: returned.name,
      });
      expect(tests).toEqual([returned]);
    });

    it("should return an empty array if db is empty", async () => {
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const tests = await standardModel.getTestsByQuery({ name: "empty db" });
      expect(tests).toEqual([]);
    });

    it("should return an array of many tests", async () => {
      await insertManyTests();
      const testsSameName = await insertManyTests(50, { similar: true });
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );

      const returnedTests = await standardModel.getTestsByQuery({
        name: testsSameName[0].returned.name,
      });

      const set = new Set(returnedTests.map(({ testId }) => testId));
      expect(
        testsSameName.every(({ returned: { testId } }) => set.has(testId))
      ).toBe(true);
      expect(set.size).toBe(testsSameName.length);
      expect(
        returnedTests.every(
          ({ name }) => name === testsSameName[0].returned.name
        )
      ).toBe(true);
    });

    it("should return an empty array if no test matches", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const tests = await standardModel.getTestsByQuery({
        name: "no test match this name",
      });
      expect(tests).toEqual([]);
    });

    it("should return array matching many columns", async () => {
      await insertManyTests(20);
      const initialTests = await insertManyTests(20, {
        similar: true,
        optionals: true,
      });
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const returnedTests = await standardModel.getTestsByQuery({
        name: initialTests[0].returned.name,
        description: initialTests[0].returned.description,
        number: initialTests[0].returned.number,
      });
      const set = new Set(returnedTests.map(({ testId }) => testId));
      initialTests.forEach(({ returned: { testId } }) => {
        expect(set.has(testId)).toBe(true);
      });
      expect(set.size).toBe(initialTests.length);
    });
  });

  describe("getTestById", () => {
    it("should return a test", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const test = await standardModel.getTestById(returned.testId);
      expect(test).toEqual(returned);
    });

    it("should throw QueryError if no test matches(empty db)", async () => {
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(standardModel.getTestById(1)).rejects.toThrow(
        new QueryError(["No rows returned"])
      );
    });

    it("should throw QueryError if no test matches testId", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.getTestById(Math.floor(Math.random() * 1000000))
      ).rejects.toThrow(new QueryError(["No rows returned"]));
    });

    it("should return a test with many rows in db", async () => {
      const tests = await insertManyTests(20);
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const test = await standardModel.getTestById(tests[10].returned.testId);
      expect(test).toEqual(tests[10].returned);
    });
  });

  describe("createTest", () => {
    it("should return a test", async () => {
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const toInsert = {
        name: "test",
        description: "test",
        number: 1,
      };
      const inserted = await standardModel.createTest(toInsert);
      const testFromDB = await queryId(inserted.testId);
      expect(inserted).toHaveProperty("testId");
      expect(inserted).toHaveProperty("name", testFromDB.name);
      expect(inserted).toHaveProperty("description", testFromDB.description);
      expect(inserted).toHaveProperty("number", testFromDB.number);
      expect(inserted).toEqual(testFromDB);
    });

    it("should throw QueryError if no test is created (missing required)", async () => {
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.createTest({
          description: "test",
          number: 1,
        } as TestModel)
      ).rejects.toThrowError();
    });

    it("should return a test with many rows in db", async () => {
      await insertManyTests(20);
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const toInsert = {
        name: "test",
        description: "test",
        number: 1,
      };
      const inserted = await standardModel.createTest(toInsert);
      const testFromDB = await queryId(inserted.testId);
      expect(inserted).toHaveProperty("testId");
      expect(inserted).toHaveProperty("name", testFromDB.name);
      expect(inserted).toHaveProperty("description", testFromDB.description);
      expect(inserted).toHaveProperty("number", testFromDB.number);
      expect(inserted).toEqual(testFromDB);
    });
  });

  describe("replaceTest", () => {
    it("should return the test updated", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
        description: "updated description",
        number: 1,
      };
      const updated = await standardModel.replaceTestById(
        returned.testId,
        toUpdate
      );
      const testFromDB = await queryId(updated.testId);
      expect(updated).toHaveProperty("testId", testFromDB.testId);
      expect(updated.testId).toBe(returned.testId);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
    });

    it("should throw if no test is updated (missing required)", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.replaceTestById(returned.testId, {
          description: "test",
          number: 1,
        } as TestModel)
      ).rejects.toThrowError();
    });

    it("should return a test with many rows in db", async () => {
      const tests = await insertManyTests(20);
      const targetTest = tests[10].returned;
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "test",
        description: "test",
        number: 1,
      };
      const updated = await standardModel.replaceTestById(
        targetTest.testId,
        toUpdate
      );
      const testFromDB = await queryId(updated.testId);
      expect(updated).toHaveProperty("testId", testFromDB.testId);
      expect(updated.testId).toBe(targetTest.testId);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(targetTest);
    });

    it("should throw QueryError if no test matches(empty db)", async () => {
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.replaceTestById(1, {
          name: "test",
          description: "test",
          number: 1,
        })
      ).rejects.toThrow(new QueryError(["No rows returned"]));
    });

    it("should throw QueryError if no test matches testId", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.replaceTestById(Math.floor(Math.random() * 1000000), {
          name: "test",
          description: "test",
          number: 1,
        })
      ).rejects.toThrow(new QueryError(["No rows returned"]));
    });

    it("should replace completely test from db", async () => {
      const { returned } = await insertTestWithOptionals();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
      };
      const updated = await standardModel.replaceTestById(
        returned.testId,
        toUpdate
      );
      const testFromDB = await queryId(updated.testId);
      expect(updated).toHaveProperty("testId", testFromDB.testId);
      expect(updated.testId).toBe(returned.testId);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", null);
      expect(updated).toHaveProperty("number", null);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(returned);
    });
  });

  describe("patchTest", () => {
    it("should return the test patched with all properties", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
        description: "updated description",
        number: 1,
      };
      const updated = await standardModel.patchTestById(
        returned.testId,
        toUpdate
      );
      const testFromDB = await queryId(updated.testId);
      expect(updated).toHaveProperty("testId", testFromDB.testId);
      expect(updated.testId).toBe(returned.testId);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(returned);
    });

    it("should return the test patched with some properties", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
        description: "updated description",
      };
      const updated = await standardModel.patchTestById(
        returned.testId,
        toUpdate
      );
      const testFromDB = await queryId(updated.testId);
      expect(updated).toHaveProperty("testId", testFromDB.testId);
      expect(updated.testId).toBe(returned.testId);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated.description).not.toBe(returned.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(returned);
    });

    it("should not throw if is missing required", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        description: "updated description",
      };
      const updated = await standardModel.patchTestById(
        returned.testId,
        toUpdate
      );
      const testFromDB = await queryId(updated.testId);
      expect(updated).toHaveProperty("testId", testFromDB.testId);
      expect(updated.testId).toBe(returned.testId);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(returned);
    });

    it("should return a test with many rows in db", async () => {
      const tests = await insertManyTests(20);
      const targetTest = tests[10].returned;
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
        description: "updated description",
        number: 1,
      };
      const updated = await standardModel.patchTestById(
        targetTest.testId,
        toUpdate
      );
      const testFromDB = await queryId(updated.testId);
      expect(updated).toHaveProperty("testId", testFromDB.testId);
      expect(updated.testId).toBe(targetTest.testId);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(targetTest);
    });

    it("should throw QueryError if no test matches(empty db)", async () => {
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.patchTestById(1, {
          name: "test",
          description: "test",
          number: 1,
        })
      ).rejects.toThrow(new QueryError(["No rows returned"]));
    });

    it("should throw QueryError if no test matches testId", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.patchTestById(Math.floor(Math.random() * 1000000), {
          name: "test",
          description: "test",
          number: 1,
        })
      ).rejects.toThrow(new QueryError(["No rows returned"]));
    });
  });

  describe("deleteTest", () => {
    it("should return the test deleted", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const deleted = await standardModel.deleteTestById(returned.testId);
      const testFromDB = await queryId(deleted.testId);
      expect(deleted).toHaveProperty("testId", returned.testId);
      expect(deleted.testId).toBe(returned.testId);
      expect(deleted).toHaveProperty("name", returned.name);
      expect(deleted).toHaveProperty("description", returned.description);
      expect(deleted).toHaveProperty("number", returned.number);
      expect(deleted).toEqual(returned);
      expect(testFromDB).toBeUndefined();
    });

    it("should return a test with many rows in db", async () => {
      const tests = await insertManyTests(20);
      const targetTest = tests[10].returned;
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      const deleted = await standardModel.deleteTestById(targetTest.testId);
      const testFromDB = await queryId(deleted.testId);
      expect(deleted).toHaveProperty("testId", targetTest.testId);
      expect(deleted.testId).toBe(targetTest.testId);
      expect(deleted).toHaveProperty("name", targetTest.name);
      expect(deleted).toHaveProperty("description", targetTest.description);
      expect(deleted).toHaveProperty("number", targetTest.number);
      expect(deleted).toEqual(targetTest);
      expect(testFromDB).toBeUndefined();
    });

    it("should throw QueryError if no test matches(empty db)", async () => {
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(standardModel.deleteTestById(1)).rejects.toThrow(
        new QueryError(["No rows returned"])
      );
    });

    it("should throw QueryError if no test matches testId", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<"Test", TestModel>(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.deleteTestById(Math.floor(Math.random() * 1000000))
      ).rejects.toThrow(new QueryError(["No rows returned"]));
    });
  });
});
