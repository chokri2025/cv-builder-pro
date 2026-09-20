import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiRouter from "./ai";
import jobsRouter from "./jobs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiRouter);
router.use("/jobs", jobsRouter);

export default router;
