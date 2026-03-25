import cc from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";

type SelectOption = { value: string; label: string };

/** Default currency for new tour pricing tiers (Philippine Peso). */
export const DEFAULT_PRICING_CURRENCY = "PHP";

function currencySelectOptions(): SelectOption[] {
  return cc.codes().map((code) => {
    const row = cc.code(code);
    const name = row?.currency ?? code;
    return { value: code, label: `${name} (${code})` };
  });
}

export const CURRENCY_SELECT_OPTIONS: readonly SelectOption[] = Object.freeze(
  currencySelectOptions(),
);

export function isValidCurrencyCode(code: string | null | undefined): boolean {
  if (code == null || code === "") return false;
  return cc.code(code) != null;
}

export function getCurrencySymbol(currencyCode: string | null | undefined): string {
  if (currencyCode == null || currencyCode === "") return "";
  const upper = currencyCode.toUpperCase();
  return getSymbolFromCurrency(currencyCode) ?? upper;
}

/**
 * Parse a major-unit money string (e.g. "100.10") into minor units (cents).
 * Returns null if empty or invalid.
 */
export function parseMoneyInputToCents(input: string): number | null {
  const t = input.trim().replace(/,/g, "");
  if (t === "" || t === ".") return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

/** Display stored minor units with a currency symbol (e.g. ₱100.10). */
export function formatPriceFromMinorUnits(
  minorUnits: number,
  currencyCode: string,
): string {
  const code = currencyCode.toUpperCase();
  const sym = getCurrencySymbol(code) || code;
  const amount = minorUnits / 100;
  return `${sym}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
