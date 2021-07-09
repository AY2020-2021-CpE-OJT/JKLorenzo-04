import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { PBData, PBPartialData } from "../../../structures/PBData.js";
import { isPBData, isPBPartialData } from "../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.patch("/:id", async (req, res) => {
    console.log("contact patch");
    try {
      const raw_data = req.body as PBPartialData;
      const update_data = {} as PBPartialData;

      if (raw_data.first_name) {
        // expect a partial data with valid first name
        if (isPBPartialData(raw_data, ["first_name"])) {
          update_data.first_name = raw_data.first_name;
        } else {
          return await res.status(400).send("INVALID_FIRST_NAME");
        }
      }
      if (raw_data.last_name) {
        // expect a partial data with valid last name
        if (isPBPartialData(raw_data, ["last_name"])) {
          update_data.last_name = raw_data.last_name;
        } else {
          return await res.status(400).send("INVALID_LAST_NAME");
        }
      }
      if (raw_data.phone_numbers) {
        // expect a partial data with valid phone numbers
        if (isPBPartialData(raw_data, ["phone_numbers"])) {
          update_data.phone_numbers = raw_data.phone_numbers;
        } else {
          return await res.status(400).send("INVALID_PHONE_NUMBERS");
        }
      }

      // update contact
      const operation = await client
        .db("phonebook")
        .collection("contacts")
        .findOneAndUpdate(
          { _id: new express.ObjectID(req.params.id) },
          {
            $set: update_data,
          },
          { returnDocument: "after" }
        );

      // construct
      const data = {
        _id: operation.value?._id.toString(),
        first_name: operation.value?.first_name,
        last_name: operation.value?.last_name,
        phone_numbers: operation.value?.phone_numbers,
      } as PBData;

      // expect a valid data
      if (!isPBData(data)) {
        return await res.status(500).send("UNEXPECTED_RESULT_FROM_OPERATION");
      }

      await res.json(data);
    } catch (error) {
      console.error(error);
      res.status(error.code ?? 400).send(String(error));
    }
  });
}
