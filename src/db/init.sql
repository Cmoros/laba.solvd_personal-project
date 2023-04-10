
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
	"lineId" serial4 NOT NULL,
	"name" text NULL,
	CONSTRAINT "Line_pkey" PRIMARY KEY ("lineId")
);

/*********
 * TRAIN *
 *********/
CREATE TABLE IF NOT EXISTS "Train" (
	"trainId" serial4 NOT NULL,
	model text NULL,
	"totalCars" int2 NOT NULL,
	"capacityPerCar" int2 NOT NULL,
	"lineId" int4 NOT NULL,
	CONSTRAINT train_pkey PRIMARY KEY ("trainId"),
	CONSTRAINT train_line FOREIGN KEY ("lineId") REFERENCES "Line"("lineId")
);

/***********
 * STATION *
 ***********/
CREATE TABLE IF NOT EXISTS "Station" (
	"stationId" serial4 NOT NULL,
	"name" text NOT NULL,
	"location" text NULL,
	"lineId" int4 NOT NULL,
	"number" int2 NOT NULL,
	capacity int2 NULL,
	CONSTRAINT "Station_pkey" PRIMARY KEY ("stationId"),
	CONSTRAINT "Station_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId")
);


/************
 * SCHEDULE *
 ************/
CREATE TABLE IF NOT EXISTS "Schedule" (
	"scheduleId" serial4 NOT NULL,
	"startTime" timetz NOT NULL,
	"endTime" timetz NOT NULL,
	"startStationId" int4 NULL,
	"endStationId" int4 NULL,
	CONSTRAINT "Schedule_pkey" PRIMARY KEY ("scheduleId"),
	CONSTRAINT "Schedule_endStationId_fkey" FOREIGN KEY ("endStationId") REFERENCES "Station"("stationId"),
	CONSTRAINT "Schedule_startStationId_fkey" FOREIGN KEY ("startStationId") REFERENCES "Station"("stationId")
);


/************
 * EMPLOYEE *
 ************/
CREATE TABLE IF NOT EXISTS "Employee" (
	"employeeId" serial4 NOT NULL,
	"name" text NOT NULL,
	"position" text NULL,
	CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeId")
);


/*********
 * CYCLE *
 *********/
CREATE TABLE IF NOT EXISTS "Cycle" (
	"cycleId" serial4 NOT NULL,
	"lineId" int4 NOT NULL,
	"trainId" int4 NOT NULL,
	"totalFlow" int4 NOT NULL,
	"driverId" int4 NOT NULL,
	"scheduleId" int4 NOT NULL,
	CONSTRAINT "Cycle_pkey" PRIMARY KEY ("cycleId"),
	CONSTRAINT "Cycle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Employee"("employeeId"),
	CONSTRAINT "Cycle_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId"),
	CONSTRAINT "Cycle_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("scheduleId"),
	CONSTRAINT "Cycle_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("trainId")
);


/*****************
 * ROUTE SEGMENT *
 *****************/
CREATE TABLE IF NOT EXISTS "RouteSegment" (
	"routeSegmentId" serial4 NOT NULL,
	"peopleFlow" int2 NOT NULL,
	"cycleId" int4 NOT NULL,
	"scheduleId" int4 NOT NULL,
	CONSTRAINT "RouteSegment_pkey" PRIMARY KEY ("routeSegmentId"),
	CONSTRAINT "RouteSegment_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("cycleId"),
	CONSTRAINT "RouteSegment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("scheduleId")
);


/*****************
 * USER *
 *****************/
CREATE TABLE IF NOT EXISTS "User" (
	"userId" serial4 NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NULL,
	"employeeId" int4 NOT NULL,
	CONSTRAINT "User_pkey" PRIMARY KEY ("userId"),
	CONSTRAINT "User_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId")
);

/*
CREATE TABLE [ IF NOT EXISTS ] [{schema}.]{table_name} ( --public
  ...column_name data_type ...
) TABLESPACE {tablespace}; --pg_default

ALTER TABLE IF EXISTS {schema}.{table_name} --public
    OWNER to {user}; --postgres
*/