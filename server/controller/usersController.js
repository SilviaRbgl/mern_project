import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/usersModel.js";
import encryptPassword from "../utils/encryptPassword.js";
import isPasswordCorrect from "../utils/isPasswordCorrect.js";

const uploadImage = async (req, res) => {
  try {
    console.log("req.file", req.file.path);
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "images",
    });
    console.log("uploadResult", uploadResult);
    res.status(200).json({
      msg: "image uploaded successfully",
      image: uploadResult.url,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      msg: "image uploaded went wrong",
      error: error,
    });
  }
};

const register = async (req, res) => {
  console.log("req.body >>", req.body);
  const { email, password, role } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    console.log("existingUser", existingUser);

    if (existingUser) {
      res.status(200).json({ msg: "email already in use" });
    } else {
      const hashedPassword = await encryptPassword(password);
      console.log("hashedPassword", hashedPassword);

      const newUser = new userModel({
        userName: req.body.userName ? req.body.userName : req.body.email,
        email: email,
        password: hashedPassword,
        role: role,
        profilePicture: req.body.image
          ? req.body.image
          : "http://res.cloudinary.com/dtwbyjspa/image/upload/v1669821358/images/yk4xc69svkglrejjq3tk.png",
      });
      try {
        const savedUser = await newUser.save();

        res.status(201).json({
          msg: "user registration succesfully",
          user: savedUser,
        });
      } catch (error) {
        console.log("error", error),
          res.status(500).json({
            msg: "user registration error",
            error: error,
          });
      }
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong during registration",
      error: error,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    console.log("existingUser >>>", existingUser);

    if (!existingUser) {
      res
        .status(401)
        .json({ msg: "user not found with this email, register first?" });
    } else {
      const verified = await isPasswordCorrect(password, existingUser.password);
      console.log("verified", verified);
      if (!verified) {
        res.status(401).json({ msg: "wrong password" });
      }
      if (verified) {
        console.log("verified >>>", verified);
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ msg: "login went wrong"})
  }
};

export { uploadImage, register, login };
