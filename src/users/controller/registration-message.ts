export function getRegistrationEmailTemplate(confirmationCode: string): string {
    return `
<h1>Thank you for your registration</h1>
<p>To finish registration please follow the link below:
    <a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>
</p>
    `;
}