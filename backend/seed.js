import mongoose from "mongoose";
import dotenv from "dotenv";
import Quote from "./models/Quote.js";
import { calculateStandardRate } from "./utils/calculator.js";

dotenv.config();

const BASE_SUPPLIERS = [
  "Tata Steel",
  "UltraTech Cement",
  "Asian Paints",
  "Jindal Steel",
  "ACC Cement",
  "Prince Pipes",
  "Ambuja Cement",
  "Berger Paints",
  "Supreme Pipes",
  "Shree Cement",
];

const BASE_MATERIALS = [
  "TMT Bar Fe500D",
  "Cement OPC 53 Grade",
  "Coarse Sand",
  "PVC Pipe 4inch",
  "Ready Mix Concrete M25",
  "Red Clay Bricks",
  "Exterior Emulsion Premium",
];

const MATERIALS = [
  {
    name: "TMT Bar Fe500D",
    baseUnit: "kg",
    basePrice: 58,
    options: [
      { unit: "kg", factor: 1 },
      { unit: "MT", factor: 1000 },
      { unit: "quintal", factor: 100 },
    ],
    gstRate: 18,
  },
  {
    name: "Cement OPC 53 Grade",
    baseUnit: "kg",
    basePrice: 7.8,
    options: [
      { unit: "bag", factor: 50 },
      { unit: "kg", factor: 1 },
      { unit: "MT", factor: 1000 },
    ],
    gstRate: 28,
  },
  {
    name: "Coarse Sand",
    baseUnit: "kg",
    basePrice: 1.2,
    options: [
      { unit: "kg", factor: 1 },
      { unit: "brass", factor: 4500 },
      { unit: "MT", factor: 1000 },
    ],
    gstRate: 18,
  },
  {
    name: "PVC Pipe 4inch",
    baseUnit: "meter",
    basePrice: 180,
    options: [
      { unit: "meter", factor: 1 },
      { unit: "piece_6m", factor: 6 },
      { unit: "feet", factor: 0.3048 },
    ],
    gstRate: 18,
  },
  {
    name: "Ready Mix Concrete M25",
    baseUnit: "meter",
    basePrice: 5600,
    options: [
      { unit: "cum", factor: 1 },
      { unit: "cft", factor: 0.0283 },
    ],
    gstRate: 18,
  },
  {
    name: "Red Clay Bricks",
    baseUnit: "piece",
    basePrice: 8,
    options: [
      { unit: "piece", factor: 1 },
      { unit: "thousand", factor: 1000 },
    ],
    gstRate: 12,
  },
  {
    name: "Exterior Emulsion Premium",
    baseUnit: "liter",
    basePrice: 280,
    options: [
      { unit: "liter", factor: 1 },
      { unit: "drum_20l", factor: 20 },
    ],
    gstRate: 18,
  },
];

