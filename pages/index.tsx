import type { NextPage } from "next";
import { useEffect, useState } from "react";
import CandleChart from "../components/CandleChart";
import axios from "axios";
import TopStocksBox from "../components/TopStocksBox";
import { ITopStockData } from "../types/interface";

const Home: NextPage = () => {
  const [topStocks, setTopStocks] = useState<ITopStockData[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<ITopStockData | null>(
    null
  );
  // const [stockName, setStockName] = useState<any>("AAPL");
  useEffect(() => {
    const getTopStocks = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stocks/top`
      );
      setTopStocks(data);
    };
    getTopStocks();
  }, []);

  useEffect(() => {
    setSelectedStocks(topStocks[0]);
  }, [topStocks]);

  return (
    <div className="min-h-screen h-full">
      <h1 className="text-3xl w-full font-bold text-center font-mono py-12">
        Stock Dashboard
      </h1>
      <div className="w-full flex md:flex-row flex-col items-center justify-center">
        <div className="flex-1 flex items-center justify-center flex-col text-xm text-gray-600">
          <CandleChart stockName={selectedStocks?.stockData ?? "AAPL"} />
          <div>
            This is for educational purposes only. I am not a financial advisor.
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <span className="font-bold  md:my-2 my-8">Top Stocks</span>
          <div className="w-10/12 mb-10">
            {topStocks.slice(0, 5).map((s, i) => (
              <div className="" key={i}>
                <TopStocksBox
                  topStock={s}
                  isSelected={selectedStocks?.stockData === s?.stockData}
                  setSelectedStocks={setSelectedStocks}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
