export const sendSms = async (payload: string) => {
	const url = 'https://textbelt.com/text';

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
		// body: JSON.stringify(payload)
	});
	if (!res.ok) {
		console.error(await res.text());
		return;
	}
	const data = await res.json();
	console.log(data);
	return data;
};
