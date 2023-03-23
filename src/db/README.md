# Data Modeling

## Table of Contents

- [Data Modeling](#data-modeling)
  - [Table of Contents](#table-of-contents)
  - [Purpose](#purpose)
  - [Technology](#technology)
  - [Entity Relationship Diagram](#entity-relationship-diagram)
  - [Entity Attributes and Constraints](#entity-attributes-and-constraints)
    - [Line](#line)
    - [Train](#train)
    - [Station](#station)
    - [Employee](#employee)
    - [Schedule](#schedule)
  - [Relationships](#relationships)

## Purpose

The purpose of the database is to store data for a metro app where users can read, create, update and delete schedules to check for departure/arrival times and stations. Also, can look for who the driver and the operator is and make changes if needed.

## Technology

This database has been created and maintained with [PostgreSQL](https://www.postgresql.org/)

## Entity Relationship Diagram

![data-modeling](laba.solvd_metro%20-%20public.png)

## Entity Attributes and Constraints

### Line

| Column Name | Data Type          | Constraints |
| ----------- | ------------------ | ----------- |
| id          | SERIAL PRIMARY KEY |             |
| name        | TEXT               |             |

### Train

| Column Name    | Data Type           | Constraints         |
| -------------- | ------------------- | ------------------- |
| id             | SERIAL PRIMARY KEY  |                     |
| model          | TEXT                |                     |
| totalCars      | SMALLINT NOT NULL   |                     |
| capacityPerCar | SMALLINT NOT NULL   |                     |
| lineId         | INTEGER PRIMARY KEY | REFERENCES Line(id) |

### Station

| Column Name | Data Type          | Constraints |
| ----------- | ------------------ | ----------- |
| id          | SERIAL PRIMARY KEY |             |
| name        | TEXT NOT NULL      |             |
| location    | TEXT               |             |

### Employee

| Column Name | Data Type          | Constraints |
| ----------- | ------------------ | ----------- |
| id          | SERIAL PRIMARY KEY |             |
| name        | TEXT NOT NULL      |             |
| position    | TEXT               |             |

### Schedule

| Column Name    | Data Type                         | Constraints             |
| -------------- | --------------------------------- | ----------------------- |
| id             | SERIAL PRIMARY KEY                |                         |
| trainId        | INTEGER NOT NULL                  | REFERENCES Train(id)    |
| startStationId | INTEGER NOT NULL                  | REFERENCES Station(id)  |
| endStationId   | INTEGER NOT NULL                  | REFERENCES Station(id)  |
| departureTime  | TIMESTAMP WITH TIME ZONE NOT NULL |                         |
| arrivalTime    | TIMESTAMP WITH TIME ZONE NOT NULL |                         |
| driverId       | INTEGER NOT NULL                  | REFERENCES Employee(id) |
| operatorId     | INTEGER NOT NULL                  | REFERENCES Employee(id) |

## Relationships

The relationships between the tables are as follows:

- Stations can have multiple Schedules associated with them (one-to-many) at `Schedule(startStationId)` and `Schedule(endStationId)`.
- Lines can have multiple Trains associated with them (one-to-many) at `Train(lineId)`.
- Trains can have multiple Schedules associated with them (one-to-many) at `Schedule(trainId)`.
- Employees can have multiple Schedules associated with them (one-to-many) at `Schedule(driverId)` and `Schedule(operatorId)`.
