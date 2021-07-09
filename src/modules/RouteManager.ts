import { join, relative } from "path";
import { pathToFileURL } from "url";
import { Express, Router, json } from "express";
import { MongoClient } from "mongodb";
import Route from "../structures/Route";
import { getFiles } from "../utils/Functions.js";

export default class RouteManager {
  private app: Express;
  private client: MongoClient;

  constructor(app: Express, client: MongoClient) {
    this.app = app.use(json());
    this.client = client;
  }

  async load() {
    const routes = join(process.cwd(), "dist/routes");
    const current_route = { endpoint: "", router: Router() };

    for (const route_path of getFiles(routes)) {
      const file_path = pathToFileURL(route_path).href;
      const rel_path = relative(routes, route_path);
      const sections = rel_path.split("\\");
      const endpoint = "/" + sections.slice(0, sections.length - 1).join("/");

      if (current_route.endpoint !== endpoint) {
        current_route.endpoint = endpoint;
        current_route.router = Router();
        console.log(`Route: ${current_route.endpoint}`);
      }

      const route = (await import(file_path)).default as Route;
      current_route.router = route(current_route.router, this.client);
      this.app.use(current_route.endpoint, current_route.router);
    }
  }
}
