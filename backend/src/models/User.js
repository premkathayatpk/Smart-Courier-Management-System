import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    role: {
      type: String,
      enum: ["customer", "driver", "admin"],
      default: "customer",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Address
    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    postalCode: {
      type: String,
      default: "",
    },

    // Driver live location
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

    // Driver availability
    isAvailable: {
      type: Boolean,
      default: false,
    },

    // Driver vehicle
    vehicleType: {
      type: String,
      enum: ["Bike", "Scooter", "Car", "Van", "Truck", ""],
      default: "",
    },

    vehicleNumber: {
      type: String,
      default: "",
    },
    licenseNumber: {
      type: String,
      default: "",
    },

    // Authentication
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ role: 1 });
userSchema.index({ isAvailable: 1 });

const User = mongoose.model("User", userSchema);

export default User;
