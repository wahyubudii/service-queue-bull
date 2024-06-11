import { verifyDocQueue } from "../config/bull.js";
import { validateRequestBody } from "../middleware/errorHandler.js";
import Document from "../models/Document.js";
import User from "../models/User.js";

export const getAllDocument = async (req, res) => {
  try {
    const data = await Document.find();

    const responseData = {
      status: 1,
      message: "",
      objResponse: data,
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const getDocumentById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Document.findById(id)
      .populate("createdBy")
      .populate("verifiedBy");

    const responseData = {
      status: 1,
      message: "",
      objResponse: data,
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const createDocument = async (req, res, next) => {
  const { id } = req.user;
  const requiredFields = ["docName"];

  try {
    validateRequestBody(req.body, requiredFields);

    const newDocument = await Document.create({
      ...req.body,
      createdBy: id,
      status: 0,
    });

    const userAdmin = await User.findOne({ role: 1 });

    const sevenHoursInMs = 7 * 60 * 60 * 1000; // 7 hours
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days

    const params = {
      ...newDocument._doc,
      adminId: userAdmin._id,
    };

    await verifyDocQueue.add(params, { delay: 20000 });

    const responseData = {
      status: 1,
      message: "successfully created document!",
      objResponse: newDocument,
    };

    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

export const verificationDocument = async (req, res, next) => {
  const { id: docId } = req.params;
  const { id } = req.user;
  const { status } = req.body;
  const requiredFields = ["status"];

  try {
    validateRequestBody(req.body, requiredFields);

    const document = await Document.findByIdAndUpdate(
      docId,
      {
        verifiedBy: id,
        status,
      },
      { new: true }
    );

    const responseData = {
      status: 1,
      message: "successfully verification document!",
      objResponse: document,
    };

    res.json(responseData);
  } catch (err) {
    next(err);
  }
};
