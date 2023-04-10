import {
  getCreateManyQuery,
  getCreateQuery,
  getSearchQuery,
  getUpdateQuery,
} from "../../src/db/utils";

describe("getSearchQuery", () => {
  it("should return a query string and values with testId", () => {
    const query = {
      testId: 1,
    };
    const { queryString, values } = getSearchQuery("Test", query);

    expect(queryString).toBe(`SELECT * FROM "Test" WHERE "testId" = $1`);
    expect(values).toEqual([1]);
  });
  it("should return a query string and values with testId and name", () => {
    const query = {
      testId: 1,
      name: "test",
    };
    const { queryString, values } = getSearchQuery("Test", query);
    expect(queryString).toBe(
      `SELECT * FROM "Test" WHERE "testId" = $1 AND "name" = $2`
    );
    expect(values).toEqual([1, "test"]);
  });
  it("should return a query string and values with testId and name and null", () => {
    const query = {
      testId: 1,
      name: "test",
      description: null,
    };
    const { queryString, values } = getSearchQuery("Test", query);
    expect(queryString).toBe(
      `SELECT * FROM "Test" WHERE "testId" = $1 AND "name" = $2 AND "description" = $3`
    );
    expect(values).toEqual([1, "test", null]);
  });
});

describe("getCreateQuery", () => {
  it("should return a query insert string and values with name", () => {
    const toCreate = {
      name: "test",
    };
    const { queryString, values } = getCreateQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name") VALUES ($1) RETURNING *`
    );
    expect(values).toEqual(["test"]);
  });
  it("should return a query insert string and values with name and description", () => {
    const toCreate = {
      name: "test",
      description: "test",
    };
    const { queryString, values } = getCreateQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name", "description") VALUES ($1, $2) RETURNING *`
    );
    expect(values).toEqual(["test", "test"]);
  });
  it("should return a query insert string and values with name and number and null", () => {
    const toCreate = {
      name: "test",
      number: 1,
      description: null,
    };
    const { queryString, values } = getCreateQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name", "number", "description") VALUES ($1, $2, $3) RETURNING *`
    );
    expect(values).toEqual(["test", 1, null]);
  });
  it("should not constestIder testId in the query", () => {
    const toCreate = {
      testId: 1,
      name: "test",
      number: 1,
      description: null,
    };
    const { queryString, values } = getCreateQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name", "number", "description") VALUES ($1, $2, $3) RETURNING *`
    );
    expect(values).toEqual(["test", 1, null]);
  });
});

describe("getUpdateQuery", () => {
  it("should return a query update string and values with name", () => {
    const toUpdate = {
      name: "test",
    };
    const { queryString, values } = getUpdateQuery("Test", toUpdate, 1);
    expect(queryString).toBe(
      `UPDATE "Test" SET "name" = $1 WHERE "testId" = $2 RETURNING *`
    );
    expect(values).toEqual(["test", 1]);
  });
  it("should return a query update string and values with name and description", () => {
    const toUpdate = {
      name: "test",
      description: "test",
    };
    const { queryString, values } = getUpdateQuery("Test", toUpdate, 1);
    expect(queryString).toBe(
      `UPDATE "Test" SET "name" = $1, "description" = $2 WHERE "testId" = $3 RETURNING *`
    );
    expect(values).toEqual(["test", "test", 1]);
  });
  it("should return a query update string and values with name and number and null", () => {
    const toUpdate = {
      name: "test",
      number: 1,
      description: null,
    };
    const { queryString, values } = getUpdateQuery("Test", toUpdate, 1);
    expect(queryString).toBe(
      `UPDATE "Test" SET "name" = $1, "number" = $2, "description" = $3 WHERE "testId" = $4 RETURNING *`
    );
    expect(values).toEqual(["test", 1, null, 1]);
  });
  it("should not constestIder testId in the query", () => {
    const toUpdate = {
      testId: 1,
      name: "test",
      number: 1,
      description: null,
    };
    const { queryString, values } = getUpdateQuery("Test", toUpdate, 1);
    expect(queryString).toBe(
      `UPDATE "Test" SET "name" = $1, "number" = $2, "description" = $3 WHERE "testId" = $4 RETURNING *`
    );
    expect(values).toEqual(["test", 1, null, 1]);
  });
});

describe(getCreateManyQuery.name, () => {
  it("should return a query insert string and values with name", () => {
    const toCreate = [
      {
        name: "test",
      },
      {
        name: "test2",
      },
    ];
    const { queryString, values } = getCreateManyQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name") VALUES ($1), ($2) RETURNING *`
    );
    expect(values).toEqual(["test", "test2"]);
  });

  it("should return a query insert string and values with name and description", () => {
    const toCreate = [
      {
        name: "test",
        description: "test",
      },
      {
        name: "test2",
        description: "test2",
      },
    ];
    const { queryString, values } = getCreateManyQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name", "description") VALUES ($1, $2), ($3, $4) RETURNING *`
    );
    expect(values).toEqual(["test", "test", "test2", "test2"]);
  });
  it("should return a query insert string and values with name and number and null", () => {
    const toCreate = [
      {
        name: "test",
        number: 1,
        description: null,
      },
      {
        name: "test2",
        number: 2,
        description: null,
      },
    ];
    const { queryString, values } = getCreateManyQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name", "number", "description") VALUES ($1, $2, $3), ($4, $5, $6) RETURNING *`
    );
    expect(values).toEqual(["test", 1, null, "test2", 2, null]);
  });

  it("should return a query insert string of only one", () => {
    const toCreate = [
      {
        name: "test",
        number: 1,
        description: null,
      },
    ];
    const { queryString, values } = getCreateManyQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name", "number", "description") VALUES ($1, $2, $3) RETURNING *`
    );
    expect(values).toEqual(["test", 1, null]);
  });

  it("should return a query insert string of only one with only one field", () => {
    const toCreate = [
      {
        name: "test",
      },
    ];
    const { queryString, values } = getCreateManyQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name") VALUES ($1) RETURNING *`
    );
    expect(values).toEqual(["test"]);
  });

  it("should return a query insert string of many", () => {
    const toCreate = [
      {
        name: "test",
        number: 1,
        description: null,
      },
      {
        name: "test2",
        number: 2,
        description: null,
      },
      {
        name: "test3",
        number: 3,
        description: null,
      },
      {
        name: "test4",
        number: 4,
        description: null,
      },
      {
        name: "test5",
        number: 5,
        description: null,
      },
    ];
    const { queryString, values } = getCreateManyQuery("Test", toCreate);
    expect(queryString).toBe(
      `INSERT INTO "Test" ("name", "number", "description") VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9), ($10, $11, $12), ($13, $14, $15) RETURNING *`
    );
    expect(values).toEqual([
      "test",
      1,
      null,
      "test2",
      2,
      null,
      "test3",
      3,
      null,
      "test4",
      4,
      null,
      "test5",
      5,
      null,
    ]);
  });
});
