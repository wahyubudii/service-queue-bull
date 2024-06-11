import mongoose from "mongoose";

// Not Found
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: "failed",
    message: err?.message,
    // stack: err?.stack,
  });
};

// Validation for id
export const validateMongodbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid)
    throw {
      message: "Id is invalid or not found",
      messageIdn: "Id tidak sesuai atau tidak ditemukan",
    };
};

// Validation req body Handler
export const validateRequestBody = (reqBody, requiredFields) => {
  const missingFields = [];
  requiredFields.forEach((field) => {
    if (!reqBody.hasOwnProperty(field) || !reqBody[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    const errorMessage = missingFields.join(", ") + " is required";
    const errorMessageIdn = missingFields.join(", ") + " wajib diisi";
    throw {
      message: errorMessage,
      messageIdn: errorMessageIdn,
    };
  }
};
