<script lang="ts">
	import { MapTile } from '$lib/custom/blocks';
	import * as Card from '$lib/components/ui/card';
	import { Axis, BarChart, Bars, Chart, Grid, Svg, Tooltip, Highlight } from 'layerchart';
	import { scaleBand, scaleOrdinal, scaleTime } from 'd3-scale';
	import { format, PeriodType } from '@layerstack/utils';
	let { total_responses } = $props();

	const bardata = [
		{
			date: new Date('2024-11-02T21:00:00.000Z'),
			value: 73,
			baseline: 36
		},
		{
			date: new Date('2024-11-03T21:00:00.000Z'),
			value: 47,
			baseline: 21
		},
		{
			date: new Date('2024-11-04T21:00:00.000Z'),
			value: 49,
			baseline: 87
		},
		{
			date: new Date('2024-11-05T21:00:00.000Z'),
			value: 48,
			baseline: 42
		},
		{
			date: new Date('2024-11-06T21:00:00.000Z'),
			value: 63,
			baseline: 34
		},
		{
			date: new Date('2024-11-07T21:00:00.000Z'),
			value: 77,
			baseline: 46
		},
		{
			date: new Date('2024-11-08T21:00:00.000Z'),
			value: 37,
			baseline: 100
		},
		{
			date: new Date('2024-11-09T21:00:00.000Z'),
			value: 54,
			baseline: 82
		},
		{
			date: new Date('2024-11-10T21:00:00.000Z'),
			value: 68,
			baseline: 54
		},
		{
			date: new Date('2024-11-11T21:00:00.000Z'),
			value: 51,
			baseline: 60
		}
	];
</script>

<div class="m-4 grid gap-3">
	<div class="grid gap-2 lg:grid-cols-2">
		<div class="grid gap-2">
			<Card.Root class="lg:max-w-screen-md">
				<Card.Header>
					<Card.Title class="text-2xl">Poll Overview</Card.Title>
					<Card.Description>Total Responses: {total_responses}</Card.Description>
				</Card.Header>
				<Card.Footer></Card.Footer>
			</Card.Root>
			<Card.Root class="lg:max-w-screen-md">
				<Card.Header>
					<Card.Title class="text-2xl">Geographical Distribution</Card.Title>
					<Card.Description>Responses by County</Card.Description>
				</Card.Header>
				<Card.Content>
					<MapTile />
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
				<Card.Content></Card.Content>
				<Card.Footer>
					<div class="z-10 h-[300px] w-full rounded border p-4">
						<Chart
							data={bardata}
							x="value"
							xDomain={[0, null]}
							xNice
							y="date"
							yScale={scaleBand().padding(0.4)}
							padding={{ left: 16, bottom: 24 }}
							tooltip={{ mode: 'band' }}
						>
							<Svg>
								<Axis placement="bottom" grid rule />
								<Axis
									placement="left"
									format={(d) => format(d, PeriodType.Day, { variant: 'short' })}
									rule
								/>
								<Bars
									strokeWidth={1}
									class="fill-primary transition-colors group-hover:fill-gray-300"
								/>
								<Highlight area bar={{ class: 'fill-primary', strokeWidth: 1, radius: 4 }} />
							</Svg>
							<Tooltip.Root let:data>
								<Tooltip.Header
									>{format(data.date, PeriodType.Custom, {
										custom: 'eee, MMMM do'
									})}</Tooltip.Header
								>
								<Tooltip.List>
									<Tooltip.Item label="value" value={data.value} />
								</Tooltip.List>
							</Tooltip.Root>
						</Chart>
					</div>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Response Distribution</Card.Title>
					<Card.Description>Share of responses to non-responses</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Card Content</p>
				</Card.Content>
				<Card.Footer>
					<p>Card Footer</p>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl">Detailed Results</Card.Title>
			<Card.Description>Breakdown by County</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>Card Content</p>
		</Card.Content>
		<Card.Footer>
			<p>Card Footer</p>
		</Card.Footer>
	</Card.Root>
</div>
