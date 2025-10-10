import { Vendor } from "@/types";

/**
 * Check if vendor is currently Pro (includes active trial period)
 * @param vendor - Vendor object with subscription fields
 * @returns true if vendor has Pro benefits (paid or trial)
 */
export function isVendorPro(
  vendor: Pick<Vendor, "subscription_tier" | "is_trial" | "trial_end_date">
): boolean {
  // During trial period, treat as Pro
  if (vendor.is_trial && vendor.trial_end_date) {
    const trialEndDate = new Date(vendor.trial_end_date);
    if (trialEndDate > new Date()) {
      return true;
    }
  }

  // After trial, check subscription tier
  if (!vendor.is_trial && vendor.subscription_tier === "pro") {
    return true;
  }

  return false;
}

/**
 * Check if vendor's trial has expired
 * @param vendor - Vendor object with trial fields
 * @returns true if trial has expired
 */
export function isTrialExpired(
  vendor: Pick<Vendor, "is_trial" | "trial_end_date">
): boolean {
  if (!vendor.is_trial) return false;

  if (vendor.trial_end_date) {
    return new Date(vendor.trial_end_date) < new Date();
  }

  return false;
}

/**
 * Get days remaining in trial period
 * @param vendor - Vendor object with trial_end_date
 * @returns number of days remaining (0 if expired or no trial)
 */
export function getDaysRemainingInTrial(
  vendor: Pick<Vendor, "trial_end_date">
): number {
  if (!vendor.trial_end_date) return 0;

  const trialEnd = new Date(vendor.trial_end_date);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Check if vendor account is locked (trial expired and on Starter tier)
 * @param vendor - Vendor object with subscription fields
 * @returns true if account is locked and cannot use dashboard
 */
export function isVendorAccountLocked(
  vendor: Pick<Vendor, "subscription_tier" | "is_trial" | "trial_end_date">
): boolean {
  // Trial expired and on Starter tier = locked
  if (isTrialExpired(vendor) && vendor.subscription_tier === "starter") {
    return true;
  }

  return false;
}

/**
 * Get subscription status display text
 * @param vendor - Vendor object with subscription fields
 * @returns human-readable status text
 */
export function getSubscriptionStatus(
  vendor: Pick<Vendor, "subscription_tier" | "is_trial" | "trial_end_date">
): string {
  if (vendor.is_trial && vendor.trial_end_date) {
    const daysRemaining = getDaysRemainingInTrial(vendor);
    if (daysRemaining > 0) {
      return `Prueba Pro (${daysRemaining} días restantes)`;
    } else {
      return "Prueba expirada";
    }
  }

  if (vendor.subscription_tier === "pro") {
    return "Plan Pro";
  }

  return "Plan Starter";
}
