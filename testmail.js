import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// you need to setup an account, sent emails takes a few minutes to arrive (lots of checking)
sgMail.setApiKey(procss.env.SENDGRID_API_KEY);
const msg = {
    to: "joel.peltonen@digitalcareerinstitute.org",
    from: "joel.peltonen@digitalcareerinstitute.org",
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong> and easy to do anywhere, even with Node.js</strong>",
};

sgMail
    .send(msg)
    .then(() => console.log("email sent"))
    .catch((error) => console.error(error));