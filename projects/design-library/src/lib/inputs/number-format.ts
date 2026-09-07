import type { ValidatorFn, ValidationErrors } from "@angular/forms";
export interface NumberFormatOptions {
  format?: "decimal" | "currency" | "percent";
  locale?: string;
  currency?: string;
  precision?: number;
  minPrecision?: number | null;
  useGrouping?: boolean;
  percentValue?: "points" | "fraction";
  currencyDisplay?: "symbol" | "narrowSymbol" | "code";
  signDisplay?: "auto" | "always" | "exceptZero" | "never";
}
export interface NumericValidationOptions {
  min?: number | null;
  max?: number | null;
  precision?: number | null;
  step?: number | null;
  stepBase?: number;
  percentValue?: "points" | "fraction";
}
/** Shift decimal units without introducing multiplication/division artifacts. */
export function shiftDecimal(value: number, places: number): number {
  const [coefficient, exponent = "0"] = value.toString().split("e");
  return Number(`${coefficient}e${Number(exponent) + places}`);
}
export function numberPrecision(value: number): number {
  return Math.min(20, Math.max(0, Math.floor(value) || 0));
}
function decimalPlaces(value: number): number {
  const [digits, exponent] = Math.abs(value).toString().split("e");
  return Math.max(
    0,
    (digits!.split(".")[1]?.length ?? 0) - Number(exponent ?? 0),
  );
}
/** Formats numeric models; percentages use percentage points unless fraction is selected. */
export function formatNumber(
  value: number | null,
  options: NumberFormatOptions = {},
): string {
  if (value === null || !Number.isFinite(value)) return "";
  const precision = numberPrecision(options.precision ?? 2);
  const format = options.format ?? "decimal";
  const minimum = Math.min(
    precision,
    numberPrecision(
      options.minPrecision ?? (format === "currency" ? precision : 0),
    ),
  );
  return new Intl.NumberFormat(options.locale ?? "en-US", {
    style: format,
    currency: options.currency ?? "USD",
    currencyDisplay: options.currencyDisplay ?? "symbol",
    maximumFractionDigits: precision,
    minimumFractionDigits: minimum,
    useGrouping: options.useGrouping ?? true,
    signDisplay: options.signDisplay ?? "auto",
  }).format(
    format === "percent" && options.percentValue !== "fraction"
      ? shiftDecimal(value, -2)
      : value,
  );
}
/** Strict localized parsing; null means empty, NaN means invalid. Accepts the locale's grouping and affixes. */
export function parseNumber(
  text: string,
  options: NumberFormatOptions = {},
): number | null {
  let value = text.trim();
  if (!value) return null;
  const locale = options.locale ?? "en-US";
  const parts = new Intl.NumberFormat(locale, {
    style: options.format ?? "decimal",
    currency: options.currency ?? "USD",
    currencyDisplay: options.currencyDisplay ?? "symbol",
    minimumFractionDigits: 1,
  }).formatToParts(-12345.6);
  for (let digit = 0; digit < 10; digit++)
    value = value
      .split(
        new Intl.NumberFormat(locale, { useGrouping: false }).format(digit),
      )
      .join(String(digit));
  // Strip only known affixes, grouping and directional/spacing characters, never arbitrary letters.
  for (const part of parts) {
    if (["currency", "percentSign", "group"].includes(part.type))
      value = value.split(part.value).join("");
    if (part.type === "decimal") value = value.split(part.value).join(".");
    if (part.type === "minusSign") value = value.split(part.value).join("-");
  }
  value = value.replace(/[\s\u061c\u200e\u200f]/g, "");
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return NaN;
  const parsed = Number(value);
  return options.format === "percent" && options.percentValue === "fraction"
    ? shiftDecimal(parsed, -2)
    : parsed;
}
/** Checks the model without clamping or rounding it. Empty values are left to Validators.required. */
export function numericErrors(
  value: unknown,
  options: NumericValidationOptions = {},
): ValidationErrors | null {
  if (value === null || value === undefined || value === "") return null;
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string" &&
          /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)
        ? Number(value)
        : NaN;
  if (!Number.isFinite(number)) return { numeric: { actual: value } };
  const errors: ValidationErrors = {};
  if (options.min != null && number < options.min)
    errors["min"] = { min: options.min, actual: number };
  if (options.max != null && number > options.max)
    errors["max"] = { max: options.max, actual: number };
  const places = Math.max(
    0,
    decimalPlaces(number) - (options.percentValue === "fraction" ? 2 : 0),
  );
  if (options.precision != null && places > numberPrecision(options.precision))
    errors["precision"] = {
      requiredPrecision: numberPrecision(options.precision),
      actualPrecision: places,
    };
  if (
    options.step != null &&
    options.step > 0 &&
    Number.isFinite(options.step)
  ) {
    const steps =
      (number - (options.stepBase ?? options.min ?? 0)) / options.step;
    if (Math.abs(steps - Math.round(steps)) > 1e-8)
      errors["step"] = {
        step: options.step,
        base: options.stepBase ?? options.min ?? 0,
        actual: number,
      };
  }
  return Object.keys(errors).length ? errors : null;
}
export function numericValidator(
  options: NumericValidationOptions = {},
): ValidatorFn {
  return (control) => numericErrors(control.value, options);
}
export function precisionValidator(precision: number): ValidatorFn {
  return numericValidator({ precision });
}
export function currencyValidator(
  options: NumericValidationOptions = {},
): ValidatorFn {
  return numericValidator({ precision: 2, ...options });
}
export function percentageValidator(
  options: NumericValidationOptions = {},
): ValidatorFn {
  const fraction = options.percentValue === "fraction";
  return numericValidator({
    min: 0,
    max: fraction ? 1 : 100,
    precision: 2,
    ...options,
  });
}
