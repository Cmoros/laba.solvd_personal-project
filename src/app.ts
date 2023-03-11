import http from "http";
const hostname = "localhost";
// const hostname = "127.0.0.1";

const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

server.listen(
  port,
  // hostname, // If I set the hostname, for some reason, docker won't work properly
  () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  }
);
