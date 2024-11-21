import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import * as auth from '$lib/server/auth.js';
import { createHandler } from 'svelte-kit-bot-block';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(auth.sessionCookieName);
	// console.log(sessionId)
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSession(sessionId);
	// console.log(session)
	if (session) {
		event.cookies.set(auth.sessionCookieName, session.id, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: session.expiresAt,
			secure: !dev
		});
	} else {
		event.cookies.delete(auth.sessionCookieName, { path: '/' });
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const handleBots: Handle = createHandler({
	// whether to log action
	log: true,

	// whether to block on failure (vs just warn, for testing)
	block: true,

	// block direct ip access (no hostname provided)
	ip_access: true,
	// block matching hostnames
	hostnames: [
		// nuisance requests on GCP
		/\.appspot\.com$/,

		// pretty confident we're not google
		/\.google.com$/
	],
	// block matching pathnames
	pathnames: [
		// block feed
		/\/feed/,
		// block mpesa defaults
		/\/api\/confirmation/,
		/\/api\/validation/,
		// block wp
		/\/wp-content/,
		// block unused file extensions
		/\.(env|git|ssh|php|rss|yml|yaml|asp|cgi|map|aspx|ashx|txt)$/,

		// git content
		/\.git\/\w+$/,

		// block wordpress (Windows Live Writer)
		/\/wlwmanifest\.xml$/
	],
	// block matching user-agents
	user_agents: [
		// from https://community.cloudflare.com/t/top-50-user-agents-to-block/222594
		/(360Spider|acapbot|acoonbot|ahrefs|alexibot|asterias|attackbot|backdorbot|becomebot|binlar|blackwidow|blekkobot|blexbot|blowfish|bullseye|bunnys|butterfly|careerbot|casper|checkpriv|cheesebot|cherrypick|chinaclaw|choppy|clshttp|cmsworld|copernic|copyrightcheck|cosmos|crescent|cy_cho|datacha|demon|diavol|discobot|dittospyder|dotbot|dotnetdotcom|dumbot|emailcollector|emailsiphon|emailwolf|exabot|extract|eyenetie|feedfinder|flaming|flashget|flicky|foobot|g00g1e|getright|gigabot|go-ahead-got|gozilla|grabnet|grafula|harvest|heritrix|httrack|icarus6j|jetbot|jetcar|jikespider|kmccrew|leechftp|libweb|linkextractor|linkscan|linkwalker|loader|masscan|miner|majestic|mechanize|mj12bot|morfeus|moveoverbot|netmechanic|netspider|nicerspro|nikto|ninja|nutch|octopus|pagegrabber|planetwork|postrank|proximic|purebot|pycurl|python|queryn|queryseeker|radian6|radiation|realdownload|rogerbot|scooter|seekerspider|semalt|siclab|sindice|sistrix|sitebot|siteexplorer|sitesnagger|skygrid|smartdownload|snoopy|sosospider|spankbot|spbot|sqlmap|stackrambler|stripper|sucker|surftbot|sux0r|suzukacz|suzuran|takeout|teleport|telesoft|true_robots|turingos|turnit|vampire|vikspider|voideye|webleacher|webreaper|webstripper|webvac|webviewer|webwhacker|winhttp|wwwoffle|woxbot|xaldon|xxxyy|yamanalab|yioopbot|youda|zeus|zmeu|zune|zyborg)/
	]
});

export const handle: Handle = sequence(handleBots, handleAuth);
