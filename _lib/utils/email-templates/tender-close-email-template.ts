import { TenderCloseEmailTemplateProps } from "@/_types/email-types";

export const tenderCloseEmailTemplate = ({
  make,
  model,
  year,
  registrationNumber,
  featuredImageUrl,
  listPrice,
  reservePrice,
  tenderDeadline,
  bids,
}: TenderCloseEmailTemplateProps) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auto Marketplace QLD - Tender Closed</title>
    <style>
      .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
      .header { background-color: #13103F; color: white; padding: 1rem; }
      .content { padding: 1rem; }
      .field { margin-bottom: 0.5rem; }
      .label { font-weight: 500; }
      .value { font-weight: 200; font-style: italic; color: #333; }
      .section-title { font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #13103F; }
      .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666; }
      .vehicle-image { width: 300px; height: 200px; object-fit: cover; border-radius: 5px; margin: 1rem 0; }
      .bids-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
      .bids-table th { background-color: #13103F; color: white; padding: 0.5rem; text-align: left; }
      .bids-table td { padding: 0.5rem; border-bottom: 1px solid #eee; }
      .winner-row { background-color: #FFFD01; }
      .no-bids { background-color: #f0f0f0; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Auto Marketplace QLD</h1>
      </div>

      <div class="content">
        <h2>Tender Closed - Top Bidders</h2>

        <p>The tender has closed for the following vehicle.${bids.length > 0 ? ` Below are the top qualifying bidder${bids.length > 1 ? 's' : ''} that met the reserve price.` : ''}</p>

        <img src="${featuredImageUrl}" alt="Vehicle" class="vehicle-image" />

        <h3 class="section-title">Vehicle Details:</h3>

        ${registrationNumber ? `<div class="field">
          <span class="label">Registration Number:</span>
          <span class="value">${registrationNumber}</span>
        </div>` : ''}

        <div class="field">
          <span class="label">Make:</span>
          <span class="value">${make}</span>
        </div>

        <div class="field">
          <span class="label">Model:</span>
          <span class="value">${model}</span>
        </div>

        <div class="field">
          <span class="label">Year:</span>
          <span class="value">${year}</span>
        </div>

        <div class="field">
          <span class="label">List Price:</span>
          <span class="value">${listPrice}</span>
        </div>

        ${reservePrice ? `<div class="field">
          <span class="label">Reserve Price:</span>
          <span class="value">${reservePrice}</span>
        </div>` : ''}

        <div class="field">
          <span class="label">Tender Deadline:</span>
          <span class="value">${tenderDeadline}</span>
        </div>

        <h3 class="section-title">Bidding Results:</h3>

        ${bids.length > 0 ? `
        <table class="bids-table">
          <tr>
            <th style="width: 10%;">#</th>
            <th style="width: 25%;">Dealer</th>
            <th style="width: 40%;">Contact</th>
            <th style="width: 25%; text-align: right;">Bid</th>
          </tr>
          ${bids.map((bid) => `
          <tr${bid.rank === 1 ? ' class="winner-row"' : ''}>
            <td><strong>${bid.rank}</strong></td>
            <td>${bid.dealerName}</td>
            <td>
              ${bid.dealerEmail}<br />
              ${bid.dealerPhone}
            </td>
            <td style="text-align: right;"><strong>${bid.bidPrice}</strong></td>
          </tr>
          `).join('')}
        </table>
        ` : `
        <div class="no-bids">
          <p><strong>${reservePrice ? `No bids met the reserve price of ${reservePrice}.` : 'No bids were received for this tender.'}</strong></p>
        </div>
        `}

        <div class="footer">
          <p>This email was generated automatically from the Auto Marketplace QLD website.</p>
          <p>Generated: ${new Date().toLocaleString("en-AU", {
            timeZone: "Australia/Brisbane",
          })}</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
