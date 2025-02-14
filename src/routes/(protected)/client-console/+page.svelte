<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import { Button } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import * as Tabs from '$lib/components/ui/tabs';
	import DataTable from '$lib/components/data-table.svelte';
	import { columns } from './(tableau)/columns';
	let { data }: { data: PageData } = $props();
	const {
		all_surv,
		draft_surv,
		live_surv,
		closed_surv,
		count,
		payment,
		user: { fullname }
	} = data;
</script>

<div
	class="m-4 mt-4 flex flex-col gap-10"
	data-title="Welcome {fullname}"
	data-intro="This is your dashboard"
>
	<div class="grid grid-cols-3 gap-2 md:grid-cols-2 md:gap-8">
		<Card.Root data-intro="Create new surveys by clicking here" class="space-y-5 sm:col-span-1">
			<Card.Header>
				<Card.Title><ChartLine class="size-6 text-primary" /></Card.Title>
				<Card.Description class="text-balance leading-relaxed">
					Create engaging surveys to improve your audience:
				</Card.Description>
			</Card.Header>
			<Card.Footer>
				<Button variant="default" href="/client-console/surveys/create">Create New Survey</Button>
			</Card.Footer>
		</Card.Root>
		<Card.Root
			data-intro="This displays your total surveys"
			class="max-w-lg"
			data-x-chunk-name="dashboard-05-chunk-1"
			data-x-chunk-description="A stats card showing this week's total sales in USD, the percentage difference from last week, and a progress bar."
		>
			<Card.Header class="pb-2 ">
				<Card.Description>Total surveys</Card.Description>
				<Card.Title class="text-4xl">{all_surv.length}</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-xs text-muted-foreground">+{all_surv.length}% all time</div>
			</Card.Content>
			<Card.Footer>
				<Progress value={all_surv.length} aria-label="{all_surv.length}% increase" />
			</Card.Footer>
		</Card.Root>
		<Card.Root
			data-intro="These are the total people who have taken a survey that you've created"
			class="max-w-lg"
			data-x-chunk-name="dashboard-05-chunk-2"
			data-x-chunk-description="A stats card showing this month's total sales in USD, the percentage difference from last month, and a progress bar."
		>
			<Card.Header class="pb-2">
				<Card.Description>Total agents</Card.Description>
				<Card.Title class="text-3xl">{count}</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-xs text-muted-foreground">+{count / 100}% from last month</div>
			</Card.Content>
			<Card.Footer>
				<Progress value={count} aria-label="{count / 100}% increase" />
			</Card.Footer>
		</Card.Root>
	</div>
	<Tabs.Root value="draft" class="mx-auto w-96 lg:w-full">
		<Tabs.List class="mx-5 grid w-80 grid-cols-3 lg:w-[35rem]">
			<Tabs.Trigger value="draft" data-intro="This tab shows draft surveys.">Draft</Tabs.Trigger>
			<Tabs.Trigger value="running" data-intro="This tab shows surveys that are live."
				>Running</Tabs.Trigger
			>
			<Tabs.Trigger value="completed" data-intro="This tab shows surveys that have been completed."
				>Completed</Tabs.Trigger
			>
		</Tabs.List>
		{#if payment}
			<Tabs.Content value="draft">
				<DataTable data={draft_surv} columns={columns(payment.status, 'Draft')} />
			</Tabs.Content>
			<Tabs.Content value="running">
				<DataTable data={live_surv} columns={columns(payment.status, 'Live')} />
			</Tabs.Content>
			<Tabs.Content value="completed">
				<DataTable data={closed_surv} columns={columns(payment.status, 'Closed')} />
			</Tabs.Content>
		{/if}
	</Tabs.Root>
</div>
