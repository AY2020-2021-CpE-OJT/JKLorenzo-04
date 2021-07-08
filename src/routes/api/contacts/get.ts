import { Router } from "express";
import { MongoClient } from "mongodb";
import PBData from "../../../structures/PBData";

export default function (router: Router, client: MongoClient): Router {
  return router.get("/", async (req, res) => {
    try {
      const data: PBData[] = await client
        .db("phonebook")
        .collection("contacts")
        .find()
        .sort({ first_name: 1, last_name: 1 })
        .toArray();
      await res.json(data);
    } catch (error) {
      console.error(error);
      await res.status(error.code ?? 400).send(String(error));
    }
  });
}
