

//  Extract credit months from string "Net 45"
const getCreditMonths = (paymentTerms) => {
  if (!paymentTerms) return 0;
  const match = paymentTerms.match(/(\d+)/);
  if (match) return parseInt(match[1], 10) / 30; // Convert days to months
  return 0; // Advance/COD
};

// Apply Financial Levers (Tax + Transport - Credit)
const applyFinancials = (basePrice, quote) => {
  let cost = basePrice;

  //  Tax Logic
  if (!quote.gstIncluded) {
    cost *= 1 + (quote.gstRate || 18) / 100;
  }

  //  Transport Logic (Ex-Works Penalty)
  if (quote.deliveryTerm === "EX_WORKS") {
    cost += quote.transportCost || 0;
  }

  //  Credit Discount Logic
  const months = getCreditMonths(quote.paymentTerms);
  if (months > 0) {
    // 1.5% interest savings per month
    cost /= 1 + 0.015 * months;
  }

  return cost;
};

// PUBLIC EXPORTS 

//  STATIC CALC: Used when saving to DB
export const calculateStandardRate = (quote) => {
  let costPerSalesUnit = applyFinancials(Number(quote.rawPrice), quote);

  const factor = Number(quote.conversionFactor) || 1;
  const safeFactor = factor > 0 ? factor : 1;

  return parseFloat((costPerSalesUnit / safeFactor).toFixed(2));
};

//  DYNAMIC CALC: Used by Dashboard (Runtime)

export const calculateDynamicBill = (quote, qtyNeeded) => {
  if (!qtyNeeded || qtyNeeded <= 0) {
    return {
      effectivePrice: quote.standardizedPricePerBaseUnit,
      totalBill: 0, 
      penaltyNote: null,
    };
  }

  //  Wastage & MOQ Logic
  const factor = Number(quote.conversionFactor) || 1;
  const exactUnits = qtyNeeded / factor;
  let buyUnits = Math.ceil(exactUnits);

  let penalty = null;
  if (buyUnits < quote.minOrderQuantity) {
    buyUnits = quote.minOrderQuantity;
    penalty = `High MOQ! Forced to buy ${buyUnits} ${quote.unit}`;
  }

  //  Financial Logic
  let costPerUnit = applyFinancials(Number(quote.rawPrice), quote);
  const totalBill = buyUnits * costPerUnit;

  return {
    effectivePrice: totalBill / qtyNeeded,
    totalBill: totalBill, 
    penaltyNote: penalty,
  };
};
