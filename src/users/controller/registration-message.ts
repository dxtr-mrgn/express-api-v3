export function getRegistrationEmailTemplate(confirmationCode: string): string {
    return `
<h1>Thank you for your registration</h1>
<p>To finish registration please follow the link below:
    <a href="http://localhost:3006/auth/registration-confirmation?code=${confirmationCode}">complete registration</a>
</p>
    `;
}