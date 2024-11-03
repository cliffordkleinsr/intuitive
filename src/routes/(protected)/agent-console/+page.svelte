<script lang="ts">
	import { page } from '$app/stores';
	import Pretoast from '$lib/custom/blocks/pretoast.svelte';
	import { Button } from '$lib/components/ui/button';
	import { sineInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import * as Card from '$lib/components/ui/card';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	// custom param message
	let msg = $state<string>();
	let visible = $state(true);
	let { data } = $props();

	const { history, total_points, total_paid, total_payable, complete, pending, payouts } = data;

	setTimeout(() => {
		visible = false;
	}, 2000);

	function formatter(val: Date) {
		return 'Week of\n' + new Date(val).toLocaleDateString();
	}

	let message = $derived($page.url.searchParams.get('notification') ?? '');

	let taken = $state<any[]>([]);
	let count = $state<any[]>([]);
	if (history.length > 0) {
		taken = history.map((item) => formatter(item.week));
		count = history.map((item) => item.count);
	}
</script>

{#if visible && msg}
	<div transition:fade={{ delay: 200, duration: 300, easing: sineInOut }}>
		<Pretoast {message} type="warning" />
	</div>
{/if}
<div class="m-4 mt-2 grid gap-10">
	<div class="mx-auto grid w-full gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
		<Card.Root class="space-y-5 sm:col-span-1">
			<Card.Header class="mb-3">
				<Card.Title></Card.Title>
				<Card.Description>My Survey History</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-4xl font-semibold text-green-500">
					{complete} <span class="text-xl text-muted-foreground">Completed</span>
				</p>
			</Card.Content>
			<Card.Footer>
				<Button
					variant="outline"
					href="/agent-console/surveys/history"
					class="flex w-full gap-2 bg-green-500 text-white hover:bg-green-500/80 hover:text-white"
				>
					View history
					<ArrowUpRight class="size-4" />
				</Button>
			</Card.Footer>
		</Card.Root>
		<Card.Root class="max-w-lg space-y-2">
			<Card.Header class="mb-2 ">
				<Card.Description class="flex gap-16">
					<span>Total Points Earned</span>
					<span>Total Points Paid</span>
					<span>Total Points Payable</span>
				</Card.Description>
				<Card.Title class="ml-3 grid grid-cols-3 gap-10 text-4xl">
					<span>{total_points}</span>
					<span>{total_paid}</span>
					<span>{total_payable}</span>
				</Card.Title>
				<Card.Content></Card.Content>
				<Card.Footer class="pt-3">
					<Button class="flex w-full gap-2" variant="secondary" href="/agent-console/surveys/take">
						Recieve Payments
						<ArrowUpRight class="size-4" />
					</Button>
				</Card.Footer>
			</Card.Header>
		</Card.Root>
		<Card.Root class="lg:max-w-lg">
			<Card.Header class="mb-2">
				<Card.Description>Cumulative Surveys</Card.Description>
				<Card.Title class="text-4xl text-green-500">{complete + pending}</Card.Title>
				<Card.Description>Eligible Surveys</Card.Description>
				<Card.Title class="text-4xl text-destructive">{pending}</Card.Title>
				<Card.Footer class="pt-4">
					<Button class="flex w-full gap-2" variant="secondary" href="/agent-console/surveys/take">
						Take a survey
						<ArrowUpRight class="size-4" />
					</Button>
				</Card.Footer>
			</Card.Header>
		</Card.Root>
	</div>
	{#if count.length > 0}
		<p></p>
	{:else}
		<p class="m-5 text-sm italic">take a survey to see your stats grow</p>
	{/if}
</div>
{#if payouts.length > 0}
	<div class="prose m-4 max-w-[23rem] lg:max-w-full">
		<h2>Payout Request History</h2>
	</div>
{/if}
