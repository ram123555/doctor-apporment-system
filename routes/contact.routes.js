const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res) => {

    try {


        const { name, email, phone, message } = req.body;

        // ==============================
        // EMAIL TRANSPORTER
        // ==============================

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ramkrishnatah9232@gmail.com",
                pass: "lgub bfxr vlih aiaz"
            }
        });

        // ==============================
        // EMAIL TO ADMIN
        // ==============================

        const mailOptions = {
            from: email,
            to: "ramkrishnatah9232@gmail.com",
            subject: "New Contact Message - HealthCare",

            html: `
  <div style="font-family:Arial;background:#f5f7fb;padding:30px">

    <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1)">

      <div style="background:linear-gradient(135deg,#0bbcd6,#00b894);padding:20px;color:white;text-align:center">
        <h2>🏥 HealthCare Contact Message</h2>
      </div>

      <div style="padding:25px">

        <h3 style="color:#333">New Message Received</h3>

        <p style="color:#555">
        A new message has been sent from your website contact form.
        </p>

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
        <br/>
        This message was sent from your website contact form.
      </div>

    </div>

  </div>
  `
        };

        // ==============================
        // AUTO REPLY EMAIL TO USER
        // ==============================

        const autoReply = {
            from: "ramkrishnatah9232@gmail.com",
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

        <p>
        If your issue is urgent please contact us directly.
        </p>

        <hr>

        <p>
        📞 Phone: +91 9876543210<br>
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
        };




        await transporter.sendMail(mailOptions);
        await transporter.sendMail(autoReply);

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
