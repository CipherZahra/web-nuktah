import { PACKAGE_IDS } from "@/lib/config";

export interface PricingPlan {
  name: string;
  credits: string;
  creditsUnit: string;
  price: string;
  priceUnit: string;
  tag: string;
}

/**
 * Card meta line for a plan; the custom pack omits the price (it is set in
 * the TopUp modal). Returns undefined for a null/missing index.
 */
export function packMetaOf(
  plans: PricingPlan[],
  idx: number | null,
): string | undefined {
  if (idx === null) return undefined;
  const plan = plans[idx];
  if (!plan) return undefined;
  const base = `${plan.credits} ${plan.creditsUnit}`;
  return PACKAGE_IDS[idx] === "custom"
    ? base
    : `${base} · ${plan.price} ${plan.priceUnit}`;
}
