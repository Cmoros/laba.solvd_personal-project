/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { RequestHandler } from "express";
import createStandardRouter from "../../src/routers/standard.router";
import { newTestModelSchema } from "../utilities/TestModel";

type RoutesStack = {
  route: {
    path: string;
    methods: {
      get?: boolean;
      post?: boolean;
      put?: boolean;
      patch?: boolean;
      delete?: boolean;
    };
    stack: {
      handle: RequestHandler;
      name: string;
      method: string;
    }[];
  };
}[];

const checkBodyValidation = (
  router: RoutesStack[number]["route"]["stack"],
  i = 0
) => {
  for (const key in newTestModelSchema) {
    expect(router[i].name).toBe(
      `validateBody${key[0].toUpperCase()}${key.slice(1)}`
    );
    i++;
  }
  return i;
};

const checkPartialBodyValidation = (
  router: RoutesStack[number]["route"]["stack"],
  i = 0
) => {
  for (const key in newTestModelSchema) {
    expect(router[i].name).toBe(
      `validatePartialBody${key[0].toUpperCase()}${key.slice(1)}`
    );
    i++;
  }
  return i;
};

const checkQueryValidation = (
  router: RoutesStack[number]["route"]["stack"],
  i = 0
) => {
  for (const key in newTestModelSchema) {
    expect(router[i].name).toBe(
      `validateQueryParam${key[0].toUpperCase()}${key.slice(1)}`
    );
    i++;
  }
  return i;
};

describe("createStandardRouter", () => {
  it("should return a router with all the routes", () => {
    const router = createStandardRouter("Test", newTestModelSchema);
    expect(router.stack.length).toBe(6);
  });

  describe("get all route", () => {
    it("should have a get all route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "" && route.route.methods.get
      );
      expect(route).toBeDefined();
    });

    it("should have all the query validation middlewares", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "" && route.route.methods.get
      )!;
      let i = checkQueryValidation(route.route.stack);
      expect(route.route.stack[i++].name).toBe("respondValidationError");
      expect(route.route.stack[i++].name).toBe("getTests");
      expect(route.route.stack.length).toBe(i);
    });
  });

  describe("get one route", () => {
    it("should have a get one route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "/:id" && route.route.methods.get
      );
      expect(route).toBeDefined();
    });

    it("should have all the query validation middlewares", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "/:id" && route.route.methods.get
      )!;
      expect(route.route.stack[0].name).toBe("idParamValidation");
      expect(route.route.stack[1].name).toBe("respondValidationError");
      expect(route.route.stack[2].name).toBe("getTest");
      expect(route.route.stack.length).toBe(3);
    });
  });

  describe("post route", () => {
    it("should have a post route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "" && route.route.methods.post
      );
      expect(route).toBeDefined();
    });

    it("should have a post route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "" && route.route.methods.post
      )!;
      let i = checkBodyValidation(route.route.stack);
      expect(route.route.stack[i++].name).toBe("respondValidationError");
      expect(route.route.stack[i++].name).toBe("postTest");
      expect(route.route.stack.length).toBe(i);
    });
  });

  describe("put route", () => {
    it("should have a put route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "/:id" && route.route.methods.put
      );
      expect(route).toBeDefined();
    });

    it("should have a put route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "/:id" && route.route.methods.put
      )!;
      let i = 0;
      expect(route.route.stack[i++].name).toBe("idParamValidation");
      i = checkBodyValidation(route.route.stack, i);
      expect(route.route.stack[i++].name).toBe("respondValidationError");
      expect(route.route.stack[i++].name).toBe("putTest");
      expect(route.route.stack.length).toBe(i);
    });
  });

  describe("patch route", () => {
    it("should have a patch route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "/:id" && route.route.methods.patch
      );
      expect(route).toBeDefined();
    });

    it("should have a patch route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "/:id" && route.route.methods.patch
      )!;
      let i = 0;
      expect(route.route.stack[i++].name).toBe("idParamValidation");
      i = checkPartialBodyValidation(route.route.stack, i);
      expect(route.route.stack[i++].name).toBe("respondValidationError");
      expect(route.route.stack[i++].name).toBe("patchTest");
      expect(route.route.stack.length).toBe(i);
    });
  });

  describe("delete route", () => {
    it("should have a delete route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "/:id" && route.route.methods.delete
      );
      expect(route).toBeDefined();
    });

    it("should have a delete route", () => {
      const router = createStandardRouter("Test", newTestModelSchema);
      const stack = router.stack as RoutesStack;
      const route = stack.find(
        (route) => route.route.path === "/:id" && route.route.methods.delete
      )!;
      expect(route.route.stack[0].name).toBe("idParamValidation");
      expect(route.route.stack[1].name).toBe("respondValidationError");
      expect(route.route.stack[2].name).toBe("deleteTest");
      expect(route.route.stack.length).toBe(3);
    });
  });
});
