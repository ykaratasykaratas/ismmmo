import nodemailer from 'nodemailer';

const smtpOptions = {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASSWORD || 'password',
    },
};

export const sendEmail = async (data: {
    to: string;
    subject: string;
    text: string;
    html: string;
}) => {
    const transporter = nodemailer.createTransport({
        ...smtpOptions,
    });

    // If SMTP credentials are not set (or are defaults), log the email content for dev testing
    if (!process.env.SMTP_HOST || process.env.SMTP_HOST === 'smtp.mailtrap.io') {
        console.log('--- EMAIL SIMULATION ---');
        console.log('To:', data.to);
        console.log('Subject:', data.subject);
        console.log('Text:', data.text);
        console.log('------------------------');
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL || 'noreply@ismmmo.org.tr',
            ...data,
        });
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        // In development, if real email fails, we might still want to proceed if we logged it
        if (!process.env.SMTP_HOST || process.env.SMTP_HOST === 'smtp.mailtrap.io') {
            return true;
        }
        return false;
    }
};
