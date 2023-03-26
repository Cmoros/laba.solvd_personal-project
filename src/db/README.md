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
    - [Cycle](#cycle)
    - [RouteRegment](#routeregment)
  - [Relationships](#relationships)

## Purpose

The purpose of the database is to store data for a metro app where users can read, create, update and delete schedules to check for departure/arrival times and stations. Also, can look for people flow at any given time at any cycle or route segment, to facilitate interval calculations between trains given all the parameters.

## Technology

This database has been created and maintained with [PostgreSQL](https://www.postgresql.org/)

## Entity Relationship Diagram

![data-modeling](laba.solvd_metro%20-%20public.png)

## Entity Attributes and Constraints

The following tables are ordered in the same way they can be created to satisfy any dependency or foreign key.

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

| Column Name | Data Type          | Constraints         |
| ----------- | ------------------ | ------------------- |
| id          | SERIAL PRIMARY KEY |                     |
| name        | TEXT NOT NULL      |                     |
| location    | TEXT               |                     |
| lineId      | INTEGER NOT NULL   | REFERENCES Line(id) |
| number      | SMALLINT NOT NULL  |                     |
| capacity    | SMALLINT           |                     |

### Employee

| Column Name | Data Type          | Constraints |
| ----------- | ------------------ | ----------- |
| id          | SERIAL PRIMARY KEY |             |
| name        | TEXT NOT NULL      |             |
| position    | TEXT               |             |

### Schedule

| Column Name    | Data Type                         | Constraints            |
| -------------- | --------------------------------- | ---------------------- |
| id             | SERIAL PRIMARY KEY                |                        |
| startTime      | TIMESTAMP WITH TIME ZONE NOT NULL |                        |
| endTime        | TIMESTAMP WITH TIME ZONE NOT NULL |                        |
| startStationId | INTEGER NOT NULL                  | REFERENCES Station(id) |
| endStationId   | INTEGER NOT NULL                  | REFERENCES Station(id) |

### Cycle

Journey between the first `Station` of the `Line` to the last.

| Column Name | Data Type           | Constraints             |
| ----------- | ------------------- | ----------------------- |
| id          | SERIAL PRIMARY KEY  |                         |
| lineId      | INTEGER PRIMARY KEY | REFERENCES Line(id)     |
| trainId     | INTEGER PRIMARY KEY | REFERENCES Train(id)    |
| totalFlow   | INTEGER NOT NULL    |                         |
| driverId    | INTEGER NOT NULL    | REFERENCES Employee(id) |
| scheduleId  | INTEGER NOT NULL    | REFERENCES Schedule(id) |

### RouteRegment

Journey between two contiguous `Station`s of the same `Line` while traveling in the same `Cycle`.

| Column Name | Data Type          | Constraints             |
| ----------- | ------------------ | ----------------------- |
| id          | SERIAL PRIMARY KEY |                         |
| peopleFlow  | INTEGER NOT NULL   |                         |
| cycleId     | INTEGER NOT NULL   | REFERENCES Cycle(id)    |
| scheduleId  | INTEGER NOT NULL   | REFERENCES Schedule(id) |

## Relationships

The relationships between the tables are as follows:

- `Line`s can have multiple `Train`s, `Station`s and `Cycle`s associated with them (one-to-many) at `Train(lineId)`, `Station(lineId)` and `Cycle(lineId)`, respectively. Line will be a complete set of `Station` that has available many `Train`s, based on this, `Cycle`s will be scheduled to complete it's whole run from first `Station` to the last.
- `Train`s can have multiple `Cycle`s associated with them(one-to-many) at `Cycle(trainId)` as during. `Cycle` will be completed by only 1 train at a time, while many `Train`s can be in different `Cycle`s of the day.
- `Employee`s can have multiples `Cycle`s associated with them(one-to-many) at `Cycle(driverId)`. Same case a `Train` and `Cycle`, there will be only 1 driver in a whole run of a `Cycle`.
- `Station`s can have multiples `Schedules` associated with them(one-to-many) at `Schedule(startStationId)` and `Schedule(endStationId)`. `Schedule`s will be the journey between 2 stations, but many `Station`s can be in different `Schedule`s of the day.
- `Schedule`s can have multiples `RouteSegment`s and `Cycle`s associated with them(one-to-many) at `RouteSegment(scheduleId)` and `Cycle(scheduleId)`. In this case, `Schedule(startStationId)` and `Schedule(endStationId)` will differ in each case, being in `RouteSegment` 2 contiguous `Station`s and in `Cycle`s 2 extremes of the `Line`.
- `Cycle`s can have multiples `RouteSegment`s associated with them(one-to-many). A `Cycle` will be composed of many pieces of `RouteSegment`s.
