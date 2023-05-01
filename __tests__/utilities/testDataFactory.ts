import { hash } from "bcrypt";
import pool from "../../src/db/pool";
import { User } from "../../src/types/User";
import TestModel from "./TestModel";
import { SALT } from "../../src/modules/auth/utils";

export const createTestDB = async (number = 0) => {
  const tableNumber = number === 0 ? "" : number;
  await pool.query(`DROP TABLE IF EXISTS "Test${tableNumber}"`);
  await pool.query(`CREATE TABLE IF NOT EXISTS "Test${tableNumber}" (
    "test${tableNumber}Id" serial4 NOT NULL,
    "name" text NOT NULL,
    "number" int4 NULL,
    "description" text NULL,
    CONSTRAINT "Test${number}_pkey" PRIMARY KEY ("test${tableNumber}Id")
  )`);
  return `Test${tableNumber}`;
};

export const dropTestDB = async (number = 0) => {
  const tableNumber = number === 0 ? "" : number;
  await pool.query(`DROP TABLE IF EXISTS "Test${tableNumber}"`);
};

export const insert1Test = async (tableId = "") => {
  const random = Math.floor(Math.random() * 100000);
  const inserted = {
    name: `test ${random}`,
  };
  const returnedRows = await pool.query<TestModel>(
    `INSERT INTO "Test${tableId}" ("name") VALUES ($1) RETURNING *`,
    [inserted.name]
  );
  const returned = returnedRows.rows[0];
  return { inserted, returned };
};

export const insertTestWithOptionals = async (tableId = "") => {
  const random = Math.floor(Math.random() * 100000);
  const inserted = {
    name: `test ${random}`,
    description: "test description",
    number: 123123,
  };
  const returnedRows = await pool.query<TestModel>(
    `INSERT INTO "Test${tableId}" ("name", "description", "number") VALUES ($1, $2, $3) RETURNING *`,
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
  },
  tableId = ""
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
        `INSERT INTO "Test${tableId}" ("name", "description", "number") VALUES ($1, $2, $3) RETURNING *`,
        [inserted.name, inserted.description, inserted.number]
      );
    } else {
      inserted = {
        name: `test ${random}`,
      };
      returnedRows = await pool.query(
        `INSERT INTO "Test${tableId}" ("name") VALUES ($1) RETURNING *`,
        [inserted.name]
      );
    }
    const returned = returnedRows.rows[0];
    tests.push({ inserted, returned });
  }
  return tests;
};

export const deleteAllTests = async (tableId = "") => {
  await pool.query(`DELETE FROM "Test${tableId}"`);
};

export const queryId = async (id: number, tableId = "") => {
  const returnedRows = await pool.query<TestModel>(
    `SELECT * FROM "Test${tableId}" WHERE "test${tableId}Id" = $1`,
    [id]
  );
  return returnedRows.rows[0];
};

export const testQueriesWithTableId = (tableNumber: number) => ({
  createTestDB: () => createTestDB(tableNumber),
  dropTestDB: () => dropTestDB(tableNumber),
  insert1Test: () => insert1Test(`${tableNumber}`),
  insertTestWithOptionals: () => insertTestWithOptionals(`${tableNumber}`),
  insertManyTests: (
    quantity = 50,
    {
      similar = false,
      optionals = false,
    }: { similar?: boolean; optionals?: boolean } = {
      similar: false,
      optionals: false,
    }
  ) => insertManyTests(quantity, { similar, optionals }, `${tableNumber}`),
  deleteAllTests: () => deleteAllTests(`${tableNumber}`),
  queryId: (id: number) => queryId(id, `${tableNumber}`),
});

export const createTestUser = async () => {
  const random = Math.floor(Math.random() * 100000);
  const notHashedPassword = `test ${random}`;
  const inserted = {
    username: `test ${random}`,
    password: await hash(notHashedPassword, SALT),
  };
  const returnedRows = await pool.query<User>(
    `INSERT INTO "User" ("username", "password") VALUES ($1, $2) RETURNING *`,
    [inserted.username, inserted.password]
  );
  const returned = returnedRows.rows[0];
  return { inserted, returned, notHashedPassword };
};

export const deleteTestUsers = async () => {
  await pool.query(`DELETE FROM "User" WHERE "username" LIKE 'test%'`);
};
