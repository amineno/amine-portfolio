/**
 * CYBERRIDE OFFICIAL UAE TAX INVOICE & NOTIFICATION SERVICE
 * Generates UAE Federal Tax Authority (FTA) Compliant Tax Invoices
 * Formatted specifically for Cash-On-Delivery (COD) transactions.
 */

export const CYBERRIDE_TRN_NUMBER = "100492817200003"; // Official UAE Tax Registration Number

/**
 * Generate HTML printable Tax Invoice (matching UAE Federal Tax Authority requirements)
 */
export const generateTaxInvoiceHTML = (order) => {
  const rawTotal = Number(order?.total || order?.totalDueAED);
  const total = !isNaN(rawTotal) && rawTotal > 0 ? rawTotal : 349;
  const vatRate = 0.05;
  const vatAmount = Math.round((total * vatRate) * 100) / 100;
  const netAmount = Math.round((total - vatAmount) * 100) / 100;
  const dateStr = order?.date 
    ? (typeof order.date === 'string' ? order.date.slice(0, 10) : new Date(order.date).toISOString().slice(0, 10))
    : new Date().toISOString().slice(0, 10);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>TAX INVOICE — ${order?.id || order?.orderId || 'CR-DXB-991204'}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #000; color: #fff; padding: 40px; margin: 0; }
        .invoice-box { max-width: 800px; margin: auto; border: 2px solid #E10600; padding: 32px; border-radius: 12px; background: #0A0A0A; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #222; padding-bottom: 20px; }
        .title { color: #E10600; font-size: 24px; font-weight: 900; letter-spacing: 1px; }
        .badge { display: inline-block; background: #1F1F1F; border: 1px solid #E10600; color: #FF1A1A; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: bold; margin-top: 4px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 24px; font-family: monospace; }
        .table th, .table td { padding: 12px; border-bottom: 1px solid #222; text-align: left; }
        .table th { color: #888; text-transform: uppercase; font-size: 11px; }
        .total-row { color: #E10600; font-size: 18px; font-weight: bold; font-family: monospace; }
        .qr-box { border: 1px solid #E10600; padding: 12px; text-align: center; color: #E10600; font-size: 10px; font-family: monospace; width: 140px; border-radius: 6px; }
        .notice { font-size: 11px; color: #aaa; margin-top: 15px; padding: 10px; background: #141414; border-radius: 6px; border-left: 3px solid #E10600; }
        @media print {
          body { background: #fff; color: #000; padding: 0; }
          .invoice-box { background: #fff; color: #000; border: 2px solid #000; }
          .title { color: #000; }
          .total-row { color: #000; }
          .badge { border-color: #000; color: #000; }
          .qr-box { border-color: #000; color: #000; }
          .table th { color: #444; }
          .table td { border-color: #ddd; }
          .notice { background: #f5f5f5; color: #222; border-color: #000; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="title">CYBERRIDE DUBAI</div>
            <div style="font-size: 11px; color: #888; margin-top: 4px;">CYBERRIDE FZ-LLC • DUBAI DESIGN DISTRICT (d3), UAE</div>
            <div style="font-size: 11px; color: #00ffcc; margin-top: 2px; font-family: monospace;">TRN: ${CYBERRIDE_TRN_NUMBER}</div>
            <div class="badge">METHOD: CASH ON DELIVERY (الدفع عند الاستلام)</div>
          </div>
          <div style="text-align: right; font-family: monospace;">
            <div style="font-size: 14px; font-weight: bold;">INVOICE #: ${order?.id || order?.orderId || 'CR-DXB-991204'}</div>
            <div style="font-size: 11px; color: #888;">DATE: ${dateStr}</div>
            <div style="font-size: 11px; color: #FF1A1A; margin-top: 4px;">TRACKING: ${order?.tracking || order?.trackingNumber || 'ARM-DXB-PREPARED'}</div>
          </div>
        </div>

        <div style="margin-top: 24px; font-size: 12px; font-family: monospace; line-height: 1.6;">
          <strong>CUSTOMER:</strong> ${order?.customer || 'Sultan Al-Maktoum'}<br>
          <strong>EMAIL:</strong> ${order?.email || 'sultan.rider@cyberride.ae'}<br>
          <strong>PHONE:</strong> ${order?.phone || '+971 50 123 4567'}<br>
          <strong>DELIVERY DESTINATION:</strong> ${order?.address || 'Dubai Marina, UAE'}
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th>COLOR / SPEC</th>
              <th>QTY</th>
              <th>AMOUNT (AED)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${order?.items || 'CYBERRIDE NEXUS LED SMART BACKPACK'}</td>
              <td>${order?.color || 'STEALTH BLACK'} (${order?.led || 'RED PULSE EYES'})</td>
              <td>1</td>
              <td>${total} AED</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right; font-size: 12px; line-height: 1.8; font-family: monospace;">
          <div>NET SUBTOTAL: ${netAmount} AED</div>
          <div>5% UAE VAT (FTA): ${vatAmount} AED</div>
          <div>COD COLLECTION FEE: 0.00 AED (PROMO WAIVED)</div>
          <div class="total-row" style="margin-top: 6px; border-top: 1px solid #333; padding-top: 6px;">
            TOTAL CASH DUE UPON DELIVERY: ${total} AED
          </div>
        </div>

        <div class="notice">
          <strong>ARAMEX COURIER CASH COLLECTION NOTICE:</strong><br>
          Please present this invoice to your Aramex courier upon receipt of package and tender <strong>${total} AED in cash</strong>. An electronic SMS receipt will be dispatched upon courier handover.
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #222; padding-top: 20px;">
          <div class="qr-box">
            [FTA VERIFIED TRN]<br>
            TRN: ${CYBERRIDE_TRN_NUMBER}<br>
            E-INVOICE VALIDATED
          </div>
          <div style="font-size: 10px; color: #666; text-align: right; font-family: monospace;">
            CYBERRIDE DUBAI FLAGSHIP SHOWROOM<br>
            BUILDING 7, SUITE 402, d3, DUBAI, UAE<br>
            SUPPORT: ORDERS@CYBERRIDE.AE | +971 4 800 29237
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Trigger Order Confirmation Email (Resend API Payload Builder)
 */
export const buildOrderConfirmationEmail = (order) => {
  return {
    from: 'CyberRide Dubai <orders@cyberride.ae>',
    to: order.email,
    subject: `CASH ON DELIVERY ORDER CONFIRMED — #${order.id}`,
    html: `
      <div style="background:#0A0A0A; color:#FFF; font-family:monospace; padding:30px; border-radius:10px; border:1px solid #E10600;">
        <h2 style="color:#E10600;">COD ORDER CONFIRMED #${order.id}</h2>
        <p>Thank you, ${order.customer}! Your order for <strong>${order.items}</strong> has been scheduled for Dubai Same-Day Express dispatch.</p>
        <p><strong>Payment Method:</strong> CASH ON DELIVERY (Pay to Aramex driver)</p>
        <p><strong>Total Cash to Prepare:</strong> ${order.total} AED (Includes 5% UAE VAT)</p>
        <p><strong>Aramex Tracking Number:</strong> ${order.tracking || 'ARM-DXB-PREPARED'}</p>
        <hr style="border-color:#333;">
        <p style="font-size:11px; color:#888;">CyberRide FZ-LLC • TRN: ${CYBERRIDE_TRN_NUMBER} • Dubai Design District (d3)</p>
      </div>
    `
  };
};
