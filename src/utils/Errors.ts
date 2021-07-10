export class ExpectError extends Error {
  name = "ExpectError";

  constructor(data: any, message: string) {
    super(`${message} on : ${JSON.stringify(data, undefined, 4)}`);
    Error.captureStackTrace(this, ExpectError);
  }
}
