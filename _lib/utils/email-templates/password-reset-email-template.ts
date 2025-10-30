interface PasswordResetEmailData {
  resetLink: string;
  userName?: string;
}

export function passwordResetEmailTemplate({
  resetLink,
  userName,
}: PasswordResetEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Auto Marketplace QLD</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px; max-width: 600px;">
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <a href="https://automarketplaceqld.com.au" target="_blank" style="display: inline-block;">
                      <img src="https://auto-marketplace-qld.netlify.app//logo/amq-logo.png" alt="Auto Marketplace QLD" width="200" height="200" style="display: block; max-width: 100%; height: auto;" border="0">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h1 style="color: #1f2937; font-size: 32px; font-weight: bold; margin: 0 0 30px; text-align: center;">
                      Reset Your Password
                    </h1>
                    
                    <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 16px 0;">
                      ${userName ? `Hi ${userName},` : "Hi,"}
                    </p>
                    
                    <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 16px 0;">
                      To activate your Auto Marketplace QLD dealer account, click the button below to create a new password.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetLink}" style="background-color: #2563eb; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 32px; display: inline-block;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 16px 0;">
                      This link will expire in 1 hour for security reasons.
                    </p>

                    <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 16px 0;">
                      If you didn't request a password reset, you can safely ignore this email.
                      Your password will remain unchanged.
                    </p>

                    <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin: 16px 0;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    
                    <p style="color: #2563eb; font-size: 14px; word-break: break-all; margin: 16px 0;">
                      ${resetLink}
                    </p>

                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;">

                    <p style="color: #6b7280; font-size: 14px; line-height: 24px; margin: 0; text-align: center;">
                      Auto Marketplace QLD<br>
                      <a href="https://automarketplaceqld.com.au" style="color: #2563eb; text-decoration: underline;">
                        automarketplaceqld.com.au
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
