import { Router } from "express";
import { TopStocks } from "./../../models";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const topStocks = await TopStocks.find();
    topStocks
      .sort((a, b) => {
        return b.rsRating - a.rsRating;
      })
      .slice(0, 10);

    res.status(200).json(topStocks);
  } catch (error) {
    console.log(error);
  }
});

export default router;
