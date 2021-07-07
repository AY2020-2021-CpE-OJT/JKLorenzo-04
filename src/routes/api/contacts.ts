import { Router } from "express";
import { MongoClient } from "mongodb";
import { PBData } from "../../structures/PBData";

export default function (client: MongoClient): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    console.log("GET");
    try {
      const data = await client
        .db("phonebook")
        .collection("contacts")
        .find()
        .sort({ first_name: 1, last_name: 1 })
        .toArray();
      await res.json(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      await res.status(error.code ?? 400).send(String(error));
    }
  });

  router.post("/", async (req, res) => {
    console.log("POST");
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
          .db("contacts")
          .collection("contacts")
          .findOneAndDelete({ _id: id });
      }
      await res.send("OK");
      console.log(data);
    } catch (error) {
      console.error(error);
      await res.status(error.code ?? 400).send(String(error));
    }
  });

  return router;
}
