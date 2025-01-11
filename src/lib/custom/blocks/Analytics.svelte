<script lang="ts">
	import { CakeMap } from '$lib/custom/blocks';
	import * as Card from '$lib/components/ui/card';
	import { Axis, BarChart, Bars, Chart, PieChart, Svg, Tooltip, Highlight } from 'layerchart';
	import { format } from '@layerstack/utils';
	import * as Table from '$lib/components/ui/table';
	import { Progress } from '$lib/components/ui/progress';
	import { counties } from '$lib/geojson/counties';
	import { interpolateOranges, interpolateRdBu } from 'd3-scale-chromatic';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Download from 'lucide-svelte/icons/download';
	import { quantize } from 'd3-interpolate';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import UnfoldVertical from 'lucide-svelte/icons/unfold-vertical';
	import FileText from 'lucide-svelte/icons/file-text';
	import { toast } from 'svelte-sonner';
	import type { GenAnalytics, SecAnalytics, LocAnalytics, Analytics } from '$lib/types';

	let {
		total_responses,
		gender,
		sector,
		county,
		analytics,
		raw,
		subtype
	}: {
		total_responses: number;
		gender: GenAnalytics[];
		sector: SecAnalytics[];
		county: LocAnalytics[];
		analytics: Analytics[];
		raw: string;
		subtype?: string;
	} = $props();

	// let open = $state<boolean>(false);

	let variable = $state() as boolean[];
	let printstate = $state(false) as boolean;
	variable = analytics.map((x) => x.question_type !== 'Ranking' && x.question_type !== 'Single');

	function exportRaw(text: string) {
		if (text.length === 0) {
			toast.info('There is no data to export');
		} else {
			let fname = 'report.csv';
			const File = new Blob([text], { type: 'text/csv' });
			window.URL = window.URL || window.webkitURL;
			const dlBtn = document.createElement('a');
			dlBtn.setAttribute('href', window.URL.createObjectURL(File));
			dlBtn.setAttribute('download', fname);
			dlBtn.click();

			// Clean up and remove the link
			document.body.removeChild(dlBtn);
		}
	}

	const keyColors = [
		'hsl(var(--color-orange))',
		'hsl(var(--color-violet))',
		'hsl(var(--color-cyan))',
		'hsl(var(--color-blue))',
		'hsl(var(--color-stone))'
	];

	// Transform data for stacked chart
	// svelte-ignore non_reactive_update
	let processedData: any[] = [];
	let rankData: any[] = [];
	for (const { question_type, answer_statistics } of analytics) {
		if (question_type === 'Ranking') {
			processedData = ['1', '2', '3', '4', '5'].map((rank) => {
				rankData = answer_statistics.filter((d) => d.rank === rank);
				return {
					rank,
					...Object.fromEntries(rankData.map((d) => [d.answer, d.percentage]))
				};
			});
		}
	}

	let keys: any = $state({});
	let series: any[] = $state([]);
	if (processedData.length > 0) {
		keys = Object.keys(processedData[0]).filter((k) => k !== 'rank');
		series = processedData.map((_, index) => ({
			key: keys[index],
			color: keyColors[index]
		}));
	}

	$effect(() => {
		window.onafterprint = function () {
			variable = variable.map((x) => (x = !x));
			printstate = !printstate;
		};

		return () => {
			processedData = [];
			rankData = [];
			variable = [];
		};
	});
</script>

