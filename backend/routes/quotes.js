import express from "express";
import Quote from "../models/Quote.js";
import validateToken from "../middlewares/authmiddleware.js";
import {
  calculateDynamicBill,
  calculateStandardRate,
} from "../utils/calculator.js";

const router = express.Router();

// valid user authentication
router.use(validateToken);

// check admin
const verifyAdmin = (req, res, next) => {
  // Assuming your User model has a 'role' field
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  }
  next();
};

// @desc    Get APPROVED quotes
// @route   GET /api/quotes
router.get("/", async (req, res) => {
  try {
    const userNeedBaseUnit = Number(req.query.qty) || 0;

    let quotes = await Quote.find({ status: "approved" })
      .populate("submittedBy", "name email")
      .lean();

    quotes = quotes.map((quote) => {
      //  Delegate Math to the Calculator
      const { effectivePrice, penaltyNote, totalBill } = calculateDynamicBill(
        quote,
        userNeedBaseUnit,
      );

      return {
        ...quote,
        effectivePrice,
        penaltyNote,
        totalBill,
      };
    });

    quotes.sort((a, b) => a.effectivePrice - b.effectivePrice);
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/quotes
router.post("/", async (req, res) => {
  try {
    const { isCustomMaterial, isCustomSupplier, isCustomUnit } = req.body;

    let initialStatus = "approved";
    if (isCustomMaterial || isCustomSupplier || isCustomUnit) {
      initialStatus = "pending";
    }

    //  Delegate Math to the Calculator
    const standardPrice = calculateStandardRate(req.body);

    const newQuote = new Quote({
      ...req.body,
      standardizedPricePerBaseUnit: standardPrice,
      status: initialStatus,
      submittedBy: req.user.id,
    });

    const savedQuote = await newQuote.save();

    res.status(201).json({
      quote: savedQuote,
      message: initialStatus === "pending" ? "Review Pending ⏳" : "Added ✅",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}); 

// 2. ADMIN ROUTES (Secured)
// =====================================================

// @desc    Get all Pending Quotes
// @route   GET /api/quotes/pending
router.get("/pending", verifyAdmin, async (req, res) => {
  try {
    const pendingQuotes = await Quote.find({ status: "pending" })
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(pendingQuotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Approve or Reject
// @route   PATCH /api/quotes/:id/status
router.patch("/:id/status", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true },
    );

    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
