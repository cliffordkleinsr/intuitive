import type { CartItems } from '$lib/custom/functions/helpers';

export const cardList: CartItems = [
	{
		id: 'prod_QjUMG44vCFNGXO',
		subtitles: 'Basic',
		prices: '50',
		offers: '45',
		comments: 'All the basics for an entry level business',
		features: [
			'Up to 2 surveys per month',
			'Up to 5 questions per survey.',
			'Access to a limited respondent pool (100 respondents per survey)',
			'Email support.'
		]
	},
	{
		id: 'prod_QTg6aK5zM7RlUw',
		subtitles: 'Standard Business',
		prices: '200',
		offers: '180',
		comments: 'Everything you need for a growing business',
		features: [
			'Up to 4 surveys per month.',
			'Up to 15 questions per survey.',
			'Access to an expanded respondent pool (250 respondents per survey)',
			'Advanced demographic segmentation (income, education level).',
			'Analytics and reporting.',
			'Email support.'
		]
	},
	{
		id: 'prod_QTgA9EH6qo3dRu',
		subtitles: 'Premium Business',
		prices: '1200',
		offers: '1080',
		comments: 'Advanced features for scaling your business',
		features: [
			'Up to 6 surveys per month.',
			'Up to 30 questions per survey.',
			'Access to a large  respondent pool (500 respondents per survey)',
			'Advanced demographic segmentation (income, education level).',
			'Analytics and reporting.',
			'On demand technical support.'
		]
	},
	{
		id: 'N/A',
		subtitles: 'Enterprise',
		prices: 'Custom',
		offers: 'Custom',
		comments: 'Enterprise level needs',
		features: ['Unlimited users', 'Unlimited Plan features', 'Unlimited Product support']
	}
];

const otp = {
	id: 'prod_QjUCV2u3waC96D',
	subtitles: 'One-time',
	prices: '30',
	offers: '30',
	comments: 'One time trial for platform features',
	features: [
		'One time survey',
		'Up to 5 questions for the one time survey.',
		'Access to a limited respondent pool (100 respondents per survey)',
		'Email support.'
	]
};
