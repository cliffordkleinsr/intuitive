<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import Clock from 'lucide-svelte/icons/clock';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	let checked = $state(false);
	let { current_ix, question_cnt, uri, title } = $derived(data);
	// let v = () => current_ix
</script>

<div class="mx-auto flex h-fit max-w-sm flex-col py-20">
	<h1 class="text-center font-semibold antialiased">{title}</h1>
	<Card.Root class="mt-5">
		<Card.Header class="rounded-t-lg bg-primary text-center">
			<Card.Title class="text-xl">Total Survey Questions</Card.Title>
			<!-- <Card.Title class="text-sm text-neutral-500">{survId}</Card.Title> -->
			<Card.Description>
				<Button variant="ghost" class="text-white" size="icon">
					<Clock class="size-5" />
					{question_cnt}'
				</Button>
			</Card.Description>
		</Card.Header>
		<Card.Content class="py-10 text-center">
			<!-- {#if page.params?.surveyId === '5b16a8fd-85b3-43ff-9180-1a97a53f7bc5'}
				<Button
				variant="outline"
				class="rounded-xl"
				size="lg"
				disabled={!checked && !(current_ix > 0)}
				href={checked
					? current_ix === 0
						? uri
						: uri
					: current_ix > 0
						? uri
						: undefined}
			>
				{current_ix > 0 ? 'Continue where you left off' : 'Start the survey'}
			</Button>
			{:else} -->
			<Button
				variant="outline"
				class="rounded-xl"
				size="lg"
				disabled={!checked && !(current_ix > 0)}
				href={checked
					? current_ix === 0
						? `/anonymous/${page.params.surveyId}/pre`
						: uri
					: current_ix > 0
						? uri
						: undefined}
			>
				{current_ix > 0 ? 'Continue where you left off' : 'Start the survey'}
			</Button>
			<!-- {/if} -->
		</Card.Content>
		<Card.Footer>
			<div class="flex flex-col gap-2 text-center">
				<h1 class="font-mono text-xs font-bold text-neutral-600 dark:text-slate-300">
					Your responses are completely anonymous
				</h1>
				<p class="font-mono text-xs tracking-tight text-neutral-600 dark:text-slate-400">
					By accepting to take this survey, a specific set of user's device data will be collected
					and potentially combined with answers to the questionnaires, in order for Intuitive
					Insights to better understand the user and improve targeting of future surveys.
				</p>
			</div>
		</Card.Footer>
	</Card.Root>
	{#if !(current_ix > 0)}
		<div class="mx-auto flex items-center space-x-2 py-5">
			<div class="relative inline-flex items-center justify-center">
				{#if !checked}
					<span
						class="pointer-events-none absolute inline-flex h-6 w-6 animate-ping rounded-full bg-primary opacity-75"
					></span>
				{/if}
				<Checkbox id="terms" bind:checked aria-labelledby="terms-label" />
			</div>
			<div class="grid gap-1.5 leading-none">
				<Label
					for="terms1"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Accept terms and conditions
				</Label>
				<p class="text-center text-xs">
					By taking this survey you agree to the <a
						href="/terms"
						class=" text-blue-400 underline-offset-1 hover:underline">Terms & Conditions</a
					>
				</p>
			</div>
		</div>
	{/if}
</div>
