const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const fs = require('fs/promises');
const path = require('path');

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const FROM_EMAIL = process.env.FROM_EMAIL;

const sendEmail = async (email, subject, payload, template) => {
  
  try{

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
      }
    });

    const source = await fs.readFile(path.resolve(__dirname, template), 'utf-8');;

    const compiledTemplate = handlebars.compile(source);

    const options = {
      from: FROM_EMAIL,
      to: email,
      subject: subject,
      html: compiledTemplate(payload)
    };

    const sentMessageInfo = await transporter.sendMail(options);

    console.log('Email sent successfully ', sentMessageInfo);

    return true;

  } catch (err) {

    console.log('Error during email sending ', err);

    return false;
  }

};

module.exports = sendEmail;