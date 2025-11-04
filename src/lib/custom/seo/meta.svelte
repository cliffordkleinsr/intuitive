<script lang="ts">
	import { page } from '$app/state';
	import type { SEO } from '$lib/types';

	let { title, description, type, index = true }: SEO = $props();

	const base = $derived(page.url.href);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="Intuitive insights, data analysis, informed decisions, feedback gathering"
	/>
	<meta name="author" content="Intuitive insights" />
	<meta name="robots" content={index ? 'index, follow' : 'noindex'} />
	<link
		rel="icon"
		href="https://res.cloudinary.com/dmy8yp9el/image/upload/v1736759654/faviconb_zewoz3.ico"
	/>
	<link rel="canonical" href={base} />
	{@html `
        <script type="application/ld+json">
            {
                "@context": "https://schema.org/",
                "@type": "${type}",
                "url": "${base}",
                "name": "${title} • int-insights.com",
                "description": "${description}",
				"logo": "https://res.cloudinary.com/dmy8yp9el/image/upload/v1736759654/faviconb_zewoz3.ico"
            }
        </script>
    `}
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
