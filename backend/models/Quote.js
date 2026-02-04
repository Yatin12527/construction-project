import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    // supplier and material name
    supplierName: { type: String, required: true, trim: true },
    materialName: { type: String, required: true, trim: true },

    // status
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "approved",
    },

    // Reference the User Model
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links  users collection
      default: null, // Null means "System Generated" or "Seeded Data"
    },

    // --- 3. PHYSICS & UNITS (Hard Locked) ---
    unit: {
      type: String,
      required: true,
      trim: true,
    },

    baseUnit: {
      type: String,
      required: true,
      default: "kg",
      enum: ["kg", "meter", "liter", "piece"],
    },

    conversionFactor: { type: Number, default: 1 },

    // --- 4. COMMERCIALS ---
    rawPrice: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    gstIncluded: { type: Boolean, default: false },
    gstRate: { type: Number, default: 18 },

    deliveryTerm: {
      type: String,
      enum: ["FOR", "EX_WORKS"],
      default: "FOR",
    },
    transportCost: { type: Number, default: 0 },

    paymentTerms: {
      type: String,
      default: "Advance",
    },

    // --- 5. LOGISTICS ---
    minOrderQuantity: { type: Number, default: 1 },
    leadTime: { type: Number, default: 3 },

    // --- 6. CALCULATED FIELDS ---
    standardizedPricePerBaseUnit: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.model("Quote", QuoteSchema);
