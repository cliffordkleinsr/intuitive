import { SvelteMap, SvelteSet } from 'svelte/reactivity';

type TempList = {
	id: number;
	qns: string;
	options?: string[];
	name: string;
};
type TemplateConfig = {
	gradient: string; // e.g. 'from-red-500 to-orange-500'
	questions: TempList[];
};
export const tempList: SvelteMap<string, TemplateConfig> = new SvelteMap();
tempList.set('Customer Satisfaction (CSAT)', {
	gradient: 'bg-gradient-to-r from-red-500 to-orange-500',
	questions: [
		{
			id: 0,
			qns: 'How well did our (product/service) meet your expectations?',
			options: ['Exceeded expectations', 'Met expectations', 'Fell below expectations'],
			name: 'optional_question'
		},
		{
			id: 1,
			qns: 'How would you rate the quality of our customer service?',
			name: 'rating_question'
		},
		{
			id: 2,
			qns: 'How would you rate the timeliness of our service delivery?',
			options: ['Poor', 'Far', 'Excellent'],
			name: 'optional_question'
		},
		{
			id: 3,
			qns: 'How likely are you to recommend us to others?',
			name: 'rating_question'
		},
		{
			id: 4,
			qns: 'How would you rate your overall satisfaction with our (product/service)?',
			name: 'rating_question'
		}
	]
});

tempList.set('Employee Engagement Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How would you rate your overall job satisfaction?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'How valued do you feel in your role?',
			options: ['Very valued', 'Somewhat valued', 'Not valued'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How would you rate communication between teams?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'How often do you receive recognition for good work?',
			options: ['Regularly', 'Occasionally', 'Rarely', 'Never'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'How would you rate management’s support for your growth?',
			name: 'rating_question'
		},
		{
			id: 5,
			qns: 'What one change would make your work experience better?',
			name: 'single_question'
		}
	]
});

tempList.set('Post-Purchase / Service Feedback Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How satisfied are you with your recent (purchase/service)?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'How would you rate the (product/service) quality?',
			name: 'rating_question'
		},
		{
			id: 2,
			qns: 'How easy was it to complete your transaction?',
			options: ['Very easy', 'Somewhat easy', 'Difficult'],
			name: 'optional_question'
		},
		{
			id: 3,
			qns: 'How would you rate the helpfulness of our staff?',
			name: 'rating_question'
		},
		{
			id: 4,
			qns: 'Did you receive good value for your money?',
			options: ['Yes', 'No', 'Not sure'],
			name: 'optional_question'
		},
		{
			id: 5,
			qns: 'What can we do to improve your next experience?',
			name: 'single_question'
		}
	]
});

tempList.set('Market Research / Product Development Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How interested are you in a (product/service) like this?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'Which of these features would be most valuable to you?',
			options: ['Feature A', 'Feature B', 'Feature C', 'Other'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How would you rate your current satisfaction with existing solutions?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'How likely are you to try a new solution if it meets your needs?',
			options: ['Very likely', 'Somewhat likely', 'Unlikely'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'How would you rate the price fairness of similar products?',
			name: 'rating_question'
		},
		{
			id: 5,
			qns: 'What is one improvement you would love to see in future solutions?',
			name: 'single_question'
		}
	]
});

tempList.set('Patient Experience Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How would you rate your overall experience at our (facility)?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'How professional and caring was our staff?',
			name: 'rating_question'
		},
		{
			id: 2,
			qns: 'How easy was it to schedule or attend your appointment?',
			options: ['Very easy', 'Fairly easy', 'Difficult'],
			name: 'optional_question'
		},
		{
			id: 3,
			qns: 'How would you rate the cleanliness and comfort of our facility)?',
			name: 'rating_question'
		},
		{
			id: 4,
			qns: 'Were your questions and concerns addressed effectively?',
			options: ['Yes', 'No', 'Partially'],
			name: 'optional_question'
		},
		{
			id: 5,
			qns: 'What can we do to improve patient care?',
			name: 'single_question'
		}
	]
});

tempList.set('Community / Program Impact Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How would you rate the overall impact of our program on you or your community?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'How relevant was the program to your needs?',
			options: ['Very relevant', 'FairSomewhat relevant', 'Irrelevant'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How would you rate the support you received from our team?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'How easy was it to participate in our activities or sessions?',
			options: ['Very easy', 'Fairly easy', 'Difficult'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'How would you rate the program’s organization and delivery?',
			name: 'rating_question'
		},
		{
			id: 4,
			qns: 'What changes or additions would make future programs more effective?',
			name: 'single_question'
		}
	]
});
