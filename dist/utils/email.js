"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'pegoutam.75way@gmail.com',
        pass: 'qamzmyeupuhkmjse',
    },
});
const sendEmail = (receiverEmail, subject, text) => {
    const mailOptions = {
        from: 'pegoutam.75way@gmail.com',
        to: receiverEmail,
        subject,
        text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
};
exports.default = sendEmail;
