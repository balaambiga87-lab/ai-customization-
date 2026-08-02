import { Metal } from "./types";

export interface IndianPricingBreakdown {
  goldWeightGrams: number; // e.g. 3.2
  goldCost: number;       // e.g. 25120
  diamondCost: number;    // e.g. 145000
  makingCharges: number;  // e.g. 3014 (12% of Gold Cost)
  gst: number;            // e.g. 5194 (3% of subtotal)
  total: number;          // e.g. 178328
  grandTotal: number;     // e.g. 178328 (alias for total)
}

export const METAL_RATE_PER_GRAM: Record<string, number> = {
  rose_gold: 7850,  // 18K Rose Gold
  gold: 7850,       // 18K Yellow Gold
  silver: 95,       // 925 Silver
  platinum: 3800,   // 950 Platinum
  "24K": 10400,
  "22K": 9550,
  "18K": 7850,
  "14K": 6100,
};

export const DIAMOND_CARAT_PRICE_MAP: Record<number, number> = {
  0.25: 18000,
  0.50: 42000,
  0.75: 78000,
  1.00: 145000,
  1.50: 260000,
  2.00: 410000,
};

/**
 * Formats numbers into Indian currency format (e.g. ₹1,78,328)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === undefined || amount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Calculates complete Indian Jewellery Pricing breakdown according to GST & Making Charges.
 */
export function calculateIndianPricing(
  metal: Metal,
  goldWeightGrams: number,
  carat: number
): IndianPricingBreakdown {
  if (goldWeightGrams === 0 && carat === 0) {
    return {
      goldWeightGrams: 0,
      goldCost: 0,
      diamondCost: 0,
      makingCharges: 0,
      gst: 0,
      total: 0,
      grandTotal: 0,
    };
  }

  const rate = METAL_RATE_PER_GRAM[metal] || 7850;
  const goldCost = Math.round(goldWeightGrams * rate);

  // Approximate diamond pricing scale
  let diamondCost = 0;
  if (carat > 0) {
    const baseRate = carat >= 1.5 ? 260000 : carat >= 1.0 ? 145000 : carat >= 0.5 ? 42000 : 18000;
    diamondCost = Math.round(carat * baseRate);
  }

  const makingCharges = Math.round(goldCost * 0.12);
  const subtotal = goldCost + diamondCost + makingCharges;
  const gst = Math.round(subtotal * 0.03); // 3% GST on jewellery in India
  const total = subtotal + gst;

  return {
    goldWeightGrams,
    goldCost,
    diamondCost,
    makingCharges,
    gst,
    total,
    grandTotal: total,
  };
}
