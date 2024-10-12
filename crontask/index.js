import axios from 'axios'
import nodemailer from 'nodemailer'
import Agenda from 'agenda'
import {config} from 'dotenv'
config();

const mongoConnectionString = 'mongodb://localhost:27017/agenda'; // Update with your MongoDB URI
const agenda = new Agenda({ db: { address: mongoConnectionString } });

const baseUrl="http://localhost:3000/process/all/6707aa3ce7e38b056ed131be"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // your email from .env
        pass: process.env.EMAIL_PASS, // your email password from .env
    },
    logger: true, // enable logging
    debug: true, // enable debug output
});
const sendEmail = async (subject, text,email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // recipient email
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};

agenda.define('ping server', async (job) => {
    try {
        const { url } = job.attrs.data;
        const response = await axios.get(url);

        const Processes=response.data.Processes;
        const email=response.data.email
        Processes.forEach(async (process) =>{await sendEmail('Unresponsive Process', `Process with Pid : ${process.pid} is unresponsive \n Server Lord Admin Team`,email)});
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
});

agenda.on('ready', async () => {
    await agenda.start();
    await agenda.every('1 minutes', 'ping server',{ url: baseUrl }); 
});

agenda.on('error', (error) => {
    console.error(`Agenda error: ${error.message}`);
});