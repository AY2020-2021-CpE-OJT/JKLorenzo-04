import { Router } from "express";
import express, { MongoClient } from "mongodb";
import { PBData } from "../../../structures/PBData.js";

export default function (router: Router, client: MongoClient): Router {
  return router.get("/", async (req, res) => {
    console.log("contacts get all");
    try {
      const result = await client
        .db("phonebook")
        .collection("contacts")
        .find()
        .sort({ first_name: 1, last_name: 1 })
        .toArray();

      // construct
      const data = result.map((value) => {
        return {
          _id: value._id?.toString(),
          first_name: value?.first_name,
          last_name: value?.last_name,
          phone_numbers: value?.phone_numbers,
        } as PBData;
      });

      await res.json(data);
    } catch (error) {
      console.error(error);
      res.status(error.code ?? 400).send(String(error));
    }
  });
}
