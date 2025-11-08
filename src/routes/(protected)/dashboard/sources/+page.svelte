<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import SettingsUtmbuilder from './settings-Utmbuilder.svelte';
	import ClickableUtility from './ClickableUtility.svelte';
	let { data }: PageProps = $props();

	const {
		sources,
		external,
		direct,
		top_source,
		source_distribution,
		medium_distribution,
		campaign_distribution
	} = data;
</script>

<section class="flex flex-col gap-2 p-10">
	<h1 class="text-3xl font-semibold">Source Tracking</h1>
	<p class="text-sm text-muted-foreground">Analyze visitor sources and traffic origins</p>
	<div class="grid gap-2 pt-5">
		<h1 class="mb-3 text-xl">Source Tracking Analytics</h1>
		<div class="grid grid-cols-4 gap-4">
			<ClickableUtility variable={sources} count={sources.length}>
				Total Page Visits
			</ClickableUtility>
			<ClickableUtility variable={external} count={external.length}>
				Total External Sources
			</ClickableUtility>
			<ClickableUtility variable={direct} count={direct.length}>
				Total Direct Visits
			</ClickableUtility>
			<Card.Root>
				<Card.Header>
					<Card.Title>{top_source?.count ?? 0}</Card.Title>
					<Card.Description
						>{top_source?.source === 'fb' ? 'FaceBook' : top_source?.source}</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<p>Top Source</p>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
	<div class="grid gap-2 pt-5">
		<h1 class="text-3xl font-semibold">UTM Campaign Tracking</h1>
		<p class="text-sm text-muted-foreground">Track your marketing campaigns and traffic sources</p>
		<div class="mt-2 grid grid-cols-3 gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-center">UTM Source Distribution</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3">
					{#if source_distribution.length === 0}
						<div class="grid place-content-center gap-2">
							<TriangleAlert class="size-20 text-primary" />
							<p class="text-lg text-muted-foreground">No Data!</p>
						</div>
					{:else}
						{#each source_distribution as distribution}
							{#if distribution.source}
								<div class="flex items-center justify-between rounded-md bg-secondary p-2">
									<span class="flex items-center gap-2 text-sm">
										{#if distribution.source === 'faceBook' || distribution.source === 'fb'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												><path
													fill="currentColor"
													d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
												/></svg
											>
										{:else if distribution.source === 'instagram'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												><path
													fill="currentColor"
													d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
												/></svg
											>
										{:else if distribution.source === 'google'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												><path
													fill="currentColor"
													d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81"
												/></svg
											>
										{:else if distribution.source === 'linkedin'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												><path
													fill="currentColor"
													d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
												/></svg
											>
										{/if}
										{distribution.source === 'fb' ? 'Facebook' : distribution.source}
									</span>
									<Badge variant="default">{distribution.count}</Badge>
								</div>
							{/if}
						{/each}
					{/if}
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-center">UTM Medium Distribution</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3">
					{#if medium_distribution.length === 0}
						<div class="grid place-content-center gap-2">
							<TriangleAlert class="size-20 text-primary" />
							<p class="text-lg text-muted-foreground">No Data!</p>
						</div>
					{:else}
						{#each medium_distribution as distribution}
							{#if distribution.medium}
								<div class="flex items-center justify-between rounded-md bg-secondary p-2">
									<span class="text-sm">{distribution.medium}</span>
									<Badge variant="default">{distribution.count}</Badge>
								</div>
							{/if}
						{/each}
					{/if}
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-center">UTM Campaign Distribution</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3">
					{#if campaign_distribution.length === 0}
						<div class="grid place-content-center gap-2">
							<TriangleAlert class="size-20 text-primary" />
							<p class="text-lg text-muted-foreground">No Data!</p>
						</div>
					{:else}
						{#each campaign_distribution as distribution}
							{#if distribution.campaign}
								<div class="flex items-center justify-between rounded-md bg-secondary p-2">
									<span class="text-sm">{distribution.campaign}</span>
									<Badge variant="default">{distribution.count}</Badge>
								</div>
							{/if}
						{/each}
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
	</div>
	<div class="grid gap-2 pt-5">
		<Card.Root>
			<Card.Header>
				<Card.Title>UTM Campaign URL Generator</Card.Title>
				<Card.Description>Create trackable URLs for your marketing campaigns</Card.Description>
			</Card.Header>
			<Card.Content>
				<h1 class="text-lg font-semibold">Custom UTM Builder</h1>
				<SettingsUtmbuilder />
			</Card.Content>
		</Card.Root>
	</div>
</section>
