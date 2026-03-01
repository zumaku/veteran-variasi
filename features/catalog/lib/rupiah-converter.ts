/**
 * Formats a numeric value into an Indonesian Rupiah string
 * @param price - The price value to format
 * @returns Formatted currency string (e.g., "Rp 250.000")
 */
export function rupiahConverter(price: number): string {
  // Using Intl.NumberFormat is more robust for currency formatting
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}