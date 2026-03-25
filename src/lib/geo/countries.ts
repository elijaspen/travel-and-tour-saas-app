import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

type SelectOption = { value: string; label: string };

function countrySelectOptions(locale: string): SelectOption[] {
  const names = countries.getNames(locale, { select: "official" });
  return Object.entries(names)
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export const COUNTRY_SELECT_OPTIONS: readonly SelectOption[] = Object.freeze(
  countrySelectOptions("en"),
);

export function isValidCountryCode(code: string | null | undefined): boolean {
  if (code == null || code === "") return false;
  return countries.isValid(code);
}
