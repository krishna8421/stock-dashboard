import { cleanJson } from "./index";
import { execSync } from "child_process";
import fs from "fs";
import { TopStocks } from "../models";
import { connectToDB } from "./connectToDB";

export const getStocksData = async () => {

  await connectToDB();

  execSync("pip install -r python/requirements.txt");
  execSync("python python/get-top-stocks.py");

  if (!fs.existsSync("topStocks.json")) {
    throw new Error("topStocks.json not found");
  }

  cleanJson("topStocks.json");

  const data = fs.readFileSync("topStocks.json", "utf8");
  const topStocks = JSON.parse(data);

  TopStocks.deleteMany({}, () => {
    console.log("Deleted old data");
  });

  try {
    await TopStocks.insertMany(topStocks);
    console.log("Inserted new data");
  } catch (error) {
    console.log(error);
  }

  // execSync("yarn clean");
};
