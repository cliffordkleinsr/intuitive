<script lang="ts">
	import { CakeMap, MapTile } from '$lib/custom/blocks';
	import * as Card from '$lib/components/ui/card';
	import { Area, Axis, BarChart, Chart, Points, Spline, Svg } from 'layerchart';
	import { format } from '@layerstack/utils';
	import { scaleBand } from 'd3-scale';
	import { curveLinearClosed, curveCatmullRom } from 'd3-shape';
	import * as Table from '$lib/components/ui/table';
	import { Progress } from '$lib/components/ui/progress';

	interface GenAnalytics {
		gender: string;
		count: number;
	}
	interface SecAnalytics {
		sector: string;
		count: number;
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
		analytics
	}: {
		total_responses: number;
		gender: GenAnalytics[];
		sector: SecAnalytics[];
		analytics: Analytics[];
	} = $props();
	let curve = curveCatmullRom;
</script>

<div class="m-4 grid gap-3">
	<div class="grid gap-2 lg:grid-cols-2">
		<div class="grid gap-2">
			<Card.Root class="lg:max-w-screen-md">
				<Card.Header>
					<Card.Title class="text-2xl">Poll Overview</Card.Title>
					<Card.Description class="text-lg">Total Responses: {total_responses}</Card.Description>
				</Card.Header>
				<Card.Content>
				</Card.Content>
			</Card.Root>
			<Card.Root class="lg:max-w-screen-md">
				<Card.Header>
					<Card.Title class="text-2xl">Geographical Distribution</Card.Title>
					<Card.Description>Responses by County</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="h-[600px]">
						<CakeMap />
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
								bars: { class: 'fill-blue-500' },
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
					<div class="h-[250px] w-full rounded border p-4">
						<Chart
							data={sector}
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
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl">Detailed Results</Card.Title>
			<Card.Description>Breakdown by County</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-5">
			{#each analytics as statistic}
				<Card.Root>
					<Card.Header>
						<Card.Title></Card.Title>
						<Card.Description class="text-xs">{statistic.question}</Card.Description>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head class="w-[70px]">#</Table.Head>
									<Table.Head class="lg:w-[800px]">Answers</Table.Head>
									<Table.Head></Table.Head>
									<Table.Head class="text-right">Percentage</Table.Head>
									<Table.Head class="text-right">Count</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each statistic.answer_statistics as res, ix}
									<Table.Row class="space-y-2">
										<Table.Cell class="font-normal">A{ix + 1}</Table.Cell>
										<Table.Cell class=" line-clamp-3 font-normal">{res.answer}</Table.Cell>
										<Table.Cell class="font-normal">
											<Progress value={res.percentage} class="h-2 w-full lg:w-[80%]" />
										</Table.Cell>
										<Table.Cell class="text-right font-normal"
											>{Math.round(res.percentage)}%</Table.Cell
										>
										<Table.Cell class="text-right font-normal ">{res.count}</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</Card.Content>
					<Card.Footer></Card.Footer>
				</Card.Root>
			{/each}
		</Card.Content>
	</Card.Root>
</div>
