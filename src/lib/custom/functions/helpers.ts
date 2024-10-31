import { DateFormatter } from '@internationalized/date';
import { tick } from 'svelte';
import type { Cookies } from '@sveltejs/kit';
// import { PENDING_VERIFICATION_COOKIE, type pendingVerificationType } from "$lib/server/email"

// ALL TYPES FOR THIS FILE
type Years = {
	value: number;
	label: string;
};

// clientPackages
export type CartItems = {
	id: string;
	subtitles: string;
	prices: string;
	offers: string;
	priceMn: string;
	priceYr: string;
	comments: string;
	features: string[];
}[];

// Years from 1940 JSON
const items: Years[] = [];
const currentYear: number = new Date().getFullYear();
for (let i = 0; i <= currentYear - 1940; i++) {
	const year = currentYear - i;
	items.push({ value: 365 * i, label: String(year) });
}

//Date formatter
const df = new DateFormatter('en-US', {
	dateStyle: 'long'
});

// Get the Initials of a name
const getInitials = (name: any) => {
	let initials = name.split(' ');

	if (initials.length > 1) {
		initials = initials.shift().charAt(0) + initials.pop().charAt(0);
	} else {
		initials = name.substring(0, 2);
	}

	return initials.toUpperCase();
};
//commandbox trigger
// We want to refocus the trigger button when the user selects
// an item from the list so users can continue navigating the
// rest of the form with the keyboard.
let open: boolean;
function closeAndFocusTrigger(triggerId: string) {
	open = false;
	tick().then(() => {
		document.getElementById(triggerId)?.focus();
	});
}

// Reroute params with message
function handleLoginRedirect(
	where: string,
	url: URL,
	notification: string = 'You Must Be logged In to view this page'
) {
	const redirectTo = url.pathname + url.search;

	return `${where}?redirectTo=${redirectTo}&notification=${notification}`;
}

