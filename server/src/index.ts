import express from "express";
import mongoose from "mongoose";

import routes from "./routes";
import { createServer } from "node:http";
import { getConfig } from "@utils";

export const app = express();
export const server = createServer(app);

app.get("/", (_, res) =>
  res.status(200).json({
    error: false,
    message: "Operational",
  })
);

app.use(express.json());
app.use("/api", routes);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("DB is connected!");
    server.listen(process.env.PORT, async () => {
      import ("./bot");
      console.log(`API listening on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(console.error);
