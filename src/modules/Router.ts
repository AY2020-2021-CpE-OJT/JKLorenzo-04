import { join, relative } from "path";
import { pathToFileURL } from "url";
import express, { Express } from "express";
import { MongoClient } from "mongodb";
import { getFiles } from "../utils/Functions.js";

interface Route {
  (client: MongoClient): express.Router;
}

export default class Router {
  private app: Express;
  private client: MongoClient;

  constructor(app: Express, client: MongoClient) {
    this.app = app.use(express.json());
    this.client = client;
  }

  async load() {
    const routes = join(process.cwd(), "dist/routes");
    for (const route_path of getFiles(routes)) {
      const file_path = pathToFileURL(route_path).href;
      const rel_path = relative(routes, route_path).replace(/\\/g, "/");
      const endpoint = "/" + rel_path.replace(".js", "");
      const route = (await import(file_path)).default as Route;
      this.app.use(endpoint, route(this.client));
    }
  }
}
