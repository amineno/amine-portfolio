/**
 * CYBERRIDE SMS NOTIFICATION SERVICE (MODULE 04)
 * Formats and dispatches SMS alerts for UAE mobile numbers (+971).
 */

/**
 * Format local UAE mobile numbers to standard E.164 (+97150XXXXXXX)
 */
export const formatUaePhoneNumber = (phone) => {
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('05')) {
    cleaned = '+971' + cleaned.substring(1);
  } else if (cleaned.startsWith('5')) {
    cleaned = '+971' + cleaned;
  } else if (!cleaned.startsWith('+971') && cleaned.length === 9) {
    cleaned = '+971' + cleaned;
  }
  
  return cleaned;
};

/**
 * Build SMS Notification Payload
 */
export const buildDispatchSmsPayload = (order) => {
  const formattedPhone = formatUaePhoneNumber(order.phone);
  
  return {
    to: formattedPhone,
    senderId: 'CyberRide',
    body: `CyberRide: Order #${order.id} for AED ${order.total} is dispatched via Aramex! Tracking: ${order.tracking || 'ARM-DXB-LIVE'}. Support: +971 50 000 0000`
  };
};
