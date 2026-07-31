export class TaxCalculator {
  /**
   * Applies tax rate (defaults to 3% flat GST standard for Indian gold retail).
   */
  static calculate(subtotal: number, taxRate = 0.03): number {
    return Math.round(subtotal * taxRate * 100) / 100;
  }
}
