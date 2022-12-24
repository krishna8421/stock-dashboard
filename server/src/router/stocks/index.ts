import { Router } from "express";

import topStocks from "./topStocks";
import stockData from "./stockData";

const router = Router();

router.use("/top", topStocks);
router.use("/data", stockData);

export default router;
