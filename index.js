const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.send("deu certo"));

app.post("/api/send-email", async (req, res) => {
  const { to, name, currentPrice } = req.body;

  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transport.sendMail({
      from: `<${process.env.EMAIL}>`,
      to,
      subject: "Alerta de preço!",
      html: `<h1>O ativo ${name} mudou de preço.</h1> <h3>Valor atual: ${currentPrice}</h3>`,
      text: `O ativo ${name} mudou de preço. Valor atual: ${currentPrice}`,
    });

    res.status(200).json({ message: "Email enviado com sucesso" });
  } catch (error) {
    console.error("Erro ao enviar o email:", error);
    res.status(500).json({ error: "Erro ao enviar o email" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
