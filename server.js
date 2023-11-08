require("dotenv").config();

const cors = require("cors");
const express = require("express");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "haiquytruong@gmail.com",
    pass: process.env.APPLICATION_PASSWORD,
  },
});

app.post("/mail", async (req, res) => {
  const { name, email, content } = req.body;
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);

  const mails = await prisma.mail.findMany({
    where: {
      ip: req.ip,
      created_at: {
        gte: date,
      },
    },
  });

  console.log({ mails });

  if (mails.length > 5) {
    return res.status(200).json("I've received your contact");
  }

  const mailOptions = {
    from: "haiquytruong@gmail.com",
    to: "haitruong.tech@gmail.com",
    subject: `${name} wants to contact`,
    text: `${content}\nFrom: ${email},\n${name}`,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json("Send mail failed");
    }
    console.log("Email sent: " + JSON.stringify(info, null, 2));
    const result = await prisma.mail.create({
      data: {
        email,
        ip: req.ip,
        name,
        content,
      },
    });

    console.log({ result });
    res.json(result);
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
