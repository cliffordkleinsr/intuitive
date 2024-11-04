import nodemailer, { type Transporter } from 'nodemailer';
import { SECRET_SMTP2GO_PASSWORD, SECRET_SMTP2GO_USERNAME } from '$env/static/private';

export default async function sendEmail(
	email: string,
	subject: string,
	bodyHtml?: string,
	bodyText?: string
) {
	let transporter: Transporter;
	// create Nodemailer SMTP transporter
	transporter = nodemailer.createTransport({
		host: 'mail.smtp2go.com',
		port: 2525,
		secure: false,
		auth: {
			user: SECRET_SMTP2GO_USERNAME,
			pass: SECRET_SMTP2GO_PASSWORD
		}
	});

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
