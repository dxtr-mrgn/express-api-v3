export function getRegistrationEmailTemplate(confirmationCode: string): string {
    return `
<h1>Thank you for your registration</h1>
<p>To finish registration please follow the link below:
    <a href="https://express-api-v3.vercel.app/auth/registration-confirmation?code=${confirmationCode}">complete registration</a>
</p>
    `;
}