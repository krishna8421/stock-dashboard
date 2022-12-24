import mongoose from "mongoose";

const TopStocksSchema = new mongoose.Schema({
  stockData: String,
  rsRating: Number,
  fiftyDayMA: Number,
  oneFiftyDayMA: Number,
  twoHundredDayMA: Number,
  fiftyTwoWeekLow: Number,
  fiftyTwoWeekHigh: Number
});

export const TopStocks = mongoose.model("top-stocks", TopStocksSchema);
