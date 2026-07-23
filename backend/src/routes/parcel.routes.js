import express from "express";
import {
  assignDriver,
  createParcel,
  getAllParcels,
  getAssignedParcels,
  getMyParcels,
  getParcelById,
  trackParcel,
  updateParcelStatus,
} from "../controllers/parcel.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const parcelRouter = express.Router();

parcelRouter.post("/", protect, authorize("customer"), createParcel);

parcelRouter.get("/my", protect, authorize("customer"), getMyParcels);

parcelRouter.get("/track/:trackingNumber", trackParcel);

parcelRouter.get("/", protect, authorize("admin"), getAllParcels);
parcelRouter.get("/:id", protect, authorize("admin"), getParcelById);

parcelRouter.patch(
  "/:id/assign-driver",
  protect,
  authorize("admin"),
  assignDriver,
);

parcelRouter.get(
  "/driver/assigned-parcels",
  protect,
  authorize("driver"),
  getAssignedParcels,
);

parcelRouter.patch(
  "/:id/status",
  protect,
  authorize("driver"),
  updateParcelStatus,
);

export default parcelRouter;
