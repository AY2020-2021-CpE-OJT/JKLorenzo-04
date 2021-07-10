import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { PBData, PBPartialData } from "../../../../structures/PBData.js";
import { expect, expectAll } from "../../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.put("/", async (req, res) => {
    console.log("contacts/phone_numbers put");
    try {
      const raw_data = req.body as PBPartialData;

      // expect a partial data with valid id and phone numbers
      expect(raw_data, ["id", "phone_numbers"]);

      // update contact
      const operation = await client
        .db("phonebook")
        .collection("contacts")
        .findOneAndUpdate(
          { _id: new express.ObjectID(raw_data._id) },
          {
            $push: {
              phone_numbers: {
                $each: raw_data.phone_numbers,
              },
            },
          },
          { returnDocument: "after" }
        );

      // expect a valid output
      if (!operation.value) {
        throw new Error("OPERATION_FAILED");
      }

      // construct
      const data = {
        _id: operation.value._id?.toString(),
        first_name: operation.value.first_name,
        last_name: operation.value.last_name,
        phone_numbers: operation.value.phone_numbers,
      } as PBData;

      expectAll(data, "UNEXPECTED_RESULT");

      await res.json(data);
    } catch (error) {
      console.error(error);
      res.status(error.code ?? 400).send(String(error));
    }
  });
}
