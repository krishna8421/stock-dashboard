import React from "react";
import { ITopStockData } from "../types/interface.js";

interface ITopStockBoxProps {
  topStock: ITopStockData;
  isSelected: boolean;
  setSelectedStocks: any;
}

const TopStocksBox = ({
  topStock,
  isSelected,
  setSelectedStocks,
}: ITopStockBoxProps) => {
  return (
    <div
      className={`bg-gray-100 m-1 px-6 py-3 w-full rounded-lg hover:border hover:border-gray-400 cursor-pointer delay-50 transition-all ${
        isSelected ? "border border-gray-400" : ""
      }`}
      onClick={() => {
        setSelectedStocks(topStock);
      }}
    >
      <span className="block text-lg font-semibold text-gray-800">
        {topStock.stockData.split(".")[0]}
      </span>
      <span className="text-sm text-gray-500">Rating: {topStock.rsRating}</span>
      {isSelected && (
        <div className="text-sm text-gray-500">
          <div>50 Day MA: {topStock.fiftyDayMA} </div>
          <div>150 Day MA: {topStock.oneFiftyDayMA} </div>
          <div>200 Day MA: {topStock.twoHundredDayMA} </div>
          <div>52 Week Low: {topStock.fiftyTwoWeekLow} </div>
          <div>52 Week High: {topStock.fiftyTwoWeekHigh} </div>
        </div>
      )}
    </div>
  );
};
export default TopStocksBox;