<div class="mx-auto grid gap-3 px-2 py-7">
	<div class="grid gap-2 md:grid-cols-1 lg:grid-cols-2">
		<div class="grid gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-2xl">Poll Overview</Card.Title>
					<Card.Description class="text-lg">
						Total Responses: <span class="font-bold text-black/60 dark:text-white/60"
							>{total_responses}</span
						>
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div id="kutton" class="flex gap-2">
						<Button
							variant="secondary"
							onclick={() => {
								if (subtype === undefined) {
									toast.warning('Subscribe to a plan to complete this action');
								} else {
									variable = variable.map((x) => (x = !x));
									printstate = !printstate;
									setTimeout(() => {
										total_responses > 0 ? window.print() : toast.info('There is no data to print');
									}, 50);
								}
							}}
							size="sm"
						>
							Export PDF <FileText />
						</Button>
						<Button
							variant="secondary"
							size="sm"
							onclick={() => {
								if (subtype === 'Premium Business') {
									exportRaw(raw);
								} else {
									toast.warning('Subscribe to a Premium Business plan to complete this action');
								}
							}}
						>
							Export Raw <Download />
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-2xl">Geographical Distribution</Card.Title>
					<Card.Description>Responses by County</Card.Description>
				</Card.Header>
				<Card.Content class="relative">
					<div
						class={[
							subtype === 'Standard Business' || subtype === 'Premium Business'
								? ''
								: 'pointer-events-none blur-md',
							'h-[600px]'
						]}
					>
						<CakeMap geoObject={counties} locale_analytics={county} />
					</div>
					{#if subtype === 'One-time' || subtype === 'Basic' || subtype === undefined}
						<div class="absolute top-1/2 lg:right-[250px]">
							<h1 class="text-lg font-semibold dark:text-stone-800">
								Subscribe to a business plan or higher
							</h1>
						</div>
					{/if}
					<!-- <MapTile /> -->
				</Card.Content>
			</Card.Root>
		</div>
		<div class="grid gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-2xl">Average Completion Time</Card.Title>
					<Card.Description></Card.Description>
				</Card.Header>
				<Card.Footer class="text-xl font-semibold">
					<p>TBA</p>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Gender Distribution</Card.Title>
					<Card.Description>Responses by Gender</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="relative h-52 w-full rounded border p-4">
						<BarChart
							data={gender}
							padding={{ left: 32, bottom: 16 }}
							x="count"
							y="gender"
							c="count"
							props={{
								bars: { class: 'fill-orange-400' },
								xAxis: { format: (value) => format(Math.abs(value), 'metric') }
							}}
							orientation="horizontal"
						/>
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root class="hidden lg:block">
				<Card.Header>
					<Card.Title>Response Distribution</Card.Title>
					<Card.Description>Share of responses by sector</Card.Description>
				</Card.Header>
				<Card.Content class="relative">
					<div
						class={[
							subtype === undefined ? 'pointer-events-none blur-md' : '',
							'w-full rounded border p-4 lg:h-[350px]'
						]}
					>
						<PieChart
							data={sector}
							key="sector"
							value="count"
							innerRadius={-20}
							cornerRadius={5}
							padAngle={0.02}
							placement="right"
							legend={{
								classes: { label: 'text-xs block', swatches: 'block' },
								placement: 'top-left',
								orientation: 'vertical'
							}}
							cRange={quantize(interpolateOranges, 20)}
						/>
					</div>
					{#if subtype === undefined}
						<div class="absolute top-1/2 lg:right-[250px]">
							<h1 class="text-lg font-semibold dark:text-foreground">
								Subscribe to a plan to view
							</h1>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
	</div>
	{#each analytics as statistic, ix}
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-2xl">{ix === 0 ? 'Detailed Results' : ''}</Card.Title>
				<Card.Description class=" font-semibold">
					<span>{ix + 1}.</span> {statistic.question}</Card.Description
				>
			</Card.Header>
			<Card.Content class="relative overflow-x-auto">
				{#if statistic.question_type === 'Ranking'}
					<div
						class={[
							variable[ix] && printstate ? 'max-w-[800px]' : '',
							subtype === undefined ? 'pointer-events-none blur-md' : '',
							'mb-3 h-96 rounded border p-4'
						]}
					>
						<BarChart
							data={processedData}
							orientation="horizontal"
							y="rank"
							{series}
							seriesLayout="stack"
							props={{
								xAxis: { format: 'metric' },
								yAxis: { format: 'none' }
							}}
							legend
						/>
					</div>
					{#if subtype === undefined}
						<div class="absolute left-24 top-1/3 lg:left-[600px]">
							<h1 class="text-lg font-semibold dark:text-foreground">
								Subscribe to a plan to view
							</h1>
						</div>
					{/if}
				{/if}
				<!-- Add horizontal scroll only if needed -->
				{#if statistic.question_type === 'Single' || statistic.question_type === 'Ranking'}
					<Collapsible.Root class="space-y-2" bind:open={variable[ix]}>
						<div id="kutton">
							<Collapsible.Trigger class={buttonVariants({ variant: 'secondary', size: 'sm' })}>
								<UnfoldVertical />
								Expand
							</Collapsible.Trigger>
						</div>
						<Collapsible.Content>
							<Table.Root class="w-full min-w-[300px]">
								<!-- Set minimum width -->
								<Table.Header>
									<Table.Row>
										<Table.Head class="w-[40px]"><!-- Reduced width --></Table.Head>
										<Table.Head
											class="w-full {statistic.question_type === 'Ranking'
												? 'md:w-[20%]'
												: 'md:w-[40%]'}"
											>{statistic.question_type === 'Ranking' ? 'Option' : 'Answer'}</Table.Head
										>
										{#if statistic.question_type === 'Ranking'}
											<Table.Head class="w-full md:w-[20%]">Rank</Table.Head>
										{/if}
										<Table.Head class="w-[60px] md:w-[25%]"></Table.Head>
										<Table.Head class="w-[80px] text-right">%</Table.Head>
										<Table.Head class="w-[60px] text-right">#</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each statistic.answer_statistics as res, ix}
										<Table.Row class="space-y-1">
											<!-- Reduced spacing -->
											<Table.Cell class="text-sm font-normal">A{ix + 1}</Table.Cell>
											<Table.Cell class="line-clamp-3 text-sm font-normal">{res.answer}</Table.Cell>
											{#if statistic.question_type === 'Ranking'}
												<Table.Cell class="text-sm font-normal">{res.rank}</Table.Cell>
											{/if}
											<Table.Cell class="font-normal">
												<Progress value={res.percentage} class="h-2 w-full" />
											</Table.Cell>
											<Table.Cell class="text-right text-sm font-normal">
												{Math.round(res.percentage)}%
											</Table.Cell>
											<Table.Cell class="text-right text-sm font-normal">
												{res.count}
											</Table.Cell>
										</Table.Row>
										{#if res.rank === '5'}
											<Table.Row class="bg-primary/5">
												<Table.Cell></Table.Cell>
												<Table.Cell></Table.Cell>
												<Table.Cell></Table.Cell>
												<Table.Cell></Table.Cell>
												<Table.Cell class="text-right text-sm font-normal">100%</Table.Cell>
												<Table.Cell class="text-right text-sm font-normal">
													{total_responses}
												</Table.Cell>
											</Table.Row>
										{/if}
									{/each}
								</Table.Body>
							</Table.Root>
						</Collapsible.Content>
					</Collapsible.Root>
				{:else}
					<Table.Root class="w-full min-w-[300px]">
						<!-- Set minimum width -->
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-[40px]"><!-- Reduced width --></Table.Head>
								<Table.Head
									class="w-full {statistic.question_type === 'Ranking'
										? 'md:w-[20%]'
										: 'md:w-[40%]'}"
									>{statistic.question_type === 'Ranking' ? 'Option' : 'Answer'}</Table.Head
								>
								{#if statistic.question_type === 'Ranking'}
									<Table.Head class="w-full md:w-[20%]">Rank</Table.Head>
								{/if}
								<Table.Head class="w-[60px] md:w-[25%]"></Table.Head>
								<Table.Head class="w-[80px] text-right">%</Table.Head>
								<Table.Head class="w-[60px] text-right">#</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each statistic.answer_statistics as res, ix}
								<Table.Row class="space-y-1">
									<!-- Reduced spacing -->
									<Table.Cell class="text-sm font-normal">A{ix + 1}</Table.Cell>
									<Table.Cell class="line-clamp-3 text-sm font-normal">{res.answer}</Table.Cell>
									{#if statistic.question_type === 'Ranking'}
										<Table.Cell class="text-sm font-normal">{res.rank}</Table.Cell>
									{/if}
									<Table.Cell class="font-normal">
										<Progress value={res.percentage} class="h-2 w-full" />
									</Table.Cell>
									<Table.Cell class="text-right text-sm font-normal">
										{Math.round(res.percentage)}%
									</Table.Cell>
									<Table.Cell class="text-right text-sm font-normal">
										{res.count}
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{/if}
			</Card.Content>
			<Card.Footer></Card.Footer>
		</Card.Root>
	{/each}
</div>

<style>
	@media print {
		@page {
			size: auto; /* auto is the initial value */
			margin: 0; /* this affects the margin in the printer settings */
		}
		#kutton {
			visibility: hidden;
		}
	}
	:root {
		--color-orange: 27, 96%, 61%;
		--color-violet: 255, 92%, 76%;
		--color-blue: 213, 94%, 68%;
		--color-cyan: 188, 86%, 53%;
		--color-stone: 24, 5%, 64%;
	}
</style>
