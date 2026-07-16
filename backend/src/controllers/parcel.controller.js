import Parcel from "../models/Parcel.js";
import generateTrackingNumber from "../utils/genTrackingNum.js";

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

    // Validation
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

    // Basic price calculation
    const basePrice = 100;
    const pricePerKg = 50;

    const price = basePrice + weight * pricePerKg;

    const parcel = await Parcel.create({
      trackingNumber: generateTrackingNumber(),

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
    });

    res.status(201).json({
      success: true,
      message: "Parcel booked successfully.",
      data: parcel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
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
