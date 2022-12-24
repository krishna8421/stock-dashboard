import { runEveryDay, getStocksData, connectToDB } from "./lib";
import express, { Express } from "express";
import { disconnect } from "mongoose";
import cors from "cors";
import router from "./router";

const PORT = process.env.PORT || 8000;

const createAppWithMiddleware = (): Express => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/", router);
  return app;
};

// runEveryDay(getStocksData);

const main = async () => {
  const app = createAppWithMiddleware();
  try {
    await connectToDB();
  } catch (err) {
    throw new Error(err);
  }

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

main();

const closeApp = () => {
  disconnect().then(() => {
    console.log("MongoDb disconnected");
    process.exit();
  });
};

process.on("SIGTERM", closeApp);
process.on("SIGINT", closeApp);
