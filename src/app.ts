import http from "http";
const HOSTNAME = "localhost";
// const HOSTNAME = "127.0.0.1";

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(
    `
  Cesar Moros.
  Metro (employees, trains, schedules, etc.).
  The question is: what is the interval between trains at one time or another,
  if 6 cars and each accommodates 50 people,
  and the flow of people in the morning is 1000 people, at lunch 500, and in the evening 5000
  `,
    "utf-8"
  );
});

server.listen(
  PORT,
  HOSTNAME, // Comment this to make it available from outside container
  () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
  }
);
