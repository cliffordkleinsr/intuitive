import {
	CONSUMER_KEY,
	CONSUMER_SECRET,
	INITIATOR,
	SECURITY_CREDENTIAL,
	SHORTCODE
} from '$env/static/private';
import type { C2BURLs, Params } from '$lib/types';

const getAccessToken = async () => {
	const url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
	const token = Buffer.from(CONSUMER_KEY + ':' + CONSUMER_SECRET).toString('base64');

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Authorization': `Basic ${token}`,
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		console.error(await res.text());
		return;
	}
	const data = await res.json();

	return data.access_token;
};

const initiateB2C = async (body: Params) => {
	const { amount, phoneNumber } = body;
	const cleanedNumber = phoneNumber.replace(/\D/g, '');
	const formattedPhone = `254${cleanedNumber.slice(-9)}`;

	const url = 'https://api.safaricom.co.ke/mpesa/b2c/v3/paymentrequest';
	const token = await getAccessToken();

	const conversationID = crypto.randomUUID();
	const payload = {
		OriginatorConversationID: conversationID,
		InitiatorName: INITIATOR,
		SecurityCredential: SECURITY_CREDENTIAL,
		CommandID: 'BusinessPayment',
		Amount: amount,
		PartyA: SHORTCODE,
		PartyB: formattedPhone,
		Remarks: 'Here is your payment',
		QueueTimeOutURL: 'https://mydomain.com/b2c/queue',
		ResultURL: 'https://mydomain.com/b2c/result',
		Occasion: 'Christmas'
	};

	// init transport
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
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

const registerURLs = async (body: C2BURLs) => {
	const { validationURL, confirmationURL } = body;
	const url = 'https://api.safaricom.co.ke/mpesa/c2b/v2/registerurl';
	const token = await getAccessToken();
	//"https://int-insights.com/api/confirmation",
	//"https://int-insights.com/api/validation"
	const payload = {
		ShortCode: SHORTCODE,
		ResponseType: 'Completed',
		ConfirmationURL: confirmationURL,
		ValidationURL: validationURL
	};
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
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

export { getAccessToken, initiateB2C, registerURLs };
