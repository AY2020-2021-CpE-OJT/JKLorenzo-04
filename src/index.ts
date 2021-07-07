import express from "express";
import mongodb from "mongodb";
import { PBData } from "./structures/PBData";

const uri = process.env.URI!;
const port = process.env.PORT!;

const app = express().use(express.json());
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(`Listening to ${port}`);
await app.listen(port);

console.log(`Connecting to: ${uri}`);
await client.connect();
const db = client.db("phonebook");
console.log("Initialized");

app.get("/api/contacts", async (req, res) => {
  console.log("GET");
  try {
    const data = await db
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

app.post("/api/contacts", async (req, res) => {
  console.log("POST");
  try {
    const data: PBData = req.body;
    const id = `${data.first_name.toLowerCase()}_${data.last_name.toLowerCase()}`;
    if (data.phone_numbers.length > 0) {
      await db.collection("contacts").updateOne(
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
      await db.collection("contacts").findOneAndDelete({ _id: id });
    }
    await res.send("OK");
    console.log(data);
  } catch (error) {
    console.error(error);
    await res.status(error.code ?? 400).send(String(error));
  }
});
