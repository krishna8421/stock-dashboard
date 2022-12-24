import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import { IStockData } from "../types/interface.js";
import axios from "axios";

interface Props {
  className?: string;
  stockName: string;
}

const CandleChart = ({ className, stockName }: Props) => {
  const [data, setData] = useState<IStockData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chartRef = useRef();

  useEffect(() => {
    const getStocksData = async () => {
      setIsLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/stocks/data/${stockName}?interval=wk`
      );
      setData(data);
      setIsLoading(false);
    };
    getStocksData();
  }, [stockName]);

  useEffect(() => {
    if (data === undefined) return;
    const chart = Plot.plot({
      x: {
        grid: true,
      },
      y: {
        grid: true,
      },
      color: {
        domain: [-1, 0, 1],
        range: ["#4daf4a", "#999999", "#e41a1c"],
      },
      marks: [
        Plot.ruleX(data, {
          x: "date",
          y1: "low",
          y2: "high",
        }),
        Plot.ruleX(data, {
          x: "date",
          y1: "open",
          y2: "close",
          stroke: (d: any) => Math.sign(d.close - d.open),
          strokeWidth: 4,
          strokeLinecap: "round",
        }),
      ],
    });

    (chartRef.current as any)?.append(chart);

    return () => chart.remove();
  }, [data]);
  console.log(isLoading);
  return (
    <div className={className}>
      <div className="" ref={chartRef as any} />
      {/* {isLoading && (
        <div className="bg-gray-100 w-ful h-full">Loading</div>
      )} */}
    </div>
  );
};

export default CandleChart;
