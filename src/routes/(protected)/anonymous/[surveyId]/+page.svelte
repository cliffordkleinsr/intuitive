<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import Clock from 'lucide-svelte/icons/clock';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	let { current_ix, question_cnt, uri, title } = $derived(data);
</script>

<div class="mx-auto flex h-fit max-w-sm flex-col py-20">
	<h1 class="text-center font-semibold antialiased">{title}</h1>
	<Card.Root class="mt-5">
		<Card.Header class="rounded-t-lg bg-primary text-center">
			<Card.Title class="text-xl">Total Survey Questions</Card.Title>
			<Card.Description>
				<Button variant="ghost" class="text-white" size="icon">
					<Clock class="size-5" />
					{question_cnt}'
				</Button>
			</Card.Description>
		</Card.Header>
		<Card.Content class="py-10 text-center">
			<Button
				variant="outline"
				class="rounded-xl"
				size="lg"
				href={page.params.surveyId === '377db4fa-c085-4cb3-b77e-c17e860e6fd4' ||
				page.params.surveyId === '8cfce5fd-0f58-446c-8009-901cf289869a'
					? `/anonymous/${page.params.surveyId}/all`
					: uri}
			>
				{current_ix > 0 ? 'Continue where you left off' : 'Start the survey'}
			</Button>
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
</div>
