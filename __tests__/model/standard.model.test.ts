import pool from "../../src/db/pool";
import createStandardModel from "../../src/models/standard.model";
import QueryError from "../../src/modules/QueryError";
import TestModel, { newTestModelSchema } from "../utilities/TestModel";
import {
  deleteAllTests,
  insert1Test,
  insertManyTests,
  insertTestWithOptionals,
  queryId,
} from "../utilities/testDataFactory";

beforeEach(async () => {
  // await pool.connect();
  await deleteAllTests();
});

afterAll(async () => {
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
      expect(returnedTests).toEqual(tests.map(({ returned }) => returned));
    });
  });

  describe("getTestsByQuery", () => {
    it("should return an array of 1 test", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const tests = await standardModel.getTestsByQuery({
        name: returned.name,
      });
      expect(tests).toEqual([returned]);
    });

    it("should return an empty array if db is empty", async () => {
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const tests = await standardModel.getTestsByQuery({ name: "empty db" });
      expect(tests).toEqual([]);
    });

    it("should return an array of many tests", async () => {
      const tests = await insertManyTests();
      const testsSameName = await insertManyTests(50, { similar: true });
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const returnedTests = await standardModel.getTestsByQuery({
        name: testsSameName[0].returned.name,
      });
      const set = new Set(returnedTests.map(({ id }) => id));

      testsSameName.forEach(({ returned: { id } }) => {
        expect(set.has(id)).toBe(true);
      });
      expect(set.size).toBe(testsSameName.length);
      expect(
        returnedTests.every(
          ({ name }) => name === testsSameName[0].returned.name
        )
      ).toBe(true);
      for (let i = 0; i < tests.length; i++) {
        for (let j = i + 1; j < returnedTests.length; j++) {
          expect(tests[i].returned.name).not.toBe(returnedTests[j].name);
        }
      }
    });

    it("should return an empty array if no test matches", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<TestModel, "Test">(
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
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const returnedTests = await standardModel.getTestsByQuery({
        name: initialTests[0].returned.name,
        description: initialTests[0].returned.description,
        number: initialTests[0].returned.number,
      });
      const set = new Set(returnedTests.map(({ id }) => id));
      initialTests.forEach(({ returned: { id } }) => {
        expect(set.has(id)).toBe(true);
      });
      expect(set.size).toBe(initialTests.length);
    });
  });

  describe("getTestById", () => {
    it("should return a test", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const test = await standardModel.getTestById(returned.id);
      expect(test).toEqual(returned);
    });

    it("should throw QueryError if no test matches(empty db)", async () => {
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      await expect(standardModel.getTestById(1)).rejects.toThrow(
        new QueryError(["No rows returned"])
      );
    });

    it("should throw QueryError if no test matches id", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.getTestById(Math.floor(Math.random() * 1000000))
      ).rejects.toThrow(new QueryError(["No rows returned"]));
    });

    it("should return a test with many rows in db", async () => {
      const tests = await insertManyTests(20);
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const test = await standardModel.getTestById(tests[10].returned.id);
      expect(test).toEqual(tests[10].returned);
    });
  });

  describe("createTest", () => {
    it("should return a test", async () => {
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const toInsert = {
        name: "test",
        description: "test",
        number: 1,
      };
      const inserted = await standardModel.createTest(toInsert);
      const testFromDB = await queryId(inserted.id);
      expect(inserted).toHaveProperty("id");
      expect(inserted).toHaveProperty("name", testFromDB.name);
      expect(inserted).toHaveProperty("description", testFromDB.description);
      expect(inserted).toHaveProperty("number", testFromDB.number);
      expect(inserted).toEqual(testFromDB);
    });

    it("should throw QueryError if no test is created (missing required)", async () => {
      const standardModel = createStandardModel<TestModel, "Test">(
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
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const toInsert = {
        name: "test",
        description: "test",
        number: 1,
      };
      const inserted = await standardModel.createTest(toInsert);
      const testFromDB = await queryId(inserted.id);
      expect(inserted).toHaveProperty("id");
      expect(inserted).toHaveProperty("name", testFromDB.name);
      expect(inserted).toHaveProperty("description", testFromDB.description);
      expect(inserted).toHaveProperty("number", testFromDB.number);
      expect(inserted).toEqual(testFromDB);
    });
  });

  describe("replaceTest", () => {
    it("should return the test updated", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
        description: "updated description",
        number: 1,
      };
      const updated = await standardModel.replaceTestById(
        returned.id,
        toUpdate
      );
      const testFromDB = await queryId(updated.id);
      expect(updated).toHaveProperty("id", testFromDB.id);
      expect(updated.id).toBe(returned.id);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
    });

    it("should throw if no test is updated (missing required)", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.replaceTestById(returned.id, {
          description: "test",
          number: 1,
        } as TestModel)
      ).rejects.toThrowError();
    });

    it("should return a test with many rows in db", async () => {
      const tests = await insertManyTests(20);
      const targetTest = tests[10].returned;
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "test",
        description: "test",
        number: 1,
      };
      const updated = await standardModel.replaceTestById(
        targetTest.id,
        toUpdate
      );
      const testFromDB = await queryId(updated.id);
      expect(updated).toHaveProperty("id", testFromDB.id);
      expect(updated.id).toBe(targetTest.id);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(targetTest);
    });

    it("should throw QueryError if no test matches(empty db)", async () => {
      const standardModel = createStandardModel<TestModel, "Test">(
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

    it("should throw QueryError if no test matches id", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<TestModel, "Test">(
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
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
      };
      const updated = await standardModel.replaceTestById(
        returned.id,
        toUpdate
      );
      const testFromDB = await queryId(updated.id);
      expect(updated).toHaveProperty("id", testFromDB.id);
      expect(updated.id).toBe(returned.id);
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
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
        description: "updated description",
        number: 1,
      };
      const updated = await standardModel.patchTestById(returned.id, toUpdate);
      const testFromDB = await queryId(updated.id);
      expect(updated).toHaveProperty("id", testFromDB.id);
      expect(updated.id).toBe(returned.id);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(returned);
    });

    it("should return the test patched with some properties", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
        description: "updated description",
      };
      const updated = await standardModel.patchTestById(returned.id, toUpdate);
      const testFromDB = await queryId(updated.id);
      expect(updated).toHaveProperty("id", testFromDB.id);
      expect(updated.id).toBe(returned.id);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated.description).not.toBe(returned.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(returned);
    });

    it("should not throw if is missing required", async () => {
      const { returned } = await insert1Test();
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        description: "updated description",
      };
      const updated = await standardModel.patchTestById(returned.id, toUpdate);
      const testFromDB = await queryId(updated.id);
      expect(updated).toHaveProperty("id", testFromDB.id);
      expect(updated.id).toBe(returned.id);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(returned);
    });

    it("should return a test with many rows in db", async () => {
      const tests = await insertManyTests(20);
      const targetTest = tests[10].returned;
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const toUpdate = {
        name: "updated name",
        description: "updated description",
        number: 1,
      };
      const updated = await standardModel.patchTestById(
        targetTest.id,
        toUpdate
      );
      const testFromDB = await queryId(updated.id);
      expect(updated).toHaveProperty("id", testFromDB.id);
      expect(updated.id).toBe(targetTest.id);
      expect(updated).toHaveProperty("name", testFromDB.name);
      expect(updated).toHaveProperty("description", testFromDB.description);
      expect(updated).toHaveProperty("number", testFromDB.number);
      expect(updated).toEqual(testFromDB);
      expect(updated).not.toEqual(targetTest);
    });

    it("should throw QueryError if no test matches(empty db)", async () => {
      const standardModel = createStandardModel<TestModel, "Test">(
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

    it("should throw QueryError if no test matches id", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<TestModel, "Test">(
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
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const deleted = await standardModel.deleteTestById(returned.id);
      const testFromDB = await queryId(deleted.id);
      expect(deleted).toHaveProperty("id", returned.id);
      expect(deleted.id).toBe(returned.id);
      expect(deleted).toHaveProperty("name", returned.name);
      expect(deleted).toHaveProperty("description", returned.description);
      expect(deleted).toHaveProperty("number", returned.number);
      expect(deleted).toEqual(returned);
      expect(testFromDB).toBeUndefined();
    });

    it("should return a test with many rows in db", async () => {
      const tests = await insertManyTests(20);
      const targetTest = tests[10].returned;
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      const deleted = await standardModel.deleteTestById(targetTest.id);
      const testFromDB = await queryId(deleted.id);
      expect(deleted).toHaveProperty("id", targetTest.id);
      expect(deleted.id).toBe(targetTest.id);
      expect(deleted).toHaveProperty("name", targetTest.name);
      expect(deleted).toHaveProperty("description", targetTest.description);
      expect(deleted).toHaveProperty("number", targetTest.number);
      expect(deleted).toEqual(targetTest);
      expect(testFromDB).toBeUndefined();
    });

    it("should throw QueryError if no test matches(empty db)", async () => {
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      await expect(standardModel.deleteTestById(1)).rejects.toThrow(
        new QueryError(["No rows returned"])
      );
    });

    it("should throw QueryError if no test matches id", async () => {
      await insertManyTests();
      const standardModel = createStandardModel<TestModel, "Test">(
        "Test",
        newTestModelSchema
      );
      await expect(
        standardModel.deleteTestById(Math.floor(Math.random() * 1000000))
      ).rejects.toThrow(new QueryError(["No rows returned"]));
    });
  });
});
