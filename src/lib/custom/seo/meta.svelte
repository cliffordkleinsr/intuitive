<script lang="ts">
	import { page } from '$app/stores';
	import type { SEO } from '$lib/types';

	let { title, description, type }: SEO = $props();

	const base = $derived($page.url.href);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="Intuitive insights, data analysis, informed decisions, feedback gathering"
	/>
	<meta name="author" content="Intuitive insights" />
	<meta name="robots" content="index, follow" />
	<link
		rel="icon"
		href="https://res.cloudinary.com/dmy8yp9el/image/upload/v1732875705/jikwt8fpsaznpcoxdywn.ico"
	/>
	<link rel="canonical" href={base} />
	{@html `
        <script type="application/ld+json">
            {
                "@context": "https://schema.org/",
                "@type": "${type}",
                "url": "${base}",
                "name": "${title} • int-insights.com",
                "description": "${description}"
				"logo": "https://res.cloudinary.com/dmy8yp9el/image/upload/v1732875705/jikwt8fpsaznpcoxdywn.ico"
            }
        </script>
    `}
</svelte:head>
