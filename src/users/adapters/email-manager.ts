const nodemailer = require("nodemailer");

interface EmailResult {
    messageId?: string;
    response?: string;
    accepted?: string[];
    rejected?: string[];
}

export async function sendEmail(email: string, message: string): Promise<boolean> {
    let transporter;

    try {
        // Create transporter
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "dexter.morgan.random@gmail.com",
                pass: "uszd qdmo vopb tzub",
            },
        });

        // Verify connection (optional, can be removed if it causes delays)
        await transporter.verify();
        console.log("Server is ready to take our messages");
        console.log("Message to send", message);


        const mailOptions = {
            from: "Dexter Morgan <dexter.morgan.random@gmail.com>",
            to: email,
            subject: "New Post",
            html: message,
        };

        // Send email and get result
        const emailResult: EmailResult = await transporter.sendMail(mailOptions);
        console.log("Email sent with ID:", emailResult.messageId);

        // Check status asynchronously without blocking the response
        setTimeout(() => {
            if (emailResult.messageId) {
                console.log("Email was sent successfully with ID:", emailResult.messageId);
                console.log("Full response:", emailResult);
            } else {
                console.error("Email status unknown - might have failed");
            }
        }, 5000); // 5 seconds delay for logging

        return true; // Resolve immediately after sending
    } catch (error) {
        console.error("Error sending email:", error);
        return false; // Reject with false on error
    }
}