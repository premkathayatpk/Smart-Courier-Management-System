import express from "express";
import {
  deleteCustomer,
  deleteDriver,
  getCustomerById,
  getCustomerParcels,
  getCustomers,
  getDashboardStats,
  getDriverById,
  getDrivers,
  updateCustomerStatus,
  updateDriver,
  updateDriverStatus,
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const adminRouter = express.Router();

// Dashboard
adminRouter.get("/dashboard", protect, authorize("admin"), getDashboardStats);

// Drivers
adminRouter.get("/drivers", protect, authorize("admin"), getDrivers);

adminRouter.get("/drivers/:id", protect, authorize("admin"), getDriverById);

adminRouter.patch("/drivers/:id", protect, authorize("admin"), updateDriver);

adminRouter.patch(
  "/drivers/:id/status",
  protect,
  authorize("admin"),
  updateDriverStatus,
);

adminRouter.delete("/drivers/:id", protect, authorize("admin"), deleteDriver);

// Customers
adminRouter.get("/customers", protect, authorize("admin"), getCustomers);

adminRouter.get("/customers/:id", protect, authorize("admin"), getCustomerById);

adminRouter.get(
  "/customers/:id/parcels",
  protect,
  authorize("admin"),
  getCustomerParcels,
);

adminRouter.patch(
  "/customers/:id/status",
  protect,
  authorize("admin"),
  updateCustomerStatus,
);

adminRouter.delete(
  "/customers/:id",
  protect,
  authorize("admin"),
  deleteCustomer,
);

export default adminRouter;