const COMPANIES = [
  {
    name: "Tata Steel",
    priceMultiplier: 1.1,
    sellsAll: true,
    transportStyle: "FOR", // Free delivery
    paymentPreference: "Net 30 Days",
    gstStyle: "exclusive", // GST extra
  },
  {
    name: "UltraTech Cement",
    priceMultiplier: 1.08,
    sellsAll: true,
    transportStyle: "EX_WORKS", // Charges transport
    paymentPreference: "Advance",
    gstStyle: "inclusive",
  },
  {
    name: "Asian Paints",
    priceMultiplier: 1.12,
    sellsAll: true,
    transportStyle: "FOR",
    paymentPreference: "Net 45 Days",
    gstStyle: "exclusive",
  },
  {
    name: "Jindal Steel",
    priceMultiplier: 1.05,
    sellsAll: true,
    transportStyle: "FOR",
    paymentPreference: "COD",
    gstStyle: "inclusive",
  },
  {
    name: "ACC Cement",
    priceMultiplier: 1.06,
    sellsAll: true,
    transportStyle: "EX_WORKS",
    paymentPreference: "Net 30 Days",
    gstStyle: "exclusive",
  },
  {
    name: "Prince Pipes",
    priceMultiplier: 0.98,
    sellsAll: true,
    transportStyle: "FOR",
    paymentPreference: "Advance",
    gstStyle: "inclusive",
  },
  {
    name: "Ambuja Cement",
    priceMultiplier: 1.04,
    sellsAll: true,
    transportStyle: "EX_WORKS",
    paymentPreference: "Net 60 Days",
    gstStyle: "exclusive",
  },
  {
    name: "Berger Paints",
    priceMultiplier: 1.09,
    sellsAll: true,
    transportStyle: "FOR",
    paymentPreference: "COD",
    gstStyle: "inclusive",
  },

  // === 2 NEW COMPANIES (PENDING APPROVAL) - SELLING EVERYTHING ===
  {
    name: "Metro BuildMart",
    priceMultiplier: 0.88, // Cheaper local supplier
    sellsAll: true,
    transportStyle: "EX_WORKS",
    paymentPreference: "Advance",
    gstStyle: "exclusive",
    isNew: true, // 🔥 TRIGGERS PENDING STATUS
  },
  {
    name: "Supreme Construction Supply",
    priceMultiplier: 0.94,
    sellsAll: true,
    transportStyle: "FOR",
    paymentPreference: "Net 30 Days",
    gstStyle: "inclusive",
    isNew: true, // 🔥 TRIGGERS PENDING STATUS
  },

  // === 2 SELECTIVE COMPANIES (APPROVED) - NICHE PLAYERS ===
  {
    name: "Shree Cement",
    priceMultiplier: 1.07,
    sellsAll: false,
    materials: ["Cement OPC 53 Grade", "Ready Mix Concrete M25"], // Only cement products
    transportStyle: "FOR",
    paymentPreference: "Net 45 Days",
    gstStyle: "exclusive",
  },
  {
    name: "Steel King Traders",
    priceMultiplier: 0.96,
    sellsAll: false,
    materials: ["TMT Bar Fe500D", "Coarse Sand"], // Steel specialist
    transportStyle: "EX_WORKS",
    paymentPreference: "COD",
    gstStyle: "inclusive",
  },
];

// --- SEED GENERATION ---
const generateQuotes = () => {
  const quotes = [];

  COMPANIES.forEach((company) => {
    // Determine which materials this company sells
    const materialsToSell = company.sellsAll
      ? MATERIALS
      : MATERIALS.filter((m) => company.materials?.includes(m.name));

    materialsToSell.forEach((mat) => {
      // Random unit selection (THIS IS THE VARIETY!)
      const selectedOption =
        mat.options[Math.floor(Math.random() * mat.options.length)];

      // Price calculation with company's multiplier + small fluctuation
      const marketFluctuation = 1 + (Math.random() * 0.08 - 0.04); // ±4%
      const exactPrice =
        mat.basePrice *
        selectedOption.factor *
        company.priceMultiplier *
        marketFluctuation;
      const rawPrice = Math.round(exactPrice * 100) / 100;

      // Custom flags
      const isCustomSupplier = company.isNew === true;
      const isCustomMaterial = false; // NO NEW MATERIALS!

      // Status: pending ONLY if new company
      const status = isCustomSupplier ? "pending" : "approved";

      const quoteData = {
        supplierName: company.name,
        materialName: mat.name,
        status: status,

        unit: selectedOption.unit,
        baseUnit: mat.baseUnit,
        conversionFactor: selectedOption.factor,

        rawPrice: rawPrice,
        gstIncluded: company.gstStyle === "inclusive",
        gstRate: mat.gstRate,

        deliveryTerm: company.transportStyle,
        transportCost:
          company.transportStyle === "EX_WORKS"
            ? Math.floor(Math.random() * 1500) + 500
            : 0,

        paymentTerms: company.paymentPreference,
        minOrderQuantity:
          Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 1,
        leadTime: Math.floor(Math.random() * 7) + 2,

        submittedBy: null,
      };

      quoteData.standardizedPricePerBaseUnit = calculateStandardRate(quoteData);

      quotes.push(quoteData);
    });
  });

  return quotes;
};

// --- DATABASE SEEDING ---
const seedDB = async () => {
  try {
    console.log(" Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log(" Clearing old quotes...");
    await Quote.deleteMany({});

    console.log("  Generating market quotes...");
    const quotes = generateQuotes();

    await Quote.insertMany(quotes);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
