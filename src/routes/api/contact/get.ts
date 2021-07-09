import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { PBData } from "../../../structures/PBData";
import { isPBPartialData } from "../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.get("/:id", async (req, res) => {
    console.log("contact get");
    try {
      // expect a valid id
      if (!isPBPartialData(req.params, ["id"])) {
        return await res.status(400).send("INVALID_ID");
      }

      const data: PBData = await client
        .db("phonebook")
        .collection("contacts")
        .findOne({ _id: new express.ObjectID(req.params.id) });

      await res.json(data);
    } catch (error) {
      console.error(error);
      res.status(error.code ?? 400).send(String(error));
    }
  });
}
