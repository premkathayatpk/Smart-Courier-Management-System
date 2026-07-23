import Parcel from "../models/Parcel.js";
import User from "../models/User.js";

import generateTrackingNumber from "../utils/genTrackingNum.js";
import calculatePrice from "../utils/calculatePrice.js";
import statusFlow from "../utils/statusFlow.js";
import addStatusHistory from "../utils/addStatusHistory.js";

//create parcel
export const createParcel = async (req, res) => {
  try {
    const {
      pickupContact,
      pickupLocation,
      deliveryContact,
      deliveryLocation,
      parcelType,
      weight,
      paymentMethod,
      notes,
    } = req.body;

    if (
      !pickupContact ||
      !pickupLocation ||
      !deliveryContact ||
      !deliveryLocation ||
      !weight
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Generate unique tracking number
    let trackingNumber;

    do {
      trackingNumber = generateTrackingNumber();
    } while (await Parcel.exists({ trackingNumber }));

    // Calculate parcel price
    const price = calculatePrice({
      weight,
      parcelType,
    });

    const parcel = await Parcel.create({
      trackingNumber,

      customer: req.user._id,

      pickupContact,
      pickupLocation,

      deliveryContact,
      deliveryLocation,

      parcelType,
      weight,

      paymentMethod,

      notes,

      price,

      statusHistory: [
        {
          status: "Pending",
          updatedBy: req.user._id,
          note: "Parcel created",
          timestamp: new Date(),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Parcel booked successfully.",
      data: parcel,
    });
  } catch (error) {
    console.error("Create Parcel:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//get my parcels

export const getMyParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({
      customer: req.user._id,
    })
      .populate("driver", "name phone profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: parcels.length,
      data: parcels,
    });
  } catch (error) {
    console.error("Get My Parcels:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//get parcel by tracking number

export const trackParcel = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const parcel = await Parcel.findOne({ trackingNumber })
      .populate("customer", "name email phone")
      .populate("driver", "name phone profileImage");

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        trackingNumber: parcel.trackingNumber,
        status: parcel.status,
        parcelType: parcel.parcelType,
        weight: parcel.weight,
        price: parcel.price,
        pickupLocation: parcel.pickupLocation,
        deliveryLocation: parcel.deliveryLocation,
        estimatedDelivery: parcel.estimatedDelivery,
        driver: parcel.driver
          ? {
              name: parcel.driver.name,
              phone: parcel.driver.phone,
              profileImage: parcel.driver.profileImage,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Track Parcel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//get all parcels
export const getAllParcels = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status, sort } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          trackingNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "pickupContact.name": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "deliveryContact.name": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const parcels = await Parcel.find(filter)
      .populate("customer", "name email")
      .populate("driver", "name phone")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Parcel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: parcels,
    });
  } catch (error) {
    console.error("Get All Parcels Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//get parcel by id
export const getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("driver", "name email phone");

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Assign driver to parcel

export const assignDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: "Driver ID is required.",
      });
    }

    // Find parcel
    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found.",
      });
    }

    // Prevent assigning delivered/cancelled parcels
    if (["Delivered", "Cancelled"].includes(parcel.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot assign driver to a ${parcel.status.toLowerCase()} parcel.`,
      });
    }

    // Prevent duplicate assignment
    if (parcel.driver) {
      return res.status(400).json({
        success: false,
        message: "Driver is already assigned to this parcel.",
      });
    }

    // Check driver
    const driver = await User.findOne({
      _id: driverId,
      role: "driver",
      isActive: true,
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found or inactive.",
      });
    }

    // Assign driver
    parcel.driver = driver._id;

    addStatusHistory(
      parcel,
      "Assigned",
      req.user._id,
      `Assigned to ${driver.name}`,
    );

    await parcel.save();

    const updatedParcel = await Parcel.findById(parcel._id)
      .populate("customer", "name email phone")
      .populate("driver", "name phone profileImage");

    return res.status(200).json({
      success: true,
      message: "Driver assigned successfully.",
      data: updatedParcel,
    });
  } catch (error) {
    console.error("Assign Driver:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//get assigned parcel
export const getAssignedParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({
      driver: req.user._id,
      status: {
        $in: ["Assigned", "Picked Up", "In Transit"],
      },
    })
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: parcels.length,
      data: parcels,
    });
  } catch (error) {
    console.error("Assigned Parcels:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//update status controller

export const updateParcelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, otp } = req.body;

    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found.",
      });
    }

    // Only assigned driver can update
    if (parcel.driver?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this parcel.",
      });
    }

    // Validate next status
    const expectedStatus = statusFlow[parcel.status];

    if (status !== expectedStatus) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition. Next allowed status is "${expectedStatus}".`,
      });
    }

    // OTP verification before delivery
    if (status === "Delivered") {
      if (!otp) {
        return res.status(400).json({
          success: false,
          message: "Delivery OTP is required.",
        });
      }

      if (otp !== parcel.deliveryOTP) {
        return res.status(400).json({
          success: false,
          message: "Invalid delivery OTP.",
        });
      }
    }

    // Status history
    addStatusHistory(
      parcel,
      status,
      req.user._id,
      `Parcel status changed to ${status}`,
    );

    // Update timestamps
    if (status === "Picked Up") {
      parcel.pickedUpAt = new Date();
    }

    if (status === "Delivered") {
      parcel.deliveredAt = new Date();

      // Remove OTP after successful delivery
      parcel.deliveryOTP = null;
    }

    await parcel.save();

    const updatedParcel = await Parcel.findById(parcel._id)
      .populate("customer", "name phone")
      .populate("driver", "name phone profileImage");

    return res.status(200).json({
      success: true,
      message: "Parcel status updated successfully.",
      data: updatedParcel,
    });
  } catch (error) {
    console.error("Update Parcel Status:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
