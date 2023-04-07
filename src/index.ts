import app from "./app";
import dotenv from "dotenv";
import pool from "./db/pool";

dotenv.config();

const HOSTNAME = "localhost";
const PORT = process.env.PORT ? +process.env.PORT : 3000;

app.listen(
  PORT,
  HOSTNAME, // Comment this to make it available from outside container
  () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    pool
      .connect()
      .then(() => {
        console.log("Connected to database");
      })
      .catch((e) => {
        console.error("Error connecting to database", e);
      });
  }
);