function handleExternal(where: string, url: URL) {
	const id = url.searchParams.get('external');
	const redirectTo = url.pathname + url.search.split('?')[0];
	return `${where}?external=${id}&redirectTo=${redirectTo}`;
}
// calpitalizes first leter of a word
function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculates your age
function calculateAge(birthday: string) {
	// birthday is a date
	var ageDifMs = Date.now() - new Date(birthday).getTime();
	var ageDate = new Date(ageDifMs); // miliseconds from epoch
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Likert Key
let cntys = new Map();
cntys.set('MOMBASA', 0);
cntys.set('KWALE', 0);
cntys.set('KILIFI', 0);
cntys.set('TANA_RIVER', 0);
cntys.set('LAMU', 0);
cntys.set('TAITA_TAVETA', 0);
cntys.set('GARISSA', 0);
cntys.set('WAJIR', 0);
cntys.set('MANDERA', 0);
cntys.set('MARSABIT', 0);
cntys.set('ISIOLO', 0);
cntys.set('MERU', 0);
cntys.set('THARAKA_NITHI', 0);
cntys.set('EMBU', 0);
cntys.set('KITUI', 0);
cntys.set('MACHAKOS', 0);
cntys.set('MAKUENI', 0);
cntys.set('NYANDARUA', 0);
cntys.set('NYERI', 0);
cntys.set('KIRINYAGA', 0);
cntys.set('MURANGA', 0);
cntys.set('KIAMBU', 0);
cntys.set('TURKANA', 0);
cntys.set('WEST_POKOT', 0);
cntys.set('SAMBURU', 0);
cntys.set('TRANS_NZOIA', 0);
cntys.set('UASIN_GISHU', 0);
cntys.set('ELGEYO_MARAKWET', 0);
cntys.set('NANDI', 0);
cntys.set('BARINGO', 0);
cntys.set('LAIKIPIA', 0);
cntys.set('NAKURU', 0);
cntys.set('NAROK', 0);
cntys.set('KAJIADO', 0);
cntys.set('KERICHO', 0);
cntys.set('BOMET', 0);
cntys.set('KAKAMEGA', 0);
cntys.set('VIHIGA', 0);
cntys.set('BUNGOMA', 0);
cntys.set('BUSIA', 0);
cntys.set('SIAYA', 0);
cntys.set('KISUMU', 0);
cntys.set('HOMA_BAY', 0);
cntys.set('MIGORI', 0);
cntys.set('KISII', 0);
cntys.set('NYAMIRA', 0);
cntys.set('NAIROBI', 0);
let likert_options = new Map();

likert_options.set('Agreement', [
	{ option: 'Strongly agree' },
	{ option: 'Agree' },
	{ option: 'Somewhat agree' },
	{ option: 'Neither agree or disagree' },
	{ option: 'Somewhat disagree' },
	{ option: 'Disagree' },
	{ option: 'Strongly disagree' }
]);

likert_options.set('Frequency', [
	{ option: 'Every time' },
	{ option: 'Usually (about 90% of the time)' },
	{ option: 'Frequently (about 70% of time)' },
	{ option: 'Sometimes (about 50% of the time)' },
	{ option: 'Occasionally (about 30% of the time)' },
	{ option: 'Rarely (less than 10% of the time)' },
	{ option: 'Never' }
]);

likert_options.set('Appropriateness', [
	{ option: 'Absolutely appropriate' },
	{ option: 'Appropriate' },
	{ option: 'Slightly appropriate' },
	{ option: 'Neutral' },
	{ option: 'Slightly inappropriate' },
	{ option: 'Inappropriate' },
	{ option: 'Absolutely inappropriate' }
]);

likert_options.set('Satisfaction', [
	{ option: 'Very satisfied' },
	{ option: 'Satisfied' },
	{ option: 'Slightly satisfied' },
	{ option: 'Neutral' },
	{ option: 'Slightly dissatisfied' },
	{ option: 'Dissatisfied' },
	{ option: 'Very dissatisfied' }
]);

likert_options.set('Reflective of me', [
	{ option: 'Very true of me' },
	{ option: 'True of me' },
	{ option: 'Somewhat true of me' },
	{ option: 'Neutral' },
	{ option: 'Somewhat untrue of me' },
	{ option: 'Untrue of me' },
	{ option: 'Very untrue of me' }
]);

likert_options.set('Level of difficulty', [
	{ option: 'Very hard' },
	{ option: 'Hard' },
	{ option: 'Somewhat hard' },
	{ option: 'Neutral' },
	{ option: 'Somewhat easy' },
	{ option: 'Easy' },
	{ option: 'Very easy' }
]);

likert_options.set('Priority', [
	{ option: 'Essential priority' },
	{ option: 'High priority' },
	{ option: 'Moderate priority' },
	{ option: 'Neutral' },
	{ option: 'Somewhat a priority' },
	{ option: 'Low priority' },
	{ option: 'Not a priority' }
]);

likert_options.set('Quality', [
	{ option: 'Excellent' },
	{ option: 'Good' },
	{ option: 'Above Average' },
	{ option: 'Average' },
	{ option: 'Below average' },
	{ option: 'Poor' },
	{ option: 'Very poor' }
]);

likert_options.set('Importance', [
	{ option: 'Very important' },
	{ option: 'Important' },
	{ option: 'Slightly important' },
	{ option: 'Neutral' },
	{ option: 'Slightly unimportant' },
	{ option: 'Unimportant' },
	{ option: 'Very unimportant' }
]);

likert_options.set('Likelyhood', [
	{ option: 'Very likely' },
	{ option: 'Likely' },
	{ option: 'Slightly likely' },
	{ option: 'Neutral' },
	{ option: 'Slightly unlikely' },
	{ option: 'Unlikely' },
	{ option: 'Very unlikely' }
]);

// Depreceated
const checkout = async (clientPack: Object) => {
	const data = await fetch('/create-payment-intent', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			items: clientPack
		})
	}).then((data) => data.json());
	window.location.replace(data.url);
};

// Unbiased Shuffling
// https://bost.ocks.org/mike/shuffle/
function shuffle(array: Object[]) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
}

function adjustDivider(x: number, currentDivider: number = 500): number {
	if (x <= currentDivider) {
		return currentDivider;
	}

	// Find the next divider that's greater than or equal to x
	let nextDivider = currentDivider;
	while (nextDivider < x) {
		nextDivider += 500;
	}

	return nextDivider;
}

function deductAmount(amount: number) {
	let deduction = 0;
	switch (true) {
		case amount > 100:
			deduction = amount - 5;
			break;
		case amount > 1500:
			deduction = amount - 9;
			break;
		case amount > 5000:
			deduction = amount - 11;
			break;
		case amount > 20000:
			deduction = amount - 13;
			break;
		default:
			deduction = amount;
			break;
	}
	return deduction;
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export {
	items,
	df,
	adjustDivider,
	open,
	likert_options,
	cntys,
	shuffle,
	checkout,
	getInitials,
	closeAndFocusTrigger,
	handleLoginRedirect,
	handleExternal,
	capitalizeFirstLetter,
	calculateAge,
	deductAmount
};
