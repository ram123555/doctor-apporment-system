const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        msg: "All fields are required"
      });
    }

    console.log("📩 Contact form received:", req.body);

    /* ==============================
       EMAIL TRANSPORTER
    ============================== */

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000
    });

    /* ==============================
       EMAIL TO ADMIN
    ============================== */

    const mailOptions = {
      from: `"HealthCare Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Message - HealthCare",

      html: `
      <div style="font-family:Arial;background:#f5f7fb;padding:30px">

        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1)">

          <div style="background:linear-gradient(135deg,#0bbcd6,#00b894);padding:20px;color:white;text-align:center">
            <h2>🏥 HealthCare Contact Message</h2>
          </div>

          <div style="padding:25px">

            <h3 style="color:#333">New Message Received</h3>

            <table style="width:100%;border-collapse:collapse;margin-top:15px">

              <tr>
                <td style="padding:10px;border-bottom:1px solid #eee"><b>Name</b></td>
                <td style="padding:10px;border-bottom:1px solid #eee">${name}</td>
              </tr>

              <tr>
                <td style="padding:10px;border-bottom:1px solid #eee"><b>Email</b></td>
                <td style="padding:10px;border-bottom:1px solid #eee">${email}</td>
              </tr>

              <tr>
                <td style="padding:10px;border-bottom:1px solid #eee"><b>Phone</b></td>
                <td style="padding:10px;border-bottom:1px solid #eee">${phone}</td>
              </tr>

              <tr>
                <td style="padding:10px;border-bottom:1px solid #eee"><b>Message</b></td>
                <td style="padding:10px;border-bottom:1px solid #eee">${message}</td>
              </tr>

            </table>

          </div>

          <div style="background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777">
            © ${new Date().getFullYear()} HealthCare System
          </div>

        </div>

      </div>
      `
    };

    /* ==============================
       AUTO REPLY EMAIL
    ============================== */

    const autoReply = {
      from: `"HealthCare Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting HealthCare",

      html: `
      <div style="font-family:Arial;background:#f5f7fb;padding:30px">

        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden">

          <div style="background:linear-gradient(135deg,#0bbcd6,#00b894);padding:20px;color:white;text-align:center">
            <h2>🏥 HealthCare</h2>
          </div>

          <div style="padding:25px">

            <h3>Hello ${name},</h3>

            <p>
            Thank you for contacting <b>HealthCare</b>.
            </p>

            <p>
            We have received your message and our team will respond within <b>24 hours</b>.
            </p>

            <hr>

            <p>
            📞 Phone: +91 9876543210<br>
            ✉ Email: ${process.env.EMAIL_USER}
            </p>

            <p>
            Best regards,<br>
            <b>HealthCare Support Team</b>
            </p>

          </div>

        </div>

      </div>
      `
    };

    /* ==============================
       SEND EMAILS
    ============================== */

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReply);

    console.log("✅ Email sent successfully");

    res.json({
      msg: "Message sent successfully"
    });

  } catch (error) {

    console.error("❌ Email error:", error);

    res.status(500).json({
      msg: "Failed to send email"
    });

  }

});

module.exports = router;