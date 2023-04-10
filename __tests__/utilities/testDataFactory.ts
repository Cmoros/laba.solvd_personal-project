import pool from "../../src/db/pool";
import TestModel from "./TestModel";

export const insert1Test = async () => {
  const random = Math.floor(Math.random() * 100000);
  const inserted = {
    name: `test ${random}`,
  };
  const returnedRows = await pool.query<TestModel>(
    `INSERT INTO "Test" ("name") VALUES ($1) RETURNING *`,
    [inserted.name]
  );
  const returned = returnedRows.rows[0];
  return { inserted, returned };
};

export const insertTestWithOptionals = async () => {
  const random = Math.floor(Math.random() * 100000);
  const inserted = {
    name: `test ${random}`,
    description: "test description",
    number: 123123,
  };
  const returnedRows = await pool.query<TestModel>(
    `INSERT INTO "Test" ("name", "description", "number") VALUES ($1, $2, $3) RETURNING *`,
    [inserted.name, inserted.description, inserted.number]
  );
  const returned = returnedRows.rows[0];
  return { inserted, returned };
};

export const insertManyTests = async (
  quantity = 50,
  {
    similar = false,
    optionals = false,
  }: { similar?: boolean; optionals?: boolean } = {
    similar: false,
    optionals: false,
  }
) => {
  const tests = [];
  const RANDOM = Math.floor(Math.random() * 100000);
  const getRandom = () =>
    similar ? RANDOM : Math.floor(Math.random() * 100000);

  for (let i = 0; i < quantity; i++) {
    const random = getRandom();
    let returnedRows: { rows: TestModel[] };
    let inserted;
    if (optionals) {
      inserted = {
        name: `test ${random}`,
        description: `test description ${random}`,
        number: random,
      };
      returnedRows = await pool.query(
        `INSERT INTO "Test" ("name", "description", "number") VALUES ($1, $2, $3) RETURNING *`,
        [inserted.name, inserted.description, inserted.number]
      );
    } else {
      inserted = {
        name: `test ${random}`,
      };
      returnedRows = await pool.query(
        `INSERT INTO "Test" ("name") VALUES ($1) RETURNING *`,
        [inserted.name]
      );
    }
    const returned = returnedRows.rows[0];
    tests.push({ inserted, returned });
  }
  return tests;
};

export const deleteAllTests = async () => {
  await pool.query(`DELETE FROM "Test"`);
};

export const queryId = async (id: number) => {
  const returnedRows = await pool.query<TestModel>(
    `SELECT * FROM "Test" WHERE id = $1`,
    [id]
  );
  return returnedRows.rows[0];
};
