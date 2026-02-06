import { BidEmailTemplateProps } from "@/_types/email-types";

export const bidOwnerNotificationTemplate = ({
  userEmail,
  registrationNumber,
  make,
  model,
  year,
  listPrice,
  bidPrice,
  featuredImageUrl,
  dealerFullName,
  dealerPhone,
}: BidEmailTemplateProps) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auto Marketplace QLD - Vehicle Bid Received</title>
    <style>
      .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
      .header { background-color: #13103F; color: white; padding: 1rem; }
      .content { padding: 1rem; }
      .field { margin-bottom: 0.5rem; }
      .label { font-weight: 500; }
      .value { font-weight: 200; font-style: italic; color: #333; }
      .section-title { font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #13103F; }
      .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666; }
      .bid-highlight { background-color: #FFFD01; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
      .vehicle-image { width: 300px; height: 200px; object-fit: cover; border-radius: 5px; margin: 1rem 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Auto Marketplace QLD</h1>
      </div>

      <div class="content">
        <h2>Vehicle Bid Received</h2>

        <p>A bid has been submitted for a vehicle through the dealer portal.</p>

        <img src="${featuredImageUrl}" alt="Vehicle" class="vehicle-image" />

        <h3 class="section-title">Bidder Details:</h3>

        ${
          dealerFullName
            ? `<div class="field">
          <span class="label">Full Name:</span>
          <span class="value">${dealerFullName}</span>
        </div>`
            : ""
        }

        <div class="field">
          <span class="label">Email:</span>
          <span class="value">${userEmail}</span>
        </div>

        ${
          dealerPhone
            ? `<div class="field">
          <span class="label">Phone:</span>
          <span class="value">${dealerPhone}</span>
        </div>`
            : ""
        }

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

        <div class="bid-highlight">
          <span class="label">Bid Amount:</span>
          <span class="value" style="font-size: 1.2rem; font-weight: bold;">${bidPrice}</span>
        </div>

        <div class="footer">
          <p>This email was generated automatically from the Auto Marketplace QLD website.</p>
          <p>Bid received: ${new Date().toLocaleString("en-AU", {
            timeZone: "Australia/Brisbane",
          })}</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};

export const bidUserConfirmationTemplate = ({
  make,
  model,
  year,
  bidPrice,
  featuredImageUrl,
  bodyType,
  transmission,
  engineCapacity,
  fuelType,
  driveType,
  colour,
  dealerFirstName,
}: BidEmailTemplateProps) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auto Marketplace QLD - Bid Confirmation</title>
    <style>
      .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
      .header { background-color: #13103F; color: white; padding: 1rem; }
      .content { padding: 1rem; }
      .field { margin-bottom: 0.5rem; }
      .label { font-weight: 500; }
      .value { font-weight: 200; font-style: italic; color: #333; }
      .section-title { font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #13103F; }
      .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666; }
      .thank-you { background-color: #f0f0f0; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
      .bid-highlight { background-color: #FFFD01; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
      .vehicle-image { width: 300px; height: 200px; object-fit: cover; border-radius: 5px; margin: 1rem 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Auto Marketplace QLD</h1>
      </div>

      <div class="content">
        <h2>Bid Confirmation</h2>

        <div class="thank-you">
          <p><strong>Thank you for your bid,${dealerFirstName ? ` ${dealerFirstName}` : ""}!</strong></p>
          <p>Your bid has been received and our team will review it and be in touch with you soon.</p>
        </div>

        <img src="${featuredImageUrl}" alt="Vehicle" class="vehicle-image" />

        <h3 class="section-title">Vehicle Details:</h3>

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

        ${
          bodyType
            ? `<div class="field">
          <span class="label">Body Type:</span>
          <span class="value">${bodyType}</span>
        </div>`
            : ""
        }

        ${
          transmission
            ? `<div class="field">
          <span class="label">Transmission:</span>
          <span class="value">${transmission}</span>
        </div>`
            : ""
        }

        ${
          engineCapacity
            ? `<div class="field">
          <span class="label">Engine Capacity:</span>
          <span class="value">${engineCapacity}L</span>
        </div>`
            : ""
        }

        ${
          fuelType
            ? `<div class="field">
          <span class="label">Fuel Type:</span>
          <span class="value">${fuelType}</span>
        </div>`
            : ""
        }

        ${
          driveType
            ? `<div class="field">
          <span class="label">Drive Type:</span>
          <span class="value">${driveType}</span>
        </div>`
            : ""
        }

        ${
          colour
            ? `<div class="field">
          <span class="label">Colour:</span>
          <span class="value">${colour}</span>
        </div>`
            : ""
        }

        <div class="bid-highlight">
          <span class="label">Your Bid:</span>
          <span class="value" style="font-size: 1.2rem; font-weight: bold;">${bidPrice}</span>
        </div>

        <h3 class="section-title">Next Steps:</h3>
        <p>If you placed the winning bid, a member of the Auto Marketplace QLD team will contact you within 1-2 business days upon the completion of the tender.</p>

        <div class="footer">
          <p>If you have any questions, please don&apos;t hesitate to contact us.</p>
          <p>Bid submitted: ${new Date().toLocaleString("en-AU", {
            timeZone: "Australia/Brisbane",
          })}</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
