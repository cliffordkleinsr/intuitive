<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import Clock from 'lucide-svelte/icons/clock';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: PageData } = $props();

	const { uri, current_ix, question_cnt, survId } = data.available_surv;
</script>

<div class="mx-auto mt-6 flex h-fit max-w-sm flex-col">
	<h1 class="text-center text-sm antialiased">Share your opinions on things that matter</h1>
	<Card.Root class="mt-5">
		<Card.Header class="rounded-t-lg bg-yellow-300 text-center">
			<Card.Title class="text-xl text-neutral-500">Total Survey Questions</Card.Title>
			<Card.Title class="text-sm text-neutral-500">ID: {survId}</Card.Title>
			<Card.Description>
				<Button variant="ghost" class="hover:bg-inherit hover:text-neutral-400" size="icon"
					><Clock class="size-5" /> {question_cnt}'</Button
				>
			</Card.Description>
		</Card.Header>
		<Card.Content class="mt-14 text-center">
			<Button variant="outline" class="rounded-xl" size="lg" href={uri}>
				{current_ix > 0 ? 'Continue where you left off' : 'Start the survey'}
			</Button>
		</Card.Content>
		<Card.Footer class="mt-7">
			<div class="flex flex-col gap-2 text-center">
				<h1 class="font-mono text-xs font-bold text-neutral-600 dark:text-slate-300">
					Your responses are completely anonymous
				</h1>
				<p class="font-mono text-xs tracking-tight text-neutral-600 dark:text-slate-400">
					By accepting to take this survey, a specific set of user's device data will be collected
					and potentially combined with answers to the questionnaires, in order for Intuitive Insights to better
					understand the user and improve targeting of future surveys.
				</p>
			</div>
		</Card.Footer>
	</Card.Root>
	<p class="mt-32 text-center text-xs">
		By taking this survey you agree to the <a
			href="##"
			class=" text-blue-400 underline-offset-1 hover:underline">Terms & Conditions</a
		>
	</p>
</div>
