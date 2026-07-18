import express from "express";
import {
  getAnalyticsOverview,
  getMonthlyParcels,
  getMonthlyRevenue,
  getParcelStatusAnalytics,
  getTopCustomers,
  getTopDrivers,
} from "../controllers/analytics.controller.js";
import authorize from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const analyticsRouter = express.Router();

analyticsRouter.use(protect);
analyticsRouter.use(authorize("admin"));

analyticsRouter.get("/overview", getAnalyticsOverview);
analyticsRouter.get("/monthly-revenue", getMonthlyRevenue);
analyticsRouter.get("/monthly-parcels", getMonthlyParcels);
analyticsRouter.get("/status", getParcelStatusAnalytics);
analyticsRouter.get("/top-drivers", getTopDrivers);
analyticsRouter.get("/top-customers", getTopCustomers);

export default analyticsRouter;
