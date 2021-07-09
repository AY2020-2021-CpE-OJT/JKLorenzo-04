import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { PBData, PBPartialData } from "../../../../structures/PBData.js";
import { isPBData, isPBPartialData } from "../../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.put("/", async (req, res) => {
    console.log("contact/phone_numbers put");
    try {
      const raw_data = req.body as PBPartialData;

      // expect a partial data with valid id and phone numbers
      if (!isPBPartialData(raw_data, ["id", "phone_numbers"])) {
        return await res.status(400).send("INVALID_DATA");
      }

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
