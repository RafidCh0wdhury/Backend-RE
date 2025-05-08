const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (req, res, next) => {
  const file = req.file.path;

  try {
    if (!file) {
      return null;
    }

    const response = await cloudinary.uploader.upload(file, {
      resource_type: "raw",
    });

    req.cloudinary_url = response.secure_url;
    next();
  } catch (err) {
    // fs.unlinkSync(filePath);

    return null;
  }
};

module.exports = uploadOnCloudinary;
