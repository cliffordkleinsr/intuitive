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

tempList.set('Customer Experience Journey Survey', {
	gradient: 'bg-gradient-to-r from-red-500 to-orange-500',
	questions: [
		{
			id: 0,
			qns: 'How easy was it to access our product/service?',
			options: ['Very easy', 'Somewhat easy', 'Difficult'],
			name: 'optional_question'
		},
		{
			id: 1,
			qns: 'How would you rate the clarity of information provided?',
			name: 'rating_question'
		},
		{
			id: 2,
			qns: 'How satisfied are you with the communication you received?',
			options: ['Poor', 'Far', 'Excellent'],
			name: 'optional_question'
		},
		{
			id: 3,
			qns: 'Did our team resolve your issue effectively?',
			options: ['Yes', 'Partially', 'No'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'What was the most challenging part of your experience?',
			name: 'single_question'
		}
	]
});

tempList.set('Service Reliability and Trust Survey', {
	gradient: 'bg-gradient-to-r from-red-500 to-orange-500',
	questions: [
		{
			id: 0,
			qns: 'How reliable was our service delivery?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'Did we deliver within the promised timeframe?',
			options: ['Yes', 'Partially', 'No'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How transparent was our pricing and policies?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'How confident are you in continuing to use our services?',
			options: ['Very confident', 'Somewhat confident', 'Not confident'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'What would increase your trust in our brand?',
			name: 'single_question'
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

tempList.set('Workplace Culture and Inclusion Survey', {
	gradient: 'bg-gradient-to-r from-red-500 to-orange-500',
	questions: [
		{
			id: 0,
			qns: 'How would you rate the overall workplace environment?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'Do you feel respected at work?',
			options: ['Always', 'Sometimes', 'Rarely'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How satisfied are you with internal communication?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'Do you feel comfortable sharing ideas with management?',
			options: ['Yes', 'Somewhat', 'No'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'What would improve team collaboration?',
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

tempList.set('Transaction Experience Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How smooth was your payment process?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'Which payment method did you use?',
			options: ['Mobile payment', 'Bank transfer', 'Cash'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How satisfied are you with the product/service received?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'Did the product/service match its description?',
			options: ['Yes', 'Partially', 'No'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'Did you receive good value for your money?',
			options: ['Yes', 'No', 'Not sure'],
			name: 'optional_question'
		},
		{
			id: 5,
			qns: 'What could make the transaction easier next time?',
			name: 'single_question'
		}
	]
});

tempList.set('After-Sales Support Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How responsive was our support team?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'Was your issue resolved within a reasonable time?',
			options: ['Yes', 'Somewhat', 'No'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How would you rate the clarity of guidance provided?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'Would you contact our support team again if needed?',
			options: ['Yes', 'Maybe', 'No'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'What can we improve in our after-sales service?',
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

tempList.set('Pricing and Affordability Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How would you rate the affordability of our product/service?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'Compared to alternatives, our pricing is:',
			options: ['More affordable', 'About the same', 'More expensive'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How likely are you to purchase at the current price?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'Would flexible payment options increase your likelihood to buy?',
			options: ['Yes', 'Maybe', 'No'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'What price range would feel most comfortable for you?',
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

tempList.set('Appointment and Access Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How easy was it to book your appointment?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'How did you schedule your visit?',
			options: ['Phone', 'Online', 'Walk-in'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How would you rate waiting time?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'Were instructions before your visit clear?',
			options: ['Yes', 'Somewhat', 'No'],
			name: 'optional_question'
		},
		{
			id: 5,
			qns: 'What would improve access to our services?',
			name: 'single_question'
		}
	]
});

tempList.set('Treatment and Communication Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How clearly did the staff explain your treatment?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'Did you feel listened to during your visit?',
			options: ['Yes', 'Partially', 'No'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How would you rate overall professionalism?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'Would you return to this facility?',
			options: ['Yes', 'Maybe', 'No'],
			name: 'optional_question'
		},
		{
			id: 5,
			qns: 'What could improve communication during visits?',
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
			options: ['Very relevant', 'Somewhat relevant', 'Irrelevant'],
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
			id: 5,
			qns: 'What changes or additions would make future programs more effective?',
			name: 'single_question'
		}
	]
});

tempList.set('Long-Term Impact and Sustainability Survey', {
	gradient: 'bg-gradient-to-r from-slate-500 to-slate-800',
	questions: [
		{
			id: 0,
			qns: 'How would you rate the long-term benefits of this program?',
			name: 'rating_question'
		},
		{
			id: 1,
			qns: 'Has the program improved your skills or opportunities?',
			options: ['Yes', 'Somewhat', 'No'],
			name: 'optional_question'
		},
		{
			id: 2,
			qns: 'How confident are you in applying what you learned?',
			name: 'rating_question'
		},
		{
			id: 3,
			qns: 'Would you participate in future programs?',
			options: ['Yes', 'Maybe', 'No'],
			name: 'optional_question'
		},
		{
			id: 4,
			qns: 'What additional support would increase long-term impact?',
			name: 'single_question'
		}
	]
});
