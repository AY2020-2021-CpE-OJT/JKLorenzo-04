import { Router } from "express";
import { MongoClient } from "mongodb";
import { PBData, PBPartialData } from "../../../structures/PBData.js";
import { isPBData, isPBPartialData } from "../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.put("/", async (req, res) => {
    console.log("contacts put");
    try {
      // construct partial data
      const partial_data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_numbers: req.body.phone_numbers ?? [],
      } as PBPartialData;

      // expect a partial data with firstname and lastname
      if (!isPBPartialData(partial_data, ["first_name", "last_name"])) {
        return await res.status(400).send("INVALID_DATA");
      }

      // insert contact
      const operation = await client
        .db("phonebook")
        .collection("contacts")
        .insertOne(partial_data);

      // construct data
      const data = {
        _id: operation.insertedId.toString(),
        first_name: partial_data.first_name,
        last_name: partial_data.last_name,
        phone_numbers: partial_data.phone_numbers,
      } as PBData;

      // expect a valid data
      if (!operation.result.ok || !isPBData(data)) {
        return await res.status(500).send("UNEXPECTED_RESULT_FROM_OPERATION");
      }

      await res.json(data);
    } catch (error) {
      console.error(error);
      res.status(error.code ?? 400).send(String(error));
    }
  });
}
