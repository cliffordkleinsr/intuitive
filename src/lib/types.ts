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
interface MpesaB2CResult {
	Result: {
		ResultType: number;
		ResultCode: number;
		ResultDesc: string;
		OriginatorConversationID: string;
		ConversationID: string;
		TransactionID: string;
		ResultParameters: {
			ResultParameter: Array<{
				Key: string;
				Value: string | number;
			}>;
		};
	};
}

// Interface for timeout callback
interface MpesaTimeoutResult {
	Result: {
		ResultType: number;
		ResultCode: number;
		ResultDesc: string;
		OriginatorConversationID: string;
		ConversationID: string;
	};
}
// interface for transaction
interface Confirmation {
	TransactionType: string;
	TransID: string;
	TransTime: string;
	TransAmount: string;
	BusinessShortCode: string;
	BillRefNumber: string;
	InvoiceNumber: string;
	OrgAccountBalance: string;
	ThirdPartyTransID: string;
	MSISDN: string;
	FirstName: string;
	MiddleName: string;
	LastName: string;
}

interface customerAddressObject {
	phone_number?: string;
	email_address?: string;
	country_code?: string;
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	line_1?: string;
	line_2?: string;
	city?: string;
	state?: string;
	postal_code?: number;
	zip_code?: number;
}
interface PesaPalOReq {
	id: string;
	currency: string;
	amount: number;
	description: string;
	redirect_mode?: string;
	callback_url: string;
	cancellation_url?: string;
	notification_id: string;
	branch?: string;
	billing_address: customerAddressObject;
}
interface GenAnalytics {
	gender: string;
	count: number;
}
interface SecAnalytics {
	sector: string;
	count: number;
}
interface LocAnalytics {
	county: string;
	value: number;
}

interface AnsStats {
	count: number;
	answer: string;
	rank?: string;
	percentage: number;
}
interface Analytics {
	question: string;
	question_type: string;
	answer_statistics: AnsStats[];
}

interface Question {
	questionid: string;
	surveyid: string;
	question_type: 'Optional' | 'Single';
	question: string;
	likert_key?: string;
	updated_at: string;
}
interface Sharable {
	id: string;
	title: string;
	createdAt: Date;
}
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
interface clientData {
	payment:
		| {
				status: boolean;
		  }
		| boolean;
	features: {
		plan: string;
		type: string | null;
		max_questions: number;
		max_responses: number;
		demographics: boolean;
		api: boolean;
		branding: boolean;
	};
	user: App.Locals['user'];
	available_qns: {
		id: string;
		question: string;
		question_type: string;
		likert_key: string;
		optionid: string[];
		options: string[];
		created_at: Date;
	};
	questions: clientData['available_qns'][];
	otp: boolean;
}
interface Consumer {
	payment: boolean;
	features: {
		gender_active: boolean;
		ages: boolean;
		maxqns: number;
		maxagents: number;
		maxsurv: number;
		plan: string;
	};
	user: App.Locals['user'];
	available_qns: {
		id: string;
		question: string;
		question_type: string;
		likert_key: string;
		optionid: string[];
		options: string[];
		created_at: Date;
	};
	questions: clientData['available_qns'][];
}
interface GoogleIdTokenPayload {
	iss: string;
	sub: string;
	aud: string;
	iat: number;
	exp: number;
	email?: string;
	email_verified?: boolean;
	name?: string;
	picture?: string;
	// Add other claims as needed
}

interface GeocodeAPI {
	accuracy: number;
	latitude: number;
	longitude: number;
	altitude: number | null;
	altitudeAccuracy: number | null;
	heading: number | null;
	speed: number | null;
}
interface NominatimResponse {
	place_id?: string;
	licence?: string;
	osm_type?: string;
	osm_id?: string;
	lat?: string;
	lon?: string;
	place_rank?: string;
	category?: string;
	type?: string;
	importance?: string;
	addresstype?: string;
	display_name?: string;
	name?: string;
	address?: {
		road?: string;
		village?: string;
		state_district?: string;
		state?: string;
		postcode?: string;
		country?: string;
		country_code?: string;
	};
	boundingbox?: [string, string, string, string];
}
interface IP_API {
	status: string;
	country: string;
	countryCode: string;
	region: string;
	regionName: string;
	city: string;
	zip: string;
	lat: number;
	lon: number;
	timezone: string;
	isp: string;
	org: string;
	as: string;
	query: string;
}

export type {
	SurveyData,
	Agent,
	Client,
	Params,
	SEO,
	C2BURLs,
	MpesaB2CResult,
	MpesaTimeoutResult,
	Confirmation,
	GenAnalytics,
	SecAnalytics,
	LocAnalytics,
	AnsStats,
	Analytics,
	Question,
	clientData,
	GoogleIdTokenPayload,
	Consumer,
	PesaPalOReq,
	GeocodeAPI,
	NominatimResponse,
	IP_API
};
