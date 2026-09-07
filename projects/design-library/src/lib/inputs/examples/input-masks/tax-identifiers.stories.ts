import baseMeta, {
  SSN as SSNExample,
  ITIN as ITINExample,
  TINIndividual as TINIndividualExample,
  TINBusiness as TINBusinessExample,
  EIN as EINExample,
} from "../../input-masks.examples";
export default {
  ...baseMeta,
  id: "inputs-input-mask-examples-tax-identifiers",
  title: "Inputs/Input/Variations/Mask examples/Tax identifiers",
};
export const SSN = SSNExample;
export const ITIN = ITINExample;
export const TINIndividual = TINIndividualExample;
export const TINBusiness = TINBusinessExample;
export const EIN = EINExample;
