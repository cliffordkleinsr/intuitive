import type { DSVParsedArray } from 'd3-dsv';
import { sendBulkEmail } from '../email-send';
import { BASE_URL } from './config';

const sendSurveyEmail = async (name: string, email: string, href: string, best: string) => {
	const htmlEmail = `
      Hello ${name},<br/>

      We hope you’re doing well.<br/>
      
      We’d love for you to join and share your thoughts and suggestions in our survey.<br/><br/>
      You can participate in the survey by navigating to this <a href="${href}">link</a></br>
      Hope to see you there!<br/><br/><br/>
      Regards,<br/>
      ${best}.<br/>
    `;
	const subject = `Hi ${name} - You are invited to participate in a survey`;
	const resultSend = sendBulkEmail(email, subject, htmlEmail);
	return resultSend;
};

export const sendBulkEmailCSV = (
	csv: Array<{ name: string; email: string }> | any,
	href: string,
	regards: string
) => {
	csv.map(async (it: { name: any; email: any }) => {
		const { name, email } = it;
		if (!name && !email) {
			console.error('name and email are not here');
			return;
		}
		try {
			await sendSurveyEmail(name, email, href, regards);
		} catch (err) {
			console.error(err);
		}
	});
};
