
/*******************
 * CREATE DATABASE *
 *******************/
CREATE DATABASE "laba.solvd_metro";

--------------------------------------------------------------------------

/***********************
 * CONNECT TO DATABASE *
 ***********************/
\c "laba.solvd_metro"

--------------------------------------------------------------------------

/*****************
 * CREATE TABLES *
 *****************/

/********
 * LINE *
 ********/
CREATE TABLE IF NOT EXISTS "Line" (
	id serial4 NOT NULL,
	"name" text NULL,
	CONSTRAINT "Line_pkey" PRIMARY KEY (id)
);

/*********
 * TRAIN *
 *********/
CREATE TABLE IF NOT EXISTS "Train" (
	id serial4 NOT NULL,
	model text NULL,
	"totalCars" int2 NOT NULL,
	"capacityPerCar" int2 NOT NULL,
	"lineId" int4 NOT NULL,
	CONSTRAINT train_pkey PRIMARY KEY (id),
	CONSTRAINT train_line FOREIGN KEY ("lineId") REFERENCES "Line"(id)
);

/***********
 * STATION *
 ***********/
CREATE TABLE IF NOT EXISTS "Station" (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	"location" text NULL,
	"lineId" int4 NOT NULL,
	"number" int2 NOT NULL,
	capacity int2 NULL,
	CONSTRAINT "Station_pkey" PRIMARY KEY (id),
	CONSTRAINT "Station_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"(id)
);


/************
 * SCHEDULE *
 ************/
CREATE TABLE IF NOT EXISTS "Schedule" (
	id serial4 NOT NULL,
	"startTime" timetz NOT NULL,
	"endTime" timetz NOT NULL,
	"startStationId" int4 NULL,
	"endStationId" int4 NULL,
	CONSTRAINT "Schedule_pkey" PRIMARY KEY (id),
	CONSTRAINT "Schedule_endStationId_fkey" FOREIGN KEY ("endStationId") REFERENCES "Station"(id),
	CONSTRAINT "Schedule_startStationId_fkey" FOREIGN KEY ("startStationId") REFERENCES "Station"(id)
);


/************
 * EMPLOYEE *
 ************/
CREATE TABLE IF NOT EXISTS "Employee" (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	"position" text NULL,
	CONSTRAINT "Employee_pkey" PRIMARY KEY (id)
);


/*********
 * CYCLE *
 *********/
CREATE TABLE IF NOT EXISTS "Cycle" (
	id serial4 NOT NULL,
	"lineId" int4 NOT NULL,
	"trainId" int4 NOT NULL,
	"totalFlow" int4 NOT NULL,
	"driverId" int4 NOT NULL,
	"scheduleId" int4 NOT NULL,
	CONSTRAINT "Cycle_pkey" PRIMARY KEY (id),
	CONSTRAINT "Cycle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Employee"(id),
	CONSTRAINT "Cycle_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"(id),
	CONSTRAINT "Cycle_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"(id),
	CONSTRAINT "Cycle_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"(id)
);


/*****************
 * ROUTE SEGMENT *
 *****************/
CREATE TABLE IF NOT EXISTS "RouteSegment" (
	id serial4 NOT NULL,
	"peopleFlow" int2 NOT NULL,
	"cycleId" int4 NOT NULL,
	"scheduleId" int4 NOT NULL,
	CONSTRAINT "RouteSegment_pkey" PRIMARY KEY (id),
	CONSTRAINT "RouteSegment_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"(id),
	CONSTRAINT "RouteSegment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"(id)
);


/*
CREATE TABLE [ IF NOT EXISTS ] [{schema}.]{table_name} ( --public
  ...column_name data_type ...
) TABLESPACE {tablespace}; --pg_default

ALTER TABLE IF EXISTS {schema}.{table_name} --public
    OWNER to {user}; --postgres
*/