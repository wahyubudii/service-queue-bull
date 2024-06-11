import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    throw {
      message: "Token not found",
      messageIdn: "Token tidak ditemukan",
    };

  const authSplit = authorization.split(" ");
  const [authType, authToken] = authSplit;

  if (authType !== "Bearer")
    throw {
      message: "Please use Bearer to auth",
      messageIdn: "Gunakan jenis bearer token",
    };

  try {
    const decode = jwt.verify(authToken, process.env.JWT_SECRET);
    if (decode) {
      req.user = {
        ...decode,
        id: decode.id,
        token: authToken,
      };
      next();
    }
  } catch (err) {
    res.status(401);
    throw {
      message: "Not Authorized token expired, Please login again",
      messageIdn: "Authorized token kadaluarsa, silahkan login kembali",
    };
  }
});

export const isAdmin = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.user;
  try {
    const adminUser = await User.findById(id);

    if (adminUser.role !== 1) {
      throw {
        message: "You dont have admin access",
      };
    } else {
      next();
    }
  } catch (err) {
    throw {
      message: err.message,
      messageIdn: "Terjadi Kesalahan",
    };
  }
});
