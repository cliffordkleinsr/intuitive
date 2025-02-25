import { dev } from '$app/environment';
import { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET } from '$env/static/private';
const ipnRegistrationUrl = dev
	? 'https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken'
	: 'https://pay.pesapal.com/v3/api/Auth/RequestToken';

export const authtoken = async () => {
	const payload = {
		consumer_key: PESAPAL_CONSUMER_KEY,
		consumer_secret: PESAPAL_CONSUMER_SECRET
	};
	const res = await fetch(ipnRegistrationUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json'
		},
		body: JSON.stringify(payload)
	});
	if (!res.ok) {
		console.error(await res.text());
		return;
	}
	const data = await res.json();
	return data;
};
