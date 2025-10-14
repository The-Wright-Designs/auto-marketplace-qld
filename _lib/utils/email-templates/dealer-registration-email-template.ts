import { HTMLSanitizer } from "@/_lib/utils/html-sanitizer";

interface DealerRegistrationEmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licensedDealer: string;
  interestedIn: string;
}

export const dealerRegistrationEmailTemplate = ({
  firstName,
  lastName,
  email,
  phone,
  licensedDealer,
  interestedIn,
}: DealerRegistrationEmailTemplateProps) => {
  const sanitizedData = {
    firstName: HTMLSanitizer.sanitizeForEmail(firstName),
    lastName: HTMLSanitizer.sanitizeForEmail(lastName),
    email: HTMLSanitizer.sanitizeEmail(email),
    phone: HTMLSanitizer.sanitizePhoneNumber(phone),
    licensedDealer: HTMLSanitizer.sanitizeForEmail(licensedDealer),
    interestedIn: HTMLSanitizer.sanitizeForEmail(interestedIn),
  };

  const fullName = `${sanitizedData.firstName} ${sanitizedData.lastName}`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auto Marketplace QLD - Dealer Registration Application</title>
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
      .status-badge { display: inline-block; padding: 0.25rem 0.5rem; background-color: #f0f0f0; border-radius: 0.25rem; font-size: 0.9rem; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Auto Marketplace QLD</h1>
      </div>

      <div class="content">
        <h2>Dealer Registration Application</h2>

        <div class="field">
          <span class="label">Full Name:</span>
          <span class="value">${fullName}</span>
        </div>

        <div class="field">
          <span class="label">Email:</span>
          <span class="value">${sanitizedData.email}</span>
        </div>

        <div class="field">
          <span class="label">Phone:</span>
          <span class="value">${sanitizedData.phone}</span>
        </div>

        <div class="field">
          <span class="label">Licensed Dealer:</span>
          <span class="status-badge">${sanitizedData.licensedDealer === "yes" ? "Yes" : "No"}</span>
        </div>

        <div class="field">
          <span class="label">Interested In:</span>
          <span class="status-badge">${sanitizedData.interestedIn.charAt(0).toUpperCase() + sanitizedData.interestedIn.slice(1)}</span>
        </div>

        <div class="section-title">Application Details</div>
        <p>A new dealer has submitted a registration application through the Auto Marketplace QLD website. Please review their information and follow up accordingly.</p>

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