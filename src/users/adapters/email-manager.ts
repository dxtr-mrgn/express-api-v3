const nodemailer = require('nodemailer');

interface EmailResult {
    messageId?: string;
    response?: string;
    accepted?: string[];
    rejected?: string[];
}

export async function sendEmail(email: string, message: string): Promise<boolean> {
    let transporter;

    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dexter.morgan.random@gmail.com',
                pass: 'uszd qdmo vopb tzub',
            },
        });

        await transporter.verify();
        console.log('Server is ready to take our messages');
        console.log('Message to send', message);

        const mailOptions = {
            from: 'Dexter Morgan <dexter.morgan.random@gmail.com>',
            to: email,
            subject: 'Email Confirmation',
            html: message,
        };

        const emailResult: EmailResult = await transporter.sendMail(mailOptions);
        console.log('Email sent with ID:', emailResult.messageId);

        setTimeout(() => {
            if (emailResult.messageId) {
                console.log('Email was sent successfully with ID:', emailResult.messageId);
                console.log('Full response:', emailResult);
            } else {
                console.error('Email status unknown - might have failed');
            }
        }, 5000);

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}