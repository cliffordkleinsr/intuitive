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
}
export {};
