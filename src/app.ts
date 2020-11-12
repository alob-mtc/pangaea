import express, {Request, Response } from "express";
import compression from "compression";  // compresses requests

// Controllers (route handlers)
import * as apiController from "./controllers/api";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 8000);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */
app.get("/api", apiController.root);
app.post("/", apiController.addEvent);
app.get("/event", apiController.getEvent);
app.post("/subscribe/:topic", apiController.subscribe);
app.post("/publish/:topic", apiController.publish);

export default app;
