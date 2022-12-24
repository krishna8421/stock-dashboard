import { Router } from "express";
import yahooFinance from "yahoo-finance2";
import { lastYearDate } from "../../lib";

const router = Router();

router.get("/:stockID", async (req, res) => {
  const { stockID } = req.params;
  const { interval = "wk" } = req.query;

  if (!stockID) {
    return res.status(400).json({
      error: "stockID is required",
    });
  }

  if (interval !== "d" && interval !== "mo" && interval !== "wk") {
    return res.status(400).json({
      error: "interval must be d, mo, or wk",
    });
  }

  try {
    const data = await yahooFinance.historical(stockID, {
      period1: lastYearDate(),
      interval: `1${interval}`,
    });
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

export default router;
