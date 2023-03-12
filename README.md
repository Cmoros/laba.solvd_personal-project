# Laba Personal Project

### Laba.Solvd Nodejs Course

## About

---

## Assignment

Create a Docker container running a simple Node.js server with a single route that returns the topic selected.

The server should only be accessible from within the container and not from outside.

## Getting Started

---

### Prerequisites

```sh
npm install npm@latest -g
```

## Usage

To run the application, you can either use npm start or run the application inside a Docker container.
Before you start, make sure you have Docker installed on your machine and running.

### Using Docker

1. Build the Docker image with `npm run docker:build`
2. Run the Docker container with `npm run docker:run`. To run it in the background, run `npm run docker:run:d` instead.
3. Access the server at http://localhost:3000 (from inside the container).
   - By using curl to get response from inside server: `npm run docker:curl`
   - By attaching to the already running container: `npm run docker:attach`

If you want to expose the server to the outside world, you can use the `npm run docker:run:exposed` command instead of docker:run.

Note that in this case, you need to modify `app.ts` to listen on `0.0.0.0` instead of `localhost`, or delete the hostname line at `server.listen()`. Also, you need to uncomment line in `Dockerfile` : "`# EXPOSE 3000`".

All of these before `npm run docker:build` is ran. Then you can go http://localhost:3000 from host to see respond from server or `npm run docker:curl` to see respond from container.

Additionally, you can use `docker:run:exposed:it` to run the container with an interactive terminal.

### Using `npm start`

1. Install dependencies with `npm install`
2. Run the application with `npm start`
3. Access the server at http://localhost:3000
