import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import uploadToCloudinary from "../utils/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//update profile

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, state, country, postalCode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        phone,
        address,
        city,
        state,
        country,
        postalCode,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//update profile image

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    const user = await User.findById(req.user._id);

    // Delete previous image
    if (user.profileImage.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    // Upload new image
    const result = await uploadToCloudinary(req.file.buffer, "courier/users");

    user.profileImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      data: user.profileImage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
