import express from "express";
import {
  createParcel,
  getMyParcels,
  trackParcel,
} from "../controllers/parcel.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const parcelRouter = express.Router();

parcelRouter.post("/", protect, authorize("customer"), createParcel);
parcelRouter.get("/my", protect, authorize("customer"), getMyParcels);
parcelRouter.get("/track/:trackingNumber", trackParcel);

export default parcelRouter;
