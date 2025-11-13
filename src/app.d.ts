// See https://svelte.dev/docs/kit/types#app.d.ts

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
		interface PageData {
			flash?: { type: 'success' | 'error' | 'info' | 'warning'; message: string };
		}
		interface PageState {
			profile: Agent;
			clients: Client;
			available_survs: SurveyData;
			available_qns: clientData;
		}
	}

	interface Window {
		chatwootSDK?: {
			run: (config: { websiteToken: string; baseUrl: string }) => void;
		};
		chatwootSettings?: {
			hideMessageBubble?: boolean;
			position?: 'left' | 'right';
			locale?: string;
			type?: 'standard' | 'expanded_bubble';
			launcherTitle?: string;
			darkMode?: 'auto' | 'light' | 'dark';
			launcherColor?: string;
			showPopoutButton?: boolean;
			openOnLoad?: boolean;
			// You can add more based on your Chatwoot config usage
			[extra: string]: unknown;
		};
	}
}
export {};
