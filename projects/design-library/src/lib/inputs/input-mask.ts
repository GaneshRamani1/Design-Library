import type { MaskedPatternOptions } from "imask";
/** Formatting presets. These do not verify that an identifier or phone number is valid. */
export type InputMaskPreset =
  | "none"
  | "ssn"
  | "itin"
  | "tin"
  | "ein"
  | "phone-us"
  | "phone-international"
  | "zip"
  | "zip-plus4"
  | "card-16"
  | "date"
  | "time";
export const INPUT_MASK_PRESETS: Readonly<
  Record<Exclude<InputMaskPreset, "none" | "tin">, string>
> = {
  ssn: "000-00-0000",
  itin: "000-00-0000",
  ein: "00-0000000",
  "phone-us": "(000) 000-0000",
  "phone-international": "+0[00000000000000]",
  zip: "00000",
  "zip-plus4": "00000-0000",
  "card-16": "0000 0000 0000 0000",
  date: "00/00/0000",
  time: "00:00",
};
export interface InputMaskValue {
  raw: string;
  formatted: string;
  complete: boolean;
}
export type InputMaskOptions = Partial<Omit<MaskedPatternOptions, "mask">>;
