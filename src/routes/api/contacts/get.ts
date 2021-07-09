import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { PBData } from "../../../structures/PBData.js";

export default function (router: Router, client: MongoClient): Router {
  return router.get("/", async (req, res) => {
    console.log("contacts get all");
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
      res.status(error.code ?? 400).send(String(error));
    }
  });
}
