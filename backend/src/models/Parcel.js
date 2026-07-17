import mongoose from "mongoose";

const parcelSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Pickup Contact
    pickupContact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // Pickup Location
    pickupLocation: {
      address: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    // Receiver Contact
    deliveryContact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // Delivery Location
    deliveryLocation: {
      address: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    parcelType: {
      type: String,
      enum: [
        "Document",
        "Electronics",
        "Clothes",
        "Food",
        "Fragile",
        "Medicine",
        "Other",
      ],
      default: "Other",
    },

    weight: {
      type: Number,
      required: true,
      min: 0.1,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "eSewa", "Khalti"],
      default: "Cash",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "Pending",
            "Assigned",
            "Picked Up",
            "In Transit",
            "Delivered",
            "Cancelled",
          ],
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: "",
        },
      },
    ],

    estimatedDistance: {
      type: Number,
      default: 0,
    },

    estimatedDuration: {
      type: Number,
      default: 0,
    },

    estimatedDelivery: {
      type: Date,
    },

    pickedUpAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
    pickedUpAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    deliveryOTP: {
      type: String,
      default: null,
    },
    currentLocation: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },

      updatedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Parcel", parcelSchema);
