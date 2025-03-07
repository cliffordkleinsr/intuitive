import type { DSVParsedArray } from 'd3-dsv';
import { sendBulkEmail } from '../email-send';
import { BASE_URL } from './config';
import { message } from 'sveltekit-superforms';

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
	csv: Array<{ Name: string; Email: string }> | any,
	href: string,
	regards: string,
	form: any
) => {
	csv.map(async (it: { Name: any; Email: any }) => {
		const { Name, Email } = it;
		if (!Name && !Email) {
			console.error('Name and Email are not here');
			return message(form, {
				alertType: 'warning',
				alertText: 'Name and Email are not in the csv entry column'
			});
		}
		try {
			await sendSurveyEmail(Name, Email, href, regards);
		} catch (err) {
			console.error(err);
		}
	});
};
