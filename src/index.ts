import app from "./app";

const HOSTNAME = "localhost";
const PORT = process.env.PORT ? +process.env.PORT : 3000;

app.listen(
  PORT,
  HOSTNAME, // Comment this to make it available from outside container
  () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
  }
);
("test");
