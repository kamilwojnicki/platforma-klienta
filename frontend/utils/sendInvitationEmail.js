// utils/sendInvitationEmail.js
import nodemailer from 'nodemailer';

export async function sendInvitationEmail(email, token, recordId, clientName) {
  // Konfiguracja transportera SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true dla portu 465, false dla innych
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Link aktywacyjny – możesz zbudować go według swoich potrzeb
  const activationLink = `http://localhost:3000/activate?token=${token}&id=${recordId}&client=${encodeURIComponent(clientName)}`;

  // Konfiguracja maila
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Aktywacja konta w Power Canvas',
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2>Witaj!</h2>
        <p>Otrzymaliśmy Twoje zamówienie i utworzyliśmy dla Ciebie konto w naszej platformie.</p>
        <p>Aby aktywować konto, kliknij poniższy przycisk:</p>
        <a href="${activationLink}" style="
            display: inline-block;
            padding: 12px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
          ">Aktywuj konto</a>
        <p>Jeśli przycisk nie działa, skopiuj i wklej poniższy link do swojej przeglądarki:</p>
        <p>${activationLink}</p>
        <p>Pozdrawiamy,<br/>Zespół Power Canvas</p>
      </div>
    `,
  };

  // Wysłanie maila
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Błąd przy wysyłce maila:", error);
    throw error;
  }
}
