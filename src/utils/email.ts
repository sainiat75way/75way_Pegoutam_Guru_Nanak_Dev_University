import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pegoutam.75way@gmail.com',
    pass: 'qamzmyeupuhkmjse',
  },
});

const sendEmail = (receiverEmail: string, subject: string, text: string) => {
  const mailOptions = {
    from: 'pegoutam.75way@gmail.com',
    to: receiverEmail,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error:any, info:any) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export default sendEmail;
