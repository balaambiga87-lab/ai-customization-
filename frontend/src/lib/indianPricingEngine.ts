import { Metal } from "./types";

export interface IndianPricingBreakdown {
  goldWeightGrams: number; // e.g. 3.2
  goldCost: number;       // e.g. 25120
  diamondCost: number;    // e.g. 145000
  makingCharges: number;  // e.g. 3014 (12% of Gold Cost)
  gst: number;            // e.g. 5194 (3% of subtotal)
  total: number;          // e.g. 178328
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
    };
  }

  const metalRate = METAL_RATE_PER_GRAM[metal] || 7850;
  const goldCost = Math.round(goldWeightGrams * metalRate);

  let diamondCost = 0;
  if (carat > 0) {
    // Find nearest carat rate from lookup map
    const caratKeys = Object.keys(DIAMOND_CARAT_PRICE_MAP).map(Number).sort((a, b) => a - b);
    let closestCarat = 1.00;
    let minDiff = Infinity;
    for (const c of caratKeys) {
      const diff = Math.abs(c - carat);
      if (diff < minDiff) {
        minDiff = diff;
        closestCarat = c;
      }
    }
    diamondCost = DIAMOND_CARAT_PRICE_MAP[closestCarat] || 145000;
  }

  // Making charges = 12% of Gold Value
  const makingCharges = Math.round(goldCost * 0.12);

  // Subtotal before tax
  const subtotal = goldCost + diamondCost + makingCharges;

  // GST = 3% of total value
  const gst = Math.round(subtotal * 0.03);

  const total = goldCost + diamondCost + makingCharges + gst;

  return {
    goldWeightGrams: Number(goldWeightGrams.toFixed(1)),
    goldCost,
    diamondCost,
    makingCharges,
    gst,
    total,
  };
}
