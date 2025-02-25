export const sendSms = async (payload: string) => {
	const url = 'https://textbelt.com/text';
	// const token = "be8f2334021d06d36ac4266d2c0aaca6"

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
