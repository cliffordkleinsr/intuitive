<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { BarChart } from 'layerchart';
	import { Button } from '$lib/components/ui/button';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	let { data }: { data: PageData } = $props();
	const { survey_time, surveys, count, total_clients } = data;

	const responses = surveys.map((e) => e.responses);
	const survey_count = surveys.map((e) => e.title).length;
	const agents = surveys.map((e) => e.total);

	const sumArray = (array: any[]) => array.reduce((a, b) => a + b, 0);
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
	<div class="flex items-center justify-between space-y-2">
		<h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Surveys</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{survey_count}
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-end">
				<Button class="w-full" variant="outline" href="/dashboard/surveys/manage">
					View All <ArrowUpRight />
				</Button>
			</Card.Footer>
		</Card.Root>
		<!-- End -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Responses</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{sumArray(responses)}</div>
			</Card.Content>
		</Card.Root>
		<!-- End -->
		<!-- <Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Respondents</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{sumArray(agents)}</div>
			</Card.Content>
		</Card.Root> -->
		<!--  End -->
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Clients</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{total_clients}</div>
			</Card.Content>
			<Card.Footer class="flex justify-end">
				<Button class="w-full" variant="outline" href="/dashboard/users/clients">
					Manage Clients <ArrowUpRight />
				</Button>
			</Card.Footer>
		</Card.Root>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Surveys</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{count}</div>
			</Card.Content>
			<Card.Footer class="flex justify-end">
				<Button class="w-full" variant="outline" href="/dashboard/surveys/manage">
					Manage All <ArrowUpRight />
				</Button>
			</Card.Footer>
		</Card.Root>
	</div>
	<div class="grid gap-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>Recent Surveys</Card.Title>
				<Card.Description></Card.Description>
			</Card.Header>
			<Card.Content>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Survey</Table.Head>
							<Table.Head>Responses</Table.Head>
							<Table.Head>Total Agents</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each surveys as survey}
							<Table.Row>
								<Table.Cell class="font-medium">{survey.title}</Table.Cell>
								<Table.Cell>{survey.responses}</Table.Cell>
								<Table.Cell>{survey.total}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>
