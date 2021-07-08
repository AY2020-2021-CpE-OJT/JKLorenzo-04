import { Router } from "express";
import { MongoClient } from "mongodb";

export default function (router: Router, client: MongoClient): Router {
  return router.get("/", async (req, res) => {
    return res.send("online");
  });
}
