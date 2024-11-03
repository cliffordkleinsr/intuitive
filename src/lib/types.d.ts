interface SurveyData {
	url: string;
	AuthedUser: string;
	profile: string;
	available_surv: {
		uri: string;
		current_ix: number;
		question_cnt: number;
		survId: string;
	};
}
interface Agent {
	agent: {
		id: string;
		name: string;
		email: string;
		phone: string;
		gender: string;
		age: number;
		disabled: boolean;
		completes: number;
	};
	pending: number;
}

interface Client {
	clients: {
		id: string;
		name: string;
		email: string;
		phone: string;
		company: string;
		active: boolean;
		packagetype: string;
		surveys: number;
	};
}

interface Params {
	amount: number;
	phoneNumber: string;
}

interface SEO {
	title: string;
	description: string;
	type: string;
}

interface C2BURLs {
	validationURL: string;
	confirmationURL: string;
}

export type { SurveyData, Agent, Client, Params, SEO, C2BURLs };
