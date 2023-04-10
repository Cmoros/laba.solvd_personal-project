# Laba Personal Project

Laba.Solvd Nodejs Course

## Table of contents

- [Laba Personal Project](#laba-personal-project)
  - [Table of contents](#table-of-contents)
  - [About](#about)
  - [Assignment](#assignment)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
  - [Usage](#usage)
    - [Using Docker](#using-docker)
    - [Using `npm start`](#using-npm-start)
- [Data Modeling](#data-modeling)
- [Metro API Documentation](#metro-api-documentation)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
    - [Obtaining JWT Tokens](#obtaining-jwt-tokens)
    - [Using JWT Tokens](#using-jwt-tokens)
    - [Registering a New User](#registering-a-new-user)
  - [Endpoints](#endpoints)
    - [General Responses](#general-responses)
      - [Record found/updated](#record-foundupdated)
      - [Requesting many records](#requesting-many-records)
      - [Record created](#record-created)
      - [Record deleted](#record-deleted)
      - [Record not found](#record-not-found)
      - [Record with invalid data](#record-with-invalid-data)
    - [Employees](#employees)
      - [`GET /employees`](#get-employees)
      - [`GET /employees/:id`](#get-employeesid)
      - [`POST /employees`](#post-employees)
      - [`PUT /employees/:id`](#put-employeesid)
      - [`PATCH /employees/:id`](#patch-employeesid)
      - [`DELETE /employees/:id`](#delete-employeesid)
    - [Trains](#trains)
      - [`GET /trains`](#get-trains)
      - [`GET /trains/:id`](#get-trainsid)
      - [`POST /trains`](#post-trains)
      - [`PUT /trains/:id`](#put-trainsid)
      - [`PATCH /trains/:id`](#patch-trainsid)
      - [`DELETE /trains/:id`](#delete-trainsid)
    - [Schedules](#schedules)
      - [`GET /schedules`](#get-schedules)
      - [`GET /schedules/:id`](#get-schedulesid)
      - [`POST /schedules`](#post-schedules)
      - [`PUT /schedules/:id`](#put-schedulesid)
      - [`PATCH /schedules/:id`](#patch-schedulesid)
      - [`DELETE /schedules/:id`](#delete-schedulesid)
  - [Testing](#testing)
    - [Unit Tests](#unit-tests)

## About

## Assignment

Create a Docker container running a simple Node.js server with a single route that returns the topic selected.

The server should only be accessible from within the container and not from outside.

## Getting Started

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

# Data Modeling

![data-modeling](src/db/laba.solvd_metro%20-%20public.png)

[Here you can read more](src/db/README.md)

# Metro API Documentation

This API provides information about employees, trains, schedules and stations for a metro system.

## Base URL

`http://localhost:3000`

## Authentication

This API uses JWT Tokens for authentication.

### Obtaining JWT Tokens

To access protected endpoints, you need to obtain a JWT token by sending a POST request to the `/login` endpoint with your username and password in the request body. If the credentials are valid, the server will return a JWT token in the response.

```
POST /login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

The response will look like this:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success" true,
  "data" {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}
```

### Using JWT Tokens

Once you have obtained a JWT token, you need to include it in the Authorization header of your requests to protected endpoints. The token should be preceded by the word "Bearer".

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0N
```

### Registering a New User

To register a new user, you can send a POST request to the `/register` endpoint with a username and password in the request body.

```
POST /register
Content-Type: application/json

{
  "username": "new_username",
  "password": "new_password"
}
```

The server will respond with a status code of 201 Created if the user was successfully registered, including token in the response body.

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}

```

## Endpoints

### General Responses

#### Record found/updated

- Verbs applied: `GET`, `PUT`, `PATCH`

- Status Code: 200

- Response

  ```
  {
    "success": true,
    "data": {
      // ... Record info
    }
  }
  ```

#### Requesting many records

- Verbs applied: `GET`

- Status Code: 200 - OK

- Response

  ```
  {
    "success": false,
    "data": [
      {
        // Record 1
      },
      {
        // Record 2
      }
      // ...
    ]
  }
  ```

#### Record created

- Verbs applied: `POST`

- Status Code: 200

- Response

  ```
  {
    "success": true,
    "data": {
      // ... New Record
    }
  }
  ```

#### Record deleted

- Verbs applied: `DELETE`

- Status Code: 204

- Response with no body

#### Record not found

- Verbs applied: `GET`, `PUT`, `PATCH`, `DELETE`

- Status Code: 404 - Not Found

- Response

  ```
  {
    "success": false,
    "error": "..." // What record with what id was not found
  }
  ```

#### Record with invalid data

- Verbs applied: `POST`, `PUT`, `PATCH`

- Status Code: 400 - Bad Request

- Response

  ```
  {
    "success": false,
    "error": "..." // Reason the request failed
  }
  ```

---

### Employees

#### `GET /employees`

Retrieves a list of all employees. Query params can be added for searching employees that match the given params.

- Query Parameters

  | Parameter  | Type   | Required | Description                 |
  | ---------- | ------ | -------- | --------------------------- |
  | `name`     | string | No       | Filter employee by name     |
  | `position` | string | No       | Filter employee by position |

- Response

  ```
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "John Doe",
        "position": "Train Conductor"
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "position": "Station Agent"
      }
    ]
  }
  ```

#### `GET /employees/:id`

Retrieves a specific employee by ID.

- Route Parameters

  | Parameter    | Type   | Required | Description      |
  | ------------ | ------ | -------- | ---------------- |
  | `employeeId` | number | Yes      | The employee ID. |

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "John Doe",
      "position": "Train Conductor"
    }
  }
  ```

#### `POST /employees`

Creates a new employee.

- Request Body

  ```
  {
    "name": "Bobby Jhonson",
    "position": "Train Operator",
  }
  ```

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 3,
      "name": "Bobby Jhonson",
      "position": "Train Operator"
    }
  }
  ```

#### `PUT /employees/:id`

Replace a specific employee by ID.

- Route Parameters

  | Parameter    | Type   | Required | Description      |
  | ------------ | ------ | -------- | ---------------- |
  | `employeeId` | number | Yes      | The employee ID. |

- Request Body

  ```
  {
    "name": "Bob Johnson",
    "position": "Cleaning Staff",
  }
  ```

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 3,
      "name": "Bob Johnson",
      "position": "Cleaning Staff"
    }
  }
  ```

#### `PATCH /employees/:id`

Update one or more fields of an employee by ID.

- Route Parameters

  | Parameter    | Type   | Required | Description      |
  | ------------ | ------ | -------- | ---------------- |
  | `employeeId` | number | Yes      | The employee ID. |

- Request Body

  ```
  {
    "position": "Train Conductor",
  }
  ```

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 3,
      "name": "Bob Johnson",
      "position": "Train Conductor"
    }
  }
  ```

#### `DELETE /employees/:id`

Deletes an employee by ID.

- Route Parameters

  | Parameter    | Type   | Required | Description      |
  | ------------ | ------ | -------- | ---------------- |
  | `employeeId` | number | Yes      | The employee ID. |

- Response

  No Body

[⬆ Go To Table of contents ⬆](#table-of-contents) ----|---- [⬆ Go To Employees ⬆](#employees)

---

### Trains

#### `GET /trains`

Retrieves a list of all trains. Query params can be added for searching trains that match the given params.

- Query Parameters

  | Parameter        | Type   | Required | Description                                       |
  | ---------------- | ------ | -------- | ------------------------------------------------- |
  | `model`          | string | No       | The model type of the train .                     |
  | `totalCars`      | number | No       | Total number of cars in the train.                |
  | `capacityPerCar` | number | No       | Maximum quantity of people that fits in each car. |
  | `lineId`         | number | No       | The Id of the Line.                               |

- Response

  ```
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "model": "Commuter Express",
        "totalCars": 6,
        "capacityPerCar": 50,
        "lineId": 1,
      },
      {
        "id": 2,
        "model": "Commuter Express",
        "totalCars": 6,
        "capacityPerCar": 50,
        "lineId": 4
      }
    ]
  }
  ```

#### `GET /trains/:id`

Retrieves a specific train by ID.

- Route Parameters

  | Parameter | Type   | Required | Description   |
  | --------- | ------ | -------- | ------------- |
  | `trainId` | number | Yes      | The train ID. |

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 1,
      "model": "Commuter Express",
      "totalCars": 6,
      "capacityPerCar": 50,
      "lineId": 1,
    }
  }
  ```

#### `POST /trains`

Creates a new train.

- Request Body

  ```
  {
    "model": "Commuter Express",
    "totalCars": 6,
    "capacityPerCar": 50,
    "lineId": 3
  }
  ```

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 3,
      "model": "Commuter Express",
      "totalCars": 6,
      "capacityPerCar": 50,
      "lineId": 3
    }
  }
  ```

#### `PUT /trains/:id`

Replace a specific train by ID.

- Route Parameters

  | Parameter | Type   | Required | Description   |
  | --------- | ------ | -------- | ------------- |
  | `trainId` | number | Yes      | The train ID. |

- Request Body

  ```
  {
    "model": "Commuter Express",
    "totalCars": 6,
    "capacityPerCar": 60,
    "lineId": 4
  }
  ```

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 1,
      "model": "Commuter Express",
      "totalCars": 6,
      "capacityPerCar": 60,
      "lineId": 4
    }
  }
  ```

#### `PATCH /trains/:id`

Update one or more fields of an train by ID.

- Route Parameters

  | Parameter | Type   | Required | Description   |
  | --------- | ------ | -------- | ------------- |
  | `trainId` | number | Yes      | The train ID. |

- Request Body

  ```
  {
    "lineId": 6
  }
  ```

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 1,
      "model": "Commuter Express",
      "totalCars": 6,
      "capacityPerCar": 50,
      "lineId": 6
    }
  }
  ```

#### `DELETE /trains/:id`

Deletes an trains by ID.

- Route Parameters

  | Parameter | Type   | Required | Description   |
  | --------- | ------ | -------- | ------------- |
  | `trainId` | number | Yes      | The train ID. |

- Response

  No Body

[⬆ Go To Table of contents ⬆](#table-of-contents) ----|---- [⬆ Go To Train ⬆](#trains)

---

### Schedules

#### `GET /schedules`

Returns the schedule of trains for the day.

- Query Parameters

  | Parameter        | Type   | Required | Description                                               |
  | ---------------- | ------ | -------- | --------------------------------------------------------- |
  | `startTime`      | string | No       | The departure time of the schedule in the format HH:mm a. |
  | `endTime`        | string | No       | The arrival time of the schedule in the format HH:mm a.   |
  | `startStationId` | number | No       | The departure station of the schedule.                    |
  | `endStationId`   | number | No       | The arrival station of the schedule.                      |

- Response

  ```
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "startStationId": 1,
        "endStationId": 2,
        "startTime": "07:00 AM",
        "endTime": "07:30 AM"
      },
      {
        "id": 2,
        "startStationId": 2,
        "endStationId": 3,
        "startTime": "08:00 AM",
        "endTime": "08:30 AM"
      },
      {
        "id": 3,
        "startStationId": 3,
        "endStationId": 4,
        "startTime": "09:00 AM",
        "endTime": "09:30 AM"
      }
    ]
  }
  ```

#### `GET /schedules/:id`

Retrieves a specific schedule by ID.

- Route Parameters

  | Parameter    | Type   | Required | Description      |
  | ------------ | ------ | -------- | ---------------- |
  | `scheduleId` | number | Yes      | The schedule ID. |

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 1,
      "startStationId": 1,
      "endStationId": 2,
      "startTime": "07:00 AM",
      "endTime": "07:30 AM"
    }
  }
  ```

#### `POST /schedules`

Creates a new schedule.

- Request Body

  ```
  {
    "startStationId": 3,
    "endStationId": 4,
    "startTime": "09:30 AM",
    "endTime": "10:00 AM"
  }
  ```

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 4,
      "startStationId": 3,
      "endStationId": 4,
      "startTime": "09:30 AM",
      "endTime": "10:00 AM"
    }
  }
  ```

#### `PUT /schedules/:id`

Replace a specific schedule by ID.

- Route Parameters

  | Parameter    | Type   | Required | Description      |
  | ------------ | ------ | -------- | ---------------- |
  | `scheduleId` | number | Yes      | The schedule ID. |

- Request Body

  ```
  {
    "startStationId": 3,
    "endStationId": 4,
    "startTime": "09:30 AM",
    "endTime": "10:00 AM"
  }
  ```

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 1,
      "startStationId": 3,
      "endStationId": 4,
      "startTime": "09:30 AM",
      "endTime": "10:00 AM"
    }
  }
  ```

#### `PATCH /schedules/:id`

Update one or more fields of a schedule record by ID.

- Route Parameters

  | Parameter    | Type   | Required | Description      |
  | ------------ | ------ | -------- | ---------------- |
  | `scheduleId` | number | Yes      | The schedule ID. |

- Request Body

  ```
  {
    "startTime": "07:00 AM",
    "endTime": "07:30 AM"
  }
  ```

- Response

  ```
  {
    "success": true,
    "data": {
      "id": 1,
      "startStationId": 3,
      "endStationId": 4,
      "startTime": "07:00 AM",
      "endTime": "07:30 AM"
    }
  }
  ```

#### `DELETE /schedules/:id`

Deletes a schedule record by ID.

- Route Parameters

  | Parameter    | Type   | Required | Description      |
  | ------------ | ------ | -------- | ---------------- |
  | `scheduleId` | number | Yes      | The schedule ID. |

- Response

  No Body

[⬆ Go To Table of contents ⬆](#table-of-contents) ----|---- [⬆ Go To Schedule ⬆](#schedules)

## Testing

### Unit Tests

Unit tests are located in the `__tests__` directory. To run the unit tests, run the following command:

```bash
$ npm test
```

At the moment, tests that makes requests to the Postgres database may fail if different suites are ran simultaneously (like `standard.controller.test.ts` and `standard.model.test.ts`). This is because the tests interact with the same table and they add/update/delete rows that may compromise the other tests. By default (with `npm test`) are run with `--runInBand` flag. Also, they're ran with `--coverage` flag.
