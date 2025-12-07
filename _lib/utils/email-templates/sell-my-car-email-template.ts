import { SellMyCarEmailTemplateProps } from "@/_types/email-types";

export const sellMyCarEmailTemplate = ({
  name,
  email,
  contactNumber,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  fuelType,
  transmission,
}: SellMyCarEmailTemplateProps) => {

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auto Marketplace QLD - Vehicle Sell Request</title>
    <style>
      /* Inline CSS for better email client support */
      .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
      .header { background-color: #13103F; color: white; padding: 1rem; }
      .content { padding: 1rem; }
      .field { margin-bottom: 0.5rem; }
      .label { font-weight: 500; }
      .value { font-weight: 200; font-style: italic; color: #333; }
      .section-title { font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #13103F; }
      .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Auto Marketplace QLD</h1>
      </div>
      
      <div class="content">
        <h2>Vehicle Sell Request</h2>
        
        <div class="field">
          <span class="label">Name:</span>
          <span class="value">${name}</span>
        </div>

        <div class="field">
          <span class="label">Email:</span>
          <span class="value">${email}</span>
        </div>

        <div class="field">
          <span class="label">Contact Number:</span>
          <span class="value">${contactNumber}</span>
        </div>

        <h3 class="section-title">Vehicle Information:</h3>

        <div class="field">
          <span class="label">Make:</span>
          <span class="value">${vehicleMake}</span>
        </div>

        <div class="field">
          <span class="label">Model:</span>
          <span class="value">${vehicleModel}</span>
        </div>

        <div class="field">
          <span class="label">Year:</span>
          <span class="value">${vehicleYear}</span>
        </div>

        <div class="field">
          <span class="label">Fuel Type:</span>
          <span class="value">${fuelType}</span>
        </div>

        <div class="field">
          <span class="label">Transmission:</span>
          <span class="value">${transmission}</span>
        </div>
        
        <h3 class="section-title">Vehicle Images:</h3>
        <p>Vehicle images are attached to this email for review.</p>
        
        <div class="footer">
          <p>This email was generated automatically from the Auto Marketplace QLD website.</p>
          <p>Submission time: ${new Date().toLocaleString("en-AU", {
            timeZone: "Australia/Brisbane",
          })}</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
