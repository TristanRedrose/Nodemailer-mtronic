const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:4200', 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Middleware to parse JSON bodies
app.use(express.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Route to send email
app.post('/send-email', async (req, res) => {
    const { subject, html} = req.body;

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: subject,
        html: html
    };

    try {
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).send({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Error sending email', error });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});