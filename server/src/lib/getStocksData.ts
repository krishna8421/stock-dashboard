import { cleanJson } from "./index";
import { execSync } from "child_process";
import fs from "fs-extra";
import { TopStocks } from "../models";
import { connectToDB } from "./connectToDB";

export interface ITopStockData {
  stockData: string;
  rsRating: number;
  fiftyDayMA: number;
  oneFiftyDayMA: number;
  twoHundredDayMA: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
}

export const getStocksData = async () => {
  await connectToDB();

  execSync("pip3 install -r requirements.txt");
  execSync("python3 python/get-top-stocks.py");

  if (!fs.existsSync("topStocks.json")) {
    throw new Error("topStocks.json not found");
  }

  cleanJson("topStocks.json");

  const data = fs.readFileSync("topStocks.json", "utf8");
  const topStocksString = JSON.parse(data);
  let topStocks: ITopStockData[] = [];

  topStocksString.topStocks.map((s: any) => {
    topStocks.push(JSON.parse(s));
  });

  TopStocks.deleteMany({}, () => {
    console.log("Deleted old data");
  });

  try {
    await TopStocks.insertMany(topStocks);
    console.log("Inserted new data");
  } catch (error) {
    console.log(error);
  }

  execSync("yarn clean");
};
