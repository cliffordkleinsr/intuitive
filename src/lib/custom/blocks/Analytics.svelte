<script lang="ts">
	import { CakeMap, MapTile } from '$lib/custom/blocks';
	import * as Card from '$lib/components/ui/card';
	import { Axis, BarChart, Chart, Points, Spline, Svg } from 'layerchart';
	import { format } from '@layerstack/utils';
	import { scaleBand } from 'd3-scale';
	import { curveCatmullRom } from 'd3-shape';
	import * as Table from '$lib/components/ui/table';
	import { Progress } from '$lib/components/ui/progress';
	import { counties } from '$lib/geojson/counties';

	interface GenAnalytics {
		gender: string;
		count: number;
	}
	interface SecAnalytics {
		sector: string;
		count: number;
	}
	interface LocAnalytics {
		county: string;
		value: number;
	}

	interface AnsStats {
		count: number;
		answer: string;
		percentage: number;
	}
	interface Analytics {
		question: string;
		question_type: string;
		answer_statistics: AnsStats[];
	}
	let {
		total_responses,
		gender,
		sector,
		county,
		analytics
	}: {
		total_responses: number;
		gender: GenAnalytics[];
		sector: SecAnalytics[];
		county: LocAnalytics[];
		analytics: Analytics[];
	} = $props();

	const fixed_sec = sector.map((el) => (el.sector === '' ? { ...el, sector: 'Other' } : el));
	let curve = curveCatmullRom;
	// $inspect(fixed_sec)
</script>

<div class="m-4 grid gap-3">
	<div class="grid gap-2 lg:grid-cols-2">
		<div class="grid gap-2">
			<Card.Root class="lg:max-w-screen-md">
				<Card.Header>
					<Card.Title class="text-2xl">Poll Overview</Card.Title>
					<Card.Description class="text-lg"
						>Total Responses: <span class="font-bold text-black/60">{total_responses}</span
						></Card.Description
					>
				</Card.Header>
				<Card.Content></Card.Content>
			</Card.Root>
			<Card.Root class="lg:max-w-screen-md">
				<Card.Header>
					<Card.Title class="text-2xl">Geographical Distribution</Card.Title>
					<Card.Description>Responses by County</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[600px]">
						<CakeMap geoObject={counties} locale_analytics={county} />
					</div>
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
					<p>4m30s</p>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Gender Distribution</Card.Title>
					<Card.Description>Responses by Gender</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class=" h-[200px] w-full rounded border p-4">
						<BarChart
							data={gender}
							padding={{ left: 32, bottom: 16 }}
							x="count"
							y="gender"
							c="count"
							props={{
								bars: { class: 'fill-blue-400' },
								xAxis: { format: (value) => format(Math.abs(value), 'metric') }
							}}
							orientation="horizontal"
						/>
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Response Distribution</Card.Title>
					<Card.Description>Share of responses by sector</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[350px] w-full rounded border p-4">
						<Chart
							data={fixed_sec}
							x="sector"
							xScale={scaleBand()}
							y="count"
							yPadding={[0, 10]}
							padding={{ top: 32, bottom: 8 }}
							radial
						>
							<Svg center>
								<Axis
									placement="radius"
									grid={{ class: 'stroke-surface-content/20 fill-blue-300/20' }}
									ticks={[0, 5, 10]}
									format={(d) => ''}
								/>
								<Axis placement="angle" grid={{ class: 'stroke-surface-content/20' }} />
								<Spline {curve} class="fill-blue-400/20 stroke-blue-400" />
								<Points class="fill-blue-400 stroke-surface-200" />
							</Svg>
						</Chart>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
	{#each analytics as statistic, ix}
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-2xl">{ix === 0 ? 'Detailed Results' : ''}</Card.Title>
				<Card.Description class=" font-semibold">{statistic.question}</Card.Description>
			</Card.Header>
			<Card.Content class="overflow-x-auto">
				<!-- Add horizontal scroll only if needed -->
				<Table.Root class="w-full min-w-[300px]">
					<!-- Set minimum width -->
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[40px]"><!-- Reduced width --></Table.Head>
							<Table.Head class="w-full md:w-[40%]">Answers</Table.Head>
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
			</Card.Content>
			<Card.Footer></Card.Footer>
		</Card.Root>
	{/each}
	<!-- <Card.Root>
		<Card.Header>
		
		</Card.Header>
		<Card.Content class="grid gap-5">
			{
		</Card.Content>
	</Card.Root> -->
</div>
