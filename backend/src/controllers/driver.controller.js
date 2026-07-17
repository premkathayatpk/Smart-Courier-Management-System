import User from "../models/User.js";
import Parcel from "../models/Parcel.js";
import { emitParcelLocation } from "../socket/socket.js";

// Update Driver Location
export const updateDriverLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude.",
      });
    }

    const location = {
      latitude,
      longitude,
      updatedAt: new Date(),
    };

    const driver = await User.findByIdAndUpdate(
      req.user._id,
      {
        currentLocation: location,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found.",
      });
    }

    const activeParcels = await Parcel.find({
      driver: req.user._id,
      status: {
        $in: ["Assigned", "Picked Up", "In Transit"],
      },
    });

    for (const parcel of activeParcels) {
      parcel.currentLocation = location;

      await parcel.save();

      emitParcelLocation(parcel._id.toString(), location);
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully.",
      data: driver.currentLocation,
    });
  } catch (error) {
    console.error("Update Driver Location:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get Driver Location
export const getDriverLocation = async (req, res) => {
  try {
    const driver = await User.findById(req.user._id).select("currentLocation");

    return res.status(200).json({
      success: true,
      data: driver.currentLocation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
