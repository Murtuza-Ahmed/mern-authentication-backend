export function generateEmailTemplate(verificationCode) {
  return `<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <!-- Outer wrapper table (100% width) -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <!-- Inner container (max-width 600px) -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-inline-size:600px;inline-size:100%;border-collapse:collapse;background-color:#ffffff;border-radius:8px;overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="padding:18px 24px;background-color:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <!-- Logo: replace href/src with your own -->
                      <a href="#" style="display:inline-block;text-decoration:none;">
                        <img src="https://via.placeholder.com/160x40?text=LOGO" alt="Company Logo" width="160" height="40" style="display:block;border:0;outline:none;text-decoration:none;">
                      </a>
                    </td>
                    <td align="right" style="vertical-align:middle;font-size:13px;color:#6b7280;">
                      <!-- Small preheader or helper text -->
                      <span style="color:#6b7280;">Welcome to our product</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Hero -->
            <tr>
              <td style="padding:28px 24px 20px;background:linear-gradient(180deg,#0ea5a4 0%,#06b6d4 100%);color:#ffffff;text-align:start;">
                <h1 style="margin:0;font-size:22px;line-height:28px;font-weight:700;">Welcome aboard, <span style="color:#fff;">we're glad you're here</span>${verificationCode}</h1>
                <p style="margin:12px 0 0;font-size:15px;line-height:22px;color:rgba(255,255,255,0.95);max-inline-size:520px;">
                  You're all set to explore the best features we offer. Below is a quick start to help you get going — one click and you're in.
                </p>
              </td>
            </tr>

            <!-- Content block -->
            <tr>
              <td style="padding:22px 24px 16px;background-color:#ffffff;">
                <p style="margin:0 0 16px;font-size:15px;line-height:22px;color:#374151;">
                  Hi there — thank you for joining. To complete your setup and see your dashboard, click the button below. If you have any questions, reply to this email and our team will help you out.
                </p>

                <!-- CTA button (table-based for better email client support) -->
                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td align="center" style="border-radius:6px;background-color:#0ea5a4;">
                      <a href="#" style="display:inline-block;padding:12px 22px;font-size:15px;color:#ffffff;text-decoration:none;font-weight:600;border-radius:6px;">
                        Go to Dashboard
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 24px;">
                <hr style="border:none;border-block-start:1px solid #eef2f7;margin:0;">
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 24px 28px;background-color:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="font-size:13px;color:#6b7280;line-height:18px;">
                      <strong style="color:#111827;">Need help?</strong><br>
                      Contact our support at <a href="mailto:support@example.com" style="color:#0ea5a4;text-decoration:none;">support@example.com</a>
                    </td>

                    <td align="right" style="vertical-align:middle;">
                      <!-- Social icons as styled text circles (replace hrefs) -->
                      <a href="#" style="display:inline-block;text-decoration:none;margin-inline-start:8px;">
                        <span style="display:inline-block;inline-size:34px;block-size:34px;line-height:34px;border-radius:50%;background:#111827;color:#ffffff;font-size:14px;text-align:center;">f</span>
                      </a>
                      <a href="#" style="display:inline-block;text-decoration:none;margin-inline-start:8px;">
                        <span style="display:inline-block;inline-size:34px;block-size:34px;line-height:34px;border-radius:50%;background:#111827;color:#ffffff;font-size:14px;text-align:center;">in</span>
                      </a>
                      <a href="#" style="display:inline-block;text-decoration:none;margin-inline-start:8px;">
                        <span style="display:inline-block;inline-size:34px;block-size:34px;line-height:34px;border-radius:50%;background:#111827;color:#ffffff;font-size:14px;text-align:center;">t</span>
                      </a>
                    </td>
                  </tr>

                  <!-- Copyright -->
                  <tr>
                    <td colspan="2" style="padding-block-start:14px;font-size:12px;color:#9ca3af;">
                      © <span id="year">2025</span> Your Company Name. All rights reserved.<br>
                      <span style="color:#9ca3af;">1234 Street Name, City, Country</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>`
}