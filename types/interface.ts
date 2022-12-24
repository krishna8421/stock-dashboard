export interface IStockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

export interface ITopStockData {
  // _id: string;
  stockData: string;
  rsRating: number;
  fiftyDayMA: number;
  oneFiftyDayMA: number;
  twoHundredDayMA: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
}
