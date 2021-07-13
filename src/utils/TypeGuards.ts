import { PBPartialData } from "../structures/PBData.js";
import { ExpectError } from "./Errors.js";
import { safeFormat } from "./Functions.js";

type PBDataProps = "id" | "first_name" | "last_name" | "phone_numbers";

export function expect(
  data: any,
  expected: PBDataProps[],
  message?: string
): void {
  const this_data = data as PBPartialData;

  if (expected.includes("id")) {
    if (typeof this_data._id !== "string" || this_data._id.length !== 24) {
      throw new ExpectError(message ?? "INVALID_ID");
    }
  }

  if (expected.includes("first_name")) {
    if (
      typeof this_data.first_name !== "string" ||
      safeFormat(this_data.first_name).length === 0
    ) {
      throw new ExpectError(message ?? "INVALID_FIRST_NAME");
    }
  }

  if (expected.includes("last_name")) {
    if (
      typeof this_data.last_name !== "string" ||
      safeFormat(this_data.last_name).length === 0
    ) {
      throw new ExpectError(message ?? "INVALID_LAST_NAME");
    }
  }

  if (expected.includes("phone_numbers")) {
    if (
      !Array.isArray(this_data.phone_numbers) ||
      this_data.phone_numbers.some(
        (pnum) => typeof pnum !== "string" || safeFormat(pnum).length === 0
      )
    ) {
      throw new ExpectError(message ?? "INVALID_PHONE_NUMBERS");
    }
  }
}

export function expectAll(data: any, message?: string): void {
  expect(data, ["id", "first_name", "last_name", "phone_numbers"], message);
}
