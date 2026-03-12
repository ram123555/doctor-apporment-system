const express = require("express");
const { Resend } = require("resend");

const router = express.Router();

const resend = new Resend("re_da5tHxY1_NDPARPxQifpTNtgfgybaEEt3");

router.post("/", async (req, res) => {

  try {

    const { name, email, phone, message } = req.body;

    console.log("Contact request:", req.body);

    // ==========================
    // EMAIL TO ADMIN
    // ==========================

    await resend.emails.send({
      from: "HealthCare <onboarding@resend.dev>",
      to: "ramkrishnatah9232@gmail.com",
      subject: "New Contact Message - HealthCare",

      html: `
      <div style="font-family:Arial;background:#f5f7fb;padding:30px">

        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1)">

          <div style="background:linear-gradient(135deg,#0bbcd6,#00b894);padding:20px;color:white;text-align:center">
            <h2>🏥 HealthCare Contact Message</h2>
          </div>

          <div style="padding:25px">

            <h3>New Message Received</h3>

            <table style="width:100%;border-collapse:collapse;margin-top:15px">

              <tr>
                <td style="padding:10px"><b>Name</b></td>
                <td style="padding:10px">${name}</td>
              </tr>

              <tr>
                <td style="padding:10px"><b>Email</b></td>
                <td style="padding:10px">${email}</td>
              </tr>

              <tr>
                <td style="padding:10px"><b>Phone</b></td>
                <td style="padding:10px">${phone}</td>
              </tr>

              <tr>
                <td style="padding:10px"><b>Message</b></td>
                <td style="padding:10px">${message}</td>
              </tr>

            </table>

          </div>

        </div>

      </div>
      `
    });

    // ==========================
    // AUTO REPLY EMAIL
    // ==========================

    await resend.emails.send({

      from: "HealthCare <<anything>@woopama.resend.app>",
      to: email,
      subject: "Thank you for contacting HealthCare",

      html: `
      <div style="font-family:Arial;background:#f5f7fb;padding:30px">

        <div style="max-width:600px;margin:auto;background:white;border-radius:10px">

          <div style="background:linear-gradient(135deg,#0bbcd6,#00b894);padding:20px;color:white;text-align:center">
            <h2>🏥 HealthCare</h2>
          </div>

          <div style="padding:25px">

            <h3>Hello ${name},</h3>

            <p>
            Thank you for contacting <b>HealthCare</b>.
            </p>

            <p>
            We received your message and our support team will reply within <b>24 hours</b>.
            </p>

            <p>
            📞 Phone: +91 9876543210 <br>
            ✉ Email: support@healthcare.com
            </p>

            <p>
            Best regards,<br>
            <b>HealthCare Support Team</b>
            </p>

          </div>

        </div>

      </div>
      `
    });

    res.json({
      msg: "Message sent successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Failed to send email"
    });

  }

});

module.exports = router;