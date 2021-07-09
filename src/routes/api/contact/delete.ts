import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { PBData } from "../../../structures/PBData.js";
import { isPBData, isPBPartialData } from "../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.delete("/:id", async (req, res) => {
    console.log("contact delete");
    try {
      // expect a valid id
      if (!isPBPartialData({ _id: req.params.id }, ["id"])) {
        return await res.status(400).send("INVALID_ID");
      }

      // update contact
      const operation = await client
        .db("phonebook")
        .collection("contacts")
        .findOneAndDelete({ _id: new express.ObjectID(req.params.id) });

      // construct
      const data = {
        _id: operation.value?._id.toString(),
        first_name: operation.value?.first_name,
        last_name: operation.value?.last_name,
        phone_numbers: operation.value?.phone_numbers,
      } as PBData;

      // expect a valid data
      if (!isPBData(data)) {
        return await res.status(404).send("CONTACT_NOT_FOUND");
      }

      await res.json(data);
    } catch (error) {
      console.error(error);
      res.status(error.code ?? 400).send(String(error));
    }
  });
}
