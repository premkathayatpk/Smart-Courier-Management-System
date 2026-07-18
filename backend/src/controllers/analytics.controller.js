import Parcel from "../models/Parcel.js";
import User from "../models/User.js";

//get analytics overview
export const getAnalyticsOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDrivers,
      totalCustomers,
      totalParcels,
      delivered,
      pending,
      cancelled,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "driver" }),
      User.countDocuments({ role: "customer" }),
      Parcel.countDocuments(),
      Parcel.countDocuments({ status: "Delivered" }),
      Parcel.countDocuments({ status: "Pending" }),
      Parcel.countDocuments({ status: "Cancelled" }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDrivers,
        totalCustomers,
        totalParcels,
        delivered,
        pending,
        cancelled,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//monthly revinue
export const getMonthlyRevenue = async (req, res) => {
  try {
    const revenue = await Parcel.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          revenue: {
            $sum: "$price",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//monthly parcels
export const getMonthlyParcels = async (req, res) => {
  try {
    const parcels = await Parcel.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: parcels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//parcel status chart
export const getParcelStatusAnalytics = async (req, res) => {
  try {
    const status = await Parcel.aggregate([
      {
        $group: {
          _id: "$status",
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//top driver
export const getTopDrivers = async (req, res) => {
  try {
    const drivers = await Parcel.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: "$driver",
          deliveries: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          deliveries: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    res.json({
      success: true,
      data: drivers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//top customer
export const getTopCustomers = async (req, res) => {
  try {
    const customers = await Parcel.aggregate([
      {
        $group: {
          _id: "$customer",
          totalOrders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalOrders: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
