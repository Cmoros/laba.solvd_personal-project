# Laba Personal Project

### Laba.Solvd Nodejs Course

## Table of contents

- [Laba Personal Project](#laba-personal-project)
  - [Laba.Solvd Nodejs Course](#labasolvd-nodejs-course)
  - [Table of contents](#table-of-contents)
  - [About](#about)
  - [Assignment](#assignment)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
  - [Usage](#usage)
    - [Using Docker](#using-docker)
    - [Using `npm start`](#using-npm-start)
- [Metro API Documentation](#metro-api-documentation)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
  - [Endpoints](#endpoints)
    - [General Responses](#general-responses)
      - [Record found/updated](#record-foundupdated)
      - [Requesting many records](#requesting-many-records)
      - [Record created](#record-created)
      - [Record deleted](#record-deleted)
      - [Record not found](#record-not-found)
      - [Record with invalid data](#record-with-invalid-data)
    - [Overview](#overview)
    - [Employees](#employees)
      - [`GET /employees`](#get-employees)
        - [Query Parameters](#query-parameters)
        - [Response](#response)
      - [`GET /employees/:id`](#get-employeesid)
        - [Query Parameters](#query-parameters-1)
        - [Response](#response-1)
      - [`POST /employees`](#post-employees)
        - [Request Body](#request-body)
        - [Response](#response-2)
      - [`PUT /employees/:id`](#put-employeesid)
        - [Query Parameters](#query-parameters-2)
        - [Request Body](#request-body-1)
        - [Response](#response-3)
      - [`PATCH /employees/:id`](#patch-employeesid)
        - [Query Parameters](#query-parameters-3)
        - [Request Body](#request-body-2)
        - [Response](#response-4)
      - [`DELETE /employees/:id`](#delete-employeesid)
        - [Query Parameters](#query-parameters-4)
        - [Response](#response-5)
    - [Trains](#trains)
      - [`GET /trains`](#get-trains)
        - [Query Parameters](#query-parameters-5)
        - [Response](#response-6)
      - [`GET /trains/:id`](#get-trainsid)
        - [Query Parameters](#query-parameters-6)
        - [Response](#response-7)
      - [`POST /trains`](#post-trains)
        - [Request Body](#request-body-3)
        - [Response](#response-8)
      - [`PUT /trains/:id`](#put-trainsid)
        - [Query Parameters](#query-parameters-7)
        - [Request Body](#request-body-4)
        - [Response](#response-9)
      - [`PATCH /trains/:id`](#patch-trainsid)
        - [Query Parameters](#query-parameters-8)
        - [Request Body](#request-body-5)
        - [Response](#response-10)
      - [`DELETE /trains/:id`](#delete-trainsid)
        - [Query Parameters](#query-parameters-9)
        - [Response](#response-11)
    - [Schedules](#schedules)
      - [`GET /schedules`](#get-schedules)
        - [Query Parameters](#query-parameters-10)
        - [Response](#response-12)
      - [`GET /schedules/:id`](#get-schedulesid)
        - [Query Parameters](#query-parameters-11)
        - [Response](#response-13)
      - [`POST /schedules`](#post-schedules)
        - [Request Body](#request-body-6)
        - [Response](#response-14)
      - [`PUT /schedules/:id`](#put-schedulesid)
        - [Query Parameters](#query-parameters-12)
        - [Request Body](#request-body-7)
        - [Response](#response-15)
      - [`PATCH /schedules/:id`](#patch-schedulesid)
        - [Query Parameters](#query-parameters-13)
        - [Request Body](#request-body-8)
        - [Response](#response-16)
      - [`DELETE /schedules/:id`](#delete-schedulesid)
        - [Query Parameters](#query-parameters-14)
        - [Response](#response-17)

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

# Metro API Documentation

This API provides information about employees, trains, schedules and stations for a metro system.

## Base URL

`http://localhost:3000`

## Authentication

This API does not require authentication.

## Endpoints

### General Responses

#### Record found/updated

Verbs applied: `GET`, `PUT`, `PATCH`

Status Code: 200

```
{
  "success": true,
  "data": {
    // ... Record info
  }
}
```

#### Requesting many records

Verbs applied: `GET`

Status Code: 200 - OK

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

Verbs applied: `POST`

Status Code: 200

```
{
  "success": true,
  "data": {
    // ... New Record
  }
}
```

#### Record deleted

Verbs applied: `DELETE`

Status Code: 204

Response with no body

#### Record not found

Verbs applied: `GET`, `PUT`, `PATCH`, `DELETE`

Status Code: 404 - Not Found

```
{
  "success": false,
  "error": "..." // What record with what id was not found
}
```

#### Record with invalid data

Verbs applied: `POST`, `PUT`, `PATCH`

Status Code: 400 - Bad Request

```
{
  "success": false,
  "error": "..." // Reason the request failed
}
```

### Overview

- Employees

  - [`GET /employees`](#get-employees)
  - [`GET /employees/:id`](#get-employeesid)
  - [`POST /employees`](#post-employees)
  - [`PUT /employees/:id`](#put-employeesid)
  - [`PATCH /employees/:id`](#patch-employeesid)
  - [`DELETE /employees/:id`](#delete-employeesid)

- Trains

  - [`GET /trains`](#get-trains)
  - [`GET /trains/:id`](#get-trainsid)
  - [`POST /trains`](#post-trains)
  - [`PUT /trains/:id`](#put-trainsid)
  - [`PATCH /trains/:id`](#patch-trainsid)
  - [`DELETE /trains/:id`](#delete-trainsid)

- Schedules

  - [`GET /schedules`](#get-schedules)
  - [`GET /schedules/:id`](#get-schedulesid)
  - [`POST /schedules`](#post-schedules)
  - [`PUT /schedules/:id`](#put-schedulesid)
  - [`PATCH /schedules/:id`](#patch-schedulesid)
  - [`DELETE /schedules/:id`](#delete-schedulesid)

---

### Employees

#### `GET /employees`

Retrieves a list of all employees.

##### Query Parameters

None

##### Response

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

##### Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | number | Yes      | The employee ID. |

##### Response

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

##### Request Body

```
{
  "name": "Bobby Jhonson",
  "position": "Train Operator",
}
```

##### Response

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

##### Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | number | Yes      | The employee ID. |

##### Request Body

```
{
  "name": "Bob Johnson",
  "position": "Cleaning Staff",
}
```

##### Response

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

##### Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | number | Yes      | The employee ID. |

##### Request Body

```
{
  "position": "Train Conductor",
}
```

##### Response

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

##### Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | number | Yes      | The employee ID. |

##### Response

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

[⬆ Go To Overview ⬆](#overview) ----|---- [⬆ Go To Employees ⬆](#employees)

---

### Trains

#### `GET /trains`

Retrieves a list of all trains.

##### Query Parameters

None

##### Response

```
{
   "success": true,
   "data": [
    {
      "id": 1,
      "model": "Commuter Express",
      "totalCars": 6,
      "capacityPerCar": 50,
      "status": "active",
      "scheduleId": 1,
      "conductorId": 1
    },
    {
      "id": 2,
      "model": "Commuter Express",
      "totalCars": 6,
      "capacityPerCar": 50,
      "status": "delayed",
      "scheduleId": 2,
      "conductorId": 4
    }
  ]
}

```

#### `GET /trains/:id`

Retrieves a specific train by ID.

##### Query Parameters

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| `id`      | number | Yes      | The train ID. |

##### Response

```
{
  "success": true,
  "data": {
    "id": 1,
    "model": "Commuter Express",
    "totalCars": 6,
    "capacityPerCar": 50,
    "status": "active",
    "scheduleId": 1,
    "conductorId": 1
  }
}
```

#### `POST /trains`

Creates a new train.

##### Request Body

```
{
  "model": "Commuter Express",
  "totalCars": 6,
  "capacityPerCar": 50,
  "status": "active",
  "scheduleId": 3,
  "conductorId": 3
}
```

##### Response

```
{
  "success": true,
  "data": {
    "id": 3,
    "model": "Commuter Express",
    "totalCars": 6,
    "capacityPerCar": 50,
    "status": "active",
    "scheduleId": 3,
    "conductorId": 3
  }
}
```

#### `PUT /trains/:id`

Replace a specific train by ID.

##### Query Parameters

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| `id`      | number | Yes      | The train ID. |

##### Request Body

```
{
  "model": "Commuter Express",
  "totalCars": 6,
  "capacityPerCar": 60,
  "status": "active",
  "scheduleId": 4,
  "conductorId": 4
}
```

##### Response

```
{
  "success": true,
  "data": {
    "id": 1,
    "model": "Commuter Express",
    "totalCars": 6,
    "capacityPerCar": 60,
    "status": "active",
    "scheduleId": 4,
    "conductorId": 4
  }
}
```

#### `PATCH /trains/:id`

Update one or more fields of an train by ID.

##### Query Parameters

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| `id`      | number | Yes      | The train ID. |

##### Request Body

```
{
  "status": "out of service"
}
```

##### Response

```
{
  "success": true,
  "data": {
    "id": 1,
    "model": "Commuter Express",
    "totalCars": 6,
    "capacityPerCar": 50,
    "status": "out of service",
    "scheduleId": 1,
    "conductorId": 1
  }
}
```

#### `DELETE /trains/:id`

Deletes an trains by ID.

##### Query Parameters

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| `id`      | number | Yes      | The train ID. |

##### Response

```
{
  "success": true,
  "data": {
    "id": 1,
    "model": "Commuter Express",
    "totalCars": 6,
    "capacityPerCar": 50,
    "status": "active",
    "scheduleId": 1,
    "conductorId": 1
  }
}
```

[⬆ Go To Overview ⬆](#overview) ----|---- [⬆ Go To Train ⬆](#trains)

---

### Schedules

#### `GET /schedules`

Returns the schedule of trains for the day.

##### Query Parameters

None

##### Response

```
{
  "success": true,
  "data": [
    {
      "id": 1,
      "departureStation": "North Station",
      "arrivalStation": "South Station",
      "departureTime": "07:00 AM",
      "arrivalTime": "07:30 AM"
    },
    {
      "id": 2,
      "departureStation": "East Station",
      "arrivalStation": "West Station",
      "departureTime": "08:00 AM",
      "arrivalTime": "08:30 AM"
    },
    {
      "id": 3,
      "departureStation": "Central Station",
      "arrivalStation": "Main Station",
      "departureTime": "09:00 AM",
      "arrivalTime": "09:30 AM"
    }
  ]
}

```

#### `GET /schedules/:id`

Retrieves a specific schedule by ID.

##### Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | number | Yes      | The schedule ID. |

##### Response

```
{
  "success": true,
  "data": {
    "id": 1,
    "departureStation": "North Station",
    "arrivalStation": "South Station",
    "departureTime": "07:00 AM",
    "arrivalTime": "07:30 AM"
  }
}
```

#### `POST /schedules`

Creates a new schedule.

##### Request Body

```
{
  "departureStation": "City Station",
  "arrivalStation": "Metro Station",
  "departureTime": "09:30 AM",
  "arrivalTime": "10:00 AM"
}
```

##### Response

```
{
  "success": true,
  "data": {
    "id": 4,
    "departureStation": "City Station",
    "arrivalStation": "Metro Station",
    "departureTime": "09:30 AM",
    "arrivalTime": "10:00 AM"
  }
}
```

#### `PUT /schedules/:id`

Replace a specific schedule by ID.

##### Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | number | Yes      | The schedule ID. |

##### Request Body

```
{
  "departureStation": "City Station",
  "arrivalStation": "Metro Station",
  "departureTime": "09:30 AM",
  "arrivalTime": "10:00 AM"
}
```

##### Response

```
{
  "success": true,
  "data": {
    "id": 1,
    "departureStation": "City Station",
    "arrivalStation": "Metro Station",
    "departureTime": "09:30 AM",
    "arrivalTime": "10:00 AM"
  }
}
```

#### `PATCH /schedules/:id`

Update one or more fields of a schedule record by ID.

##### Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | number | Yes      | The schedule ID. |

##### Request Body

```
{
  "departureStation": "Terminal Station",
  "arrivalStation": "Union Station",
}
```

##### Response

```
{
  "success": true,
  "data": {
    "id": 1,
    "departureStation": "Terminal Station",
    "arrivalStation": "Union Station",
    "departureTime": "07:00 AM",
    "arrivalTime": "07:30 AM"
  }
}
```

#### `DELETE /schedules/:id`

Deletes a schedule record by ID.

##### Query Parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | number | Yes      | The schedule ID. |

##### Response

```
{
  "success": true,
  "data": {
    "id": 1,
    "departureStation": "North Station",
    "arrivalStation": "South Station",
    "departureTime": "07:00 AM",
    "arrivalTime": "07:30 AM"
  }
}
```

[⬆ Go To Overview ⬆](#overview) ----|---- [⬆ Go To Schedule ⬆](#schedules)

[⬆ Go To Top ⬆](#table-of-contents)
