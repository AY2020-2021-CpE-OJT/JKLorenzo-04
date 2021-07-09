import { PBData, PBPartialData } from "../structures/PBData";

type PBDataProps = "id" | "first_name" | "last_name" | "phone_numbers";

export function isPBData(data: any): data is PBData {
  return isPBPartialData(data, [
    "id",
    "first_name",
    "last_name",
    "phone_numbers",
  ])
    ? true
    : false;
}

export function isPBPartialData(
  data: any,
  expect: PBDataProps[]
): data is PBPartialData {
  const this_data = data as PBPartialData;

  if (expect.includes("id")) {
    if (typeof this_data._id !== "string" || this_data._id.length !== 24) {
      return false;
    }
  }

  if (expect.includes("first_name")) {
    if (
      typeof this_data.first_name !== "string" ||
      this_data.first_name.length === 0
    ) {
      return false;
    }
  }

  if (expect.includes("last_name")) {
    if (
      typeof this_data.last_name !== "string" ||
      this_data.last_name.length === 0
    ) {
      return false;
    }
  }

  if (expect.includes("phone_numbers")) {
    if (
      !Array.isArray(this_data.phone_numbers) ||
      this_data.phone_numbers.some((pnum) => typeof pnum !== "string")
    ) {
      return false;
    }
  }

  return true;
}
