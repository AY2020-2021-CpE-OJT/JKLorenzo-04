import { Router } from "express";

export default function (): Router {
  const router = Router();

  router.get("/", (req, res) => {
    return res.send("online");
  });

  return router;
}
