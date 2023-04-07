type QueryErrorMessage =
  | "Not found"
  | "Not created"
  | "Not updated"
  | "Not deleted"
  | "Not patched";

export default class QueryError extends Error {
  message: QueryErrorMessage;
  constructor(message: QueryErrorMessage) {
    super(message);
    this.message = message;
    this.name = "QueryError";
  }
}
