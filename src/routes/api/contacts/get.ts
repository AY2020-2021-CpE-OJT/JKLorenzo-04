import { Router } from "express";
import { MongoClient } from "mongodb";
import { PBPartialData } from "../../../structures/PBData.js";
import { expect } from "../../../utils/TypeGuards.js";

export default function (router: Router, client: MongoClient): Router {
  return router.get("/", async (req, res) => {
    console.log("contacts get");
    try {
      const result = await client
        .db("phonebook")
        .collection("contacts")
        .aggregate([
          {
            $project: {
              phone_numbers: 0,
            },
          },
          {
            $sort: {
              first_name: 1,
              last_name: 1,
            },
          },
        ])
        .toArray();

      // construct
      const data = result.map((value) => {
        const this_data = {
          _id: value._id?.toString(),
          first_name: value?.first_name,
          last_name: value?.last_name,
        } as PBPartialData;

        expect(
          this_data,
          ["id", "first_name", "last_name"],
          "UNEXPECTED_RESULT"
        );

        return this_data;
      });

      await res.json(data);
    } catch (error) {
      console.error(error);
      res.send(String(error));
    }
  });
}
