/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { respondValidationError } from "../../src/middlewares/respondValidationError";
import ValidationError from "../../src/modules/ValidationError";

jest.mock("express-validator", () => ({
  validationResult: jest.fn((req: { body: { name?: string } }) => ({
    isEmpty() {
      return this.array().length === 0;
    },
    array() {
      return req?.body?.name !== undefined ? [] : [{ msg: "name is required" }];
    },
  })),
}));

describe(respondValidationError.name, () => {
  it("should be a middleware", () => {
    expect(respondValidationError).toBeInstanceOf(Function);
    expect(respondValidationError.length).toBe(3);
    expect(() =>
      respondValidationError({} as Request, {} as Response, () => {})
    ).not.toThrow();
  });

  it("should call next with a ValidationError if there are errors", () => {
    const req: any = {
      body: {},
    };
    const next = jest.fn((error: ValidationError) => {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.msg).toEqual(["name is required"]);
      return;
    });
    respondValidationError(
      req as Request,
      {} as Response,
      next as (err?: any) => void
    );
    expect(next).toHaveBeenCalledTimes(1);
  });
  it("should not call next with a ValidationError if there are no errors", () => {
    const req: any = {
      body: {
        name: "test",
        description: "test",
        number: 1,
      },
    };
    const next = jest.fn();
    respondValidationError(req as Request, {} as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).lastCalledWith();
  });
});
