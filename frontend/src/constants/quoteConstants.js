export const DEFAULT_SUPPLIERS = [
  "Jindal Steel",
  "Tata Steel",
  "UltraTech",
  "Asian Paints",
];

export const DEFAULT_MATERIALS = [
  "TMT Bar Fe500D",
  "Cement 53 Grade",
  "Coarse Sand",
  "PVC Pipe 4inch",
];

export const UNIT_TYPES = {
  MASS: {
    base: "kg",
    options: [
      { label: "Kilogram (kg)", value: "kg", factor: 1 },
      { label: "Metric Ton (MT)", value: "MT", factor: 1000 },
      { label: "Quintal (100kg)", value: "quintal", factor: 100 },
      { label: "Bag (Cement 50kg)", value: "bag", factor: 50 },
    ],
  },
  LENGTH: {
    base: "meter",
    options: [
      { label: "Meter (m)", value: "meter", factor: 1 },
      { label: "Piece (6m Pipe)", value: "piece_6m", factor: 6 },
      { label: "Foot (ft)", value: "feet", factor: 0.3048 },
    ],
  },
  VOLUME: {
    base: "liter",
    options: [
      { label: "Liter (L)", value: "liter", factor: 1 },
      { label: "Drum (200L)", value: "drum", factor: 200 },
      { label: "Gallon", value: "gallon", factor: 3.785 },
    ],
  },
};

export const INITIAL_FORM_STATE = {
  supplierName: "",
  materialName: "",
  baseUnit: "kg",
  unit: "kg",
  conversionFactor: 1,
  rawPrice: "",
  deliveryTerm: "FOR",
  transportCost: 0,
  gstIncluded: false,
  gstRate: 18,
  paymentTerms: "Advance",
  minOrderQuantity: 1,
  leadTime: 3,
};