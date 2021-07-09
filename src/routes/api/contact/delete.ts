import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { isPBPartialData } from "../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.delete("/:id", async (req, res) => {
    console.log("contact delete");
    try {
      // expect a valid id
      if (!isPBPartialData(req.params, ["id"])) {
        return await res.status(400).send("INVALID_ID");
      }

      // update contact
      const operation = await client
        .db("phonebook")
        .collection("contacts")
        .findOneAndDelete({ _id: new express.ObjectID(req.params.id) });

      await res.json(operation.value);
    } catch (error) {
      console.error(error);
      res.status(error.code ?? 400).send(String(error));
    }
  });
}
