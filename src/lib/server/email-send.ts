import nodemailer, { type Transporter } from 'nodemailer';
import {
	SECRET_MAILJET_PASSWORD,
	SECRET_MAILJET_USERNAME,
	SECRET_SMTP2GO_PASSWORD,
	SECRET_SMTP2GO_USERNAME
} from '$env/static/private';

let transporter: Transporter;
// create Nodemailer SMTP transporter
transporter = nodemailer.createTransport({
	host: 'in-v3.mailjet.com',
	port: 587,
	secure: false,
	auth: {
		user: SECRET_MAILJET_USERNAME,
		pass: SECRET_MAILJET_PASSWORD
	}
});
export default async function sendEmail(
	email: string,
	subject: string,
	bodyHtml?: string,
	bodyText?: string
) {
	try {
		switch (false) {
			case !bodyText:
				transporter.sendMail(
					{
						from: SECRET_SMTP2GO_USERNAME,
						to: email,
						subject: subject,
						html: bodyHtml
					},
					(err) => {
						if (err) {
							new Error(`Error sending email: ${JSON.stringify(err)}`);
						}
					}
				);
				break;
			case !bodyHtml:
				transporter.sendMail(
					{
						from: SECRET_SMTP2GO_USERNAME,
						to: email,
						subject: subject,
						text: bodyText
					},
					(err) => {
						if (err) {
							new Error(`Error sending email: ${JSON.stringify(err)}`);
						}
					}
				);
				break;

			default:
				transporter.sendMail(
					{
						from: SECRET_SMTP2GO_USERNAME,
						to: email,
						subject: subject,
						html: bodyHtml,
						text: bodyText
					},
					(err) => {
						if (err) {
							new Error(`Error sending email: ${JSON.stringify(err)}`);
						}
					}
				);
				break;
		}

		return {
			statusCode: 200,
			message: 'E-mail sent successfully.'
		};
	} catch (error) {
		new Error(`Error sending email: ${JSON.stringify(error)}`);
	}
}

// timeouts
export const sendBulkEmail = async (
	email: string,
	subject: string,
	bodyHtml: string,
	timeoutMs: number = 5000 // Timeout used for spreading out load
) =>
	new Promise((resolve, reject) => {
		const msg = {
			from: SECRET_SMTP2GO_USERNAME,
			to: email,
			subject: subject,
			html: bodyHtml
		};
		transporter.sendMail(msg, (err) => {
			if (err) {
				return reject(err);
			}
			setTimeout(resolve, timeoutMs);
		});
	});
