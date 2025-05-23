/*
	jsrepo 1.36.0
	Installed from github/ieedan/shadcn-svelte-extras
	2-14-2025
*/

import PhoneInput from './phone-input.svelte';
import type {
	Country,
	CountryCode,
	DetailedValue,
	E164Number,
	TelInputOptions
} from 'svelte-tel-input/types';

export type Props = {
	country?: CountryCode | null;
	defaultCountry?: CountryCode | null;
	el?: HTMLInputElement;
	name?: string;
	placeholder?: string;
	disabled?: boolean;
	readonly?: boolean;
	class?: string;
	value?: E164Number | null;
	valid?: boolean;
	detailedValue?: Partial<DetailedValue> | null;
	options?: TelInputOptions;
	order?: ((a: Country, b: Country) => number) | undefined;
};

export const defaultOptions: TelInputOptions = {
	spaces: true,
	autoPlaceholder: false,
	format: 'international'
};

export { PhoneInput };
