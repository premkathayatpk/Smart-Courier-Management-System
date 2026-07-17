import User from "../models/User.js";
import Parcel from "../models/Parcel.js";

export const getDashboardStats = async (req, res) => {
  try {
    // User Statistics
    const totalUsers = await User.countDocuments();

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalDrivers = await User.countDocuments({
      role: "driver",
    });

    const activeDrivers = await User.countDocuments({
      role: "driver",
      isActive: true,
    });

    // Parcel Statistics
    const totalParcels = await Parcel.countDocuments();

    const pendingParcels = await Parcel.countDocuments({
      status: "Pending",
    });

    const assignedParcels = await Parcel.countDocuments({
      status: "Assigned",
    });

    const pickedUpParcels = await Parcel.countDocuments({
      status: "Picked Up",
    });

    const inTransitParcels = await Parcel.countDocuments({
      status: "In Transit",
    });

    const deliveredParcels = await Parcel.countDocuments({
      status: "Delivered",
    });

    const cancelledParcels = await Parcel.countDocuments({
      status: "Cancelled",
    });

    // Revenue
    const revenueResult = await Parcel.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Today's Orders
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayOrders = await Parcel.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        users: {
          totalUsers,
          totalCustomers,
          totalDrivers,
          activeDrivers,
        },

        parcels: {
          totalParcels,
          pendingParcels,
          assignedParcels,
          pickedUpParcels,
          inTransitParcels,
          deliveredParcels,
          cancelledParcels,
        },

        revenue: {
          totalRevenue,
        },

        todayOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// get all drivers
export const getDrivers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;

    const filter = {
      role: "driver",
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const drivers = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    return res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: drivers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//get driver by ID
export const getDriverById = async (req, res) => {
  try {
    const driver = await User.findOne({
      _id: req.params.id,
      role: "driver",
    }).select("-password");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// update driver
export const updateDriver = async (req, res) => {
  try {
    const driver = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "driver",
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Driver updated successfully.",
      data: driver,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//activate/deactivate driver
export const updateDriverStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const driver = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "driver",
      },
      {
        isActive,
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

    return res.status(200).json({
      success: true,
      message: "Driver status updated.",
      data: driver,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//delete driver
export const deleteDriver = async (req, res) => {
  try {
    const driver = await User.findOne({
      _id: req.params.id,
      role: "driver",
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found.",
      });
    }

    const activeParcel = await Parcel.findOne({
      driver: driver._id,
      status: {
        $in: ["Assigned", "Picked Up", "In Transit"],
      },
    });

    if (activeParcel) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete driver with active deliveries.",
      });
    }

    await driver.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Driver deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//Customer
//get all customer
export const getCustomers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;

    const filter = {
      role: "customer",
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const customers = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    return res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: customers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//get customer details
export const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    }).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//get customer parcels history
export const getCustomerParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({
      customer: req.params.id,
    })
      .populate("driver", "name phone")
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      count: parcels.length,
      data: parcels,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//active/deactive customer
export const updateCustomerStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const customer = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "customer",
      },
      {
        isActive,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const activeParcel = await Parcel.findOne({
      customer: customer._id,
      status: {
        $in: ["Pending", "Assigned", "Picked Up", "In Transit"],
      },
    });

    if (activeParcel) {
      return res.status(400).json({
        success: false,
        message: "Customer has active parcels",
      });
    }

    await customer.deleteOne();

    return res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
