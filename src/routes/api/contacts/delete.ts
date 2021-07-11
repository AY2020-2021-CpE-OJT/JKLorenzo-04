import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { PBData } from "../../../structures/PBData.js";
import { expect } from "../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.delete("/", async (req, res) => {
    console.log("contacts delete");
    try {
      const partial_data = req.body as PBData[];

      // expect valid ids
      for (const this_data of partial_data) expect(this_data, ["id"]);

      // update contact
      const operation = await client
        .db("phonebook")
        .collection("contacts")
        .deleteMany({
          _id: {
            $in: partial_data.map((data) => new express.ObjectID(data._id)),
          },
        });

      if (!operation.result.ok) {
        throw new Error("OPERATION_FAILED");
      }

      await res.send(operation.deletedCount ?? 0);
    } catch (error) {
      console.error(error);
      res.json(error);
    }
  });
}
