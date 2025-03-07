export interface Timezone {
	zoneName: string;
	gmtOffset: number;
	gmtOffsetName: string;
	abbreviation: string;
	tzName: string;
}

export interface CountryProps {
	id: number;
	name: string;
	iso3: string;
	iso2: string;
	numeric_code: string;
	phone_code: string;
	capital: string;
	currency: string;
	currency_name: string;
	currency_symbol: string;
	tld: string;
	native: string;
	region: string;
	region_id: string;
	subregion: string;
	subregion_id: string;
	nationality: string;
	timezones: Timezone[];
	translations: Record<string, string>;
	latitude: string;
	longitude: string;
	emoji: string;
	emojiU: string;
}

export interface StateProps {
	id: number;
	name: string;
	country_id: number;
	country_code: string;
	country_name: string;
	state_code: string;
	type: string | null;
	latitude: string;
	longitude: string;
}

// Define types (same as in React version)
export type LocationProps = {
	disabled?: boolean;
	onCountryChange?: (country: CountryProps | null) => void;
	onStateChange?: (state: StateProps | null) => void;
	selectedCountry?: CountryProps | null;
	selectedState?: StateProps | null;
};
