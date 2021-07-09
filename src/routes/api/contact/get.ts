import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { PBData } from "../../../structures/PBData.js";
import { isPBData, isPBPartialData } from "../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.get("/:id", async (req, res) => {
    console.log("contact get");
    try {
      // expect a valid id
      if (!isPBPartialData({ _id: req.params.id }, ["id"])) {
        return await res.status(400).send("INVALID_ID");
      }

      const result = await client
        .db("phonebook")
        .collection("contacts")
        .findOne({ _id: new express.ObjectID(req.params.id) });

      // construct
      const data = {
        _id: result?._id.toString(),
        first_name: result?.first_name,
        last_name: result?.last_name,
        phone_numbers: result?.phone_numbers,
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
