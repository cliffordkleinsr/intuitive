import { dev } from '$app/environment';
import { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET } from '$env/static/private';
import type { PesaPalOReq } from '$lib/types';

export const authToken = async () => {
	const url = dev
		? 'https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken'
		: 'https://pay.pesapal.com/v3/api/Auth/RequestToken';
	const payload = {
		'consumer_key': PESAPAL_CONSUMER_KEY,
		'consumer_secret': PESAPAL_CONSUMER_SECRET
	};
	// console.log(payload)
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(payload)
	});
	if (!res.ok) {
		console.error(await res.text());
		return;
	}
	const data = await res.json();
	// console.log(data)
	return data.token;
};

export const regeisteripnURL = async () => {
	const url = dev
		? 'https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN'
		: 'https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN';

	const payload = {
		url: 'https://int-insights.com/babana/ipn',
		ipn_notification_type: 'POST'
	};
	const token = await authToken();
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			accept: 'application/json'
		},
		body: JSON.stringify(payload)
	});
	if (!response.ok) {
		console.error(await response.text());
		return;
	}
	const data = await response.json();
	return data;
};

export const getRegisteredIPNS = async () => {
	const url = dev
		? 'https://cybqa.pesapal.com/pesapalv3/api/URLSetup/GetIpnList'
		: 'https://pay.pesapal.com/v3/api/URLSetup/GetIpnList';
	const token = await authToken();
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	if (!response.ok) {
		console.error(await response.text());
		return;
	}
	const data = await response.json();
	console.log(data)
	return data;
};

export const submitOrderRequest = async (
	amount: PesaPalOReq['amount'],
	phone: PesaPalOReq['billing_address']['phone_number'],
	callback: PesaPalOReq['callback_url'],
	ipn_id: PesaPalOReq['notification_id'],
	currency: PesaPalOReq['currency']
) => {
	const url = dev
		? 'https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest'
		: 'https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest';

	const payload: PesaPalOReq = {
		id: crypto.randomUUID(),
		currency: currency,
		amount: amount,
		description: 'Payment to company',
		callback_url: callback,
		notification_id: ipn_id,
		billing_address: {
			phone_number: phone
		}
	};
	const token = await authToken();
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		console.error(await response.text());
		return;
	}
	const data = await response.json();
	return data;
};
