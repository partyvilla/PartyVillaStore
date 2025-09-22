export function formatCurrency(amount: number, locale = "en-IN", currency = "INR") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    // Fallback
    return `₹${amount.toFixed(0)}`
  }
}
