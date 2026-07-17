import express from "express";
import {
  updateDriverLocation,
  getDriverLocation,
} from "../controllers/driver.controller.js";
import authorize from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";



const driverRouter = express.Router();

driverRouter.patch(
  "/location",
  protect,
  authorize("driver"),
  updateDriverLocation,
);

driverRouter.get("/location", protect, authorize("driver"), getDriverLocation);

export default driverRouter;
