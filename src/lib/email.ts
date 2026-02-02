export const emailService = {
    async sendEmail(to: string, subject: string, body: string) {
        console.log(`
        -------------------------------------------------------------
        [Mock Email Service] Sending Email
        To: ${to}
        Subject: ${subject}
        Body:
        ${body}
        -------------------------------------------------------------
        `);
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};
