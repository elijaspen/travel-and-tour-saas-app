import cc from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";

type SelectOption = { value: string; label: string };

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
