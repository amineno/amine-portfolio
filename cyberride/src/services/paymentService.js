/**
 * CYBERRIDE PAYMENT GATEWAY SERVICE (MODULE 02)
 * Handles Stripe, Telr, Tabby BNPL, and Cash on Delivery (COD) processing.
 */

// 5% UAE VAT Rate
export const UAE_VAT_RATE = 0.05;
export const COD_HANDLING_FEE_AED = 20;

/**
 * Format AED price into fils (smallest unit for Stripe API)
 * e.g. 349.00 AED -> 34900
 */
export const toStripeFils = (amountAED) => {
  return Math.round(amountAED * 100);
};

/**
 * Calculate Tabby / Tamara 4-installment breakdown
 */
export const calculateTabbyInstallments = (totalAED, installments = 4) => {
  const perMonth = Math.round((totalAED / installments) * 100) / 100;
  return {
    installments,
    monthlyAED: perMonth,
    formattedText: `Pay in 4 interest-free payments of ${perMonth.toFixed(2)} AED/mo`
  };
};

/**
 * Process Stripe PaymentIntent Session (Client & Server helper)
 */
export const createStripePaymentIntent = async ({ amountAED, orderId, customerEmail }) => {
  const filsAmount = toStripeFils(amountAED);
  
  // Simulated Stripe API Response (Production swaps with fetch('/api/webhooks/stripe'))
  return {
    success: true,
    clientSecret: `pi_live_cyberride_${orderId}_secret_${Math.random().toString(36).substring(2, 10)}`,
    paymentIntentId: `pi_live_cyberride_${orderId}`,
    amountFils: filsAmount,
    currency: 'aed',
    vatIncludedAED: Math.round((amountAED * UAE_VAT_RATE) * 100) / 100
  };
};

/**
 * Initialize Tabby BNPL Checkout Session
 */
export const createTabbyCheckoutSession = async ({ orderId, amountAED, customer }) => {
  const installments = calculateTabbyInstallments(amountAED);
  return {
    success: true,
    tabbySessionId: `tabby_sess_${orderId}`,
    redirectUrl: `https://checkout.tabby.ai/pay?sessionId=tabby_sess_${orderId}`,
    installments
  };
};

/**
 * Initialize Telr UAE Local Gateway Payload
 */
export const createTelrPaymentSession = async ({ orderId, amountAED, customer }) => {
  return {
    success: true,
    telrRef: `TELR-DXB-${orderId}`,
    redirectUrl: `https://secure.telr.com/gateway/process.html?ref=TELR-DXB-${orderId}`
  };
};

/**
 * Validate COD (Cash on Delivery) eligibility
 */
export const validateCodEligibility = (emirate, totalAED) => {
  const validEmirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
  const isEligible = validEmirates.includes(emirate);
  
  return {
    eligible: isEligible,
    codFeeAED: isEligible ? COD_HANDLING_FEE_AED : 0,
    message: isEligible 
      ? `COD available for ${emirate} (+20 AED handling fee applies)` 
      : `COD is restricted to UAE addresses only.`
  };
};
