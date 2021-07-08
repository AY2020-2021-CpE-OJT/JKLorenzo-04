import { Router } from "express";
import { MongoClient } from "mongodb";
import PBData from "../../../structures/PBData";

export default function (router: Router, client: MongoClient): Router {
  return router.post("/", async (req, res) => {
    try {
      const data: PBData = req.body;
      const id = `${data.first_name.toLowerCase()}_${data.last_name.toLowerCase()}`;
      if (data.phone_numbers.length > 0) {
        await client
          .db("phonebook")
          .collection("contacts")
          .updateOne(
            { _id: id },
            {
              $set: {
                first_name: data.first_name,
                last_name: data.last_name,
                phone_numbers: data.phone_numbers,
              } as PBData,
            },
            { upsert: true }
          );
      } else {
        await client
          .db("phonebook")
          .collection("contacts")
          .findOneAndDelete({ _id: id });
      }
      await res.send("OK");
    } catch (error) {
      console.error(error);
      await res.status(error.code ?? 400).send(String(error));
    }
  });
}
