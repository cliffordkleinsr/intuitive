<script lang="ts">
	import { page } from '$app/state';
	import type { SEO } from '$lib/types';

	let { title, type, index = true }: SEO = $props();

	const base = $derived(page.url.origin);
	// JSON-LD must NOT be raw-injected to avoid invalid HTML & vulnerabilities
	const I = {
		'@context': 'https://schema.org',
		'@type': type,
		url: (() => base)(),
		name: 'Intuitive Insights',
		description:
			"'Run Online Surveys Kenya, Gather Insightful feedback, analyze data, and make informed decisions.'",
		logo: 'https://res.cloudinary.com/dmy8yp9el/image/upload/v1736759654/faviconb_zewoz3.ico'
	};
</script>

<svelte:head>
	<!-- Primary Meta Tags  -->
	<title>{title}</title>
	<link rel="canonical" href={base} />
	<meta
		name="description"
		content="Run Online Surveys Kenya, Gather Insightful feedback, analyze data, and make informed decisions."
	/>
	<meta
		name="keywords"
		content="online survey platform Kenya, online survey tool Africa, survey software Kenya, digital feedback platform Kenya, customer feedback tool Africa, employee survey platform Africa, customer satisfaction surveys Kenya, online questionnaire tool Africa, market research Kenya, market research Africa, feedback collection platform Kenya, user feedback system Kenya, data collection platform Africa, mobile surveys Africa, sms surveys Kenya, NPS survey tool Kenya, enterprise surveys Africa, best online survey tool Kenya, affordable survey software Africa, customer experience surveys Africa, digital feedback solutions Kenya, cloud-based survey system Africa, survey automation tools Kenya, secure survey platform Africa"
	/>
	<meta name="robots" content={index ? 'index, follow' : 'noindex'} />
	<meta name="author" content="Intuitive Insights" />

	<!-- Open Graph / Facebook -->
	<meta property="og:title" content="Intuitive Insights" />
	<meta
		property="og:description"
		content="Run Online Surveys Kenya, Gather Insightful feedback, analyze data, and make informed decisions."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={base} />
	<meta property="og:image" content={`${base}/og-image.png`} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Intuitive Insights" />
	<meta
		name="twitter:description"
		content="Run Online Surveys Kenya, Gather Insightful feedback, analyze data, and make informed decisions."
	/>
	<meta name="twitter:image" content={`${base}/og-image.png`} />

	<!-- PWA & Icons -->
	<link rel="icon" href="/favicons/favicon.ico" />
	<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
	<link rel="manifest" href="/favicons/site.webmanifest" />

	<!-- Theme Color -->
	<meta name="theme-color" content="#0a3d91" />

	<!-- JSON-LD -->
	{@html ` <script type="application/ld+json">
		 { "@context": "https://schema.org/",
			"@type": "${type}",
			"url": "${base}",
			"name": "${title}",
			"description": "Run Online Surveys Kenya, Gather Insightful feedback, analyze data, and make informed decisions.",
			"logo": "/favicons/favicon.ico" 
		} 
		 </script> 
	`}

	<!-- GTAG -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17657408289"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'AW-17657408289');
	</script>
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-DTDFGPM9ZP"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-DTDFGPM9ZP');
	</script>
</svelte:head>
