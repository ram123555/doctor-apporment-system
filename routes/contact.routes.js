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

    console.log("Contact request:", req.body);

    /* ===============================
       EMAIL TRANSPORTER
    =============================== */

    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ramkrishnatah9232@gmail.com",
    pass: "lgub bfxr vlih aiaz"
  },
  tls: {
    rejectUnauthorized: false
  },

      connectionTimeout: 10000

    });

    /* ===============================
       EMAIL TO ADMIN
    =============================== */

    const mailOptions = {

      from: `"HealthCare Contact" <ramkrishnatah9232@gmail.com>`,

      to: "ramkrishnatah9232@gmail.com",

      subject: "New Contact Message - HealthCare",

      html: `
      <div style="font-family:Arial;background:#f5f7fb;padding:30px">

        <div style="max-width:600px;margin:auto;background:white;border-radius:10px">

          <div style="background:linear-gradient(135deg,#0bbcd6,#00b894);padding:20px;color:white;text-align:center">
            <h2>🏥 HealthCare Contact Message</h2>
          </div>

          <div style="padding:25px">

            <h3>New Message Received</h3>

            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Phone:</b> ${phone}</p>
            <p><b>Message:</b> ${message}</p>

          </div>

          <div style="background:#f1f1f1;padding:15px;text-align:center;font-size:12px">
            © ${new Date().getFullYear()} HealthCare System
          </div>

        </div>

      </div>
      `
    };

    /* ===============================
       AUTO REPLY EMAIL
    =============================== */

    const autoReply = {

      from: `"HealthCare Support" <ramkrishnatah9232@gmail.com>`,

      to: email,

      subject: "Thank you for contacting HealthCare",

      html: `
      <div style="font-family:Arial;padding:30px">

        <h2>Hello ${name},</h2>

        <p>Thank you for contacting <b>HealthCare</b>.</p>

        <p>We received your message and will respond within <b>24 hours</b>.</p>

        <hr>

        <p>
        📞 Phone: +91 9876543210 <br/>
        ✉ Email: ramkrishnatah9232@gmail.com
        </p>

        <p>
        Best regards,<br/>
        HealthCare Support Team
        </p>

      </div>
      `
    };

    /* ===============================
       SEND EMAIL
    =============================== */

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReply);

    console.log("Email sent successfully");

    res.json({
      msg: "Message sent successfully"
    });

  } catch (error) {

    console.log("Email error:", error);

    res.status(500).json({
      msg: "Failed to send email"
    });

  }

});

module.exports = router;