 <script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Axis, Chart, Svg, Tooltip, Highlight, Bar } from 'layerchart';
	import { scaleBand } from 'd3-scale';

	import {
		eachHourOfInterval,
		eachDayOfInterval,
		eachMonthOfInterval,
		startOfHour,
		startOfDay,
		startOfWeek,
		startOfMonth,
		startOfYear,
		endOfDay,
		endOfWeek,
		endOfYear,
		isSameHour,
		isSameDay,
		isSameMonth,
		format,
		endOfMonth,
		subDays,
		subMonths
	} from 'date-fns';

	import { cubicInOut } from 'svelte/easing';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	type TimeseriesPoint = {
		count: number;
		date: Date;
	};

    let { title, series, total }:{title: string, series: TimeseriesPoint[], total: number } = $props();


	type Period = 'hour' | 'day' | 'past_two_weeks' | 'last_month' | 'month' | 'past_year';

	function groupTimeseriesByPeriod(
		data: TimeseriesPoint[],
		type: Period,
		referenceDate = new Date()
	) {
		let intervals: Date[];
		let isSameFn: (a: Date, b: Date) => boolean;
		let formatStr: string;
		let startFn: (d: Date) => Date;

		switch (type) {
			case 'hour':
				intervals = eachHourOfInterval({
					start: startOfDay(referenceDate),
					end: endOfDay(referenceDate)
				});
				isSameFn = isSameHour;
				formatStr = 'h a';
				startFn = startOfHour;
				break;

			case 'day':
				intervals = eachDayOfInterval({
					start: startOfWeek(referenceDate, { weekStartsOn: 1 }),
					end: endOfWeek(referenceDate, { weekStartsOn: 1 })
				});
				isSameFn = isSameDay;
				formatStr = 'EEE';
				startFn = startOfDay;
				break;

			case 'past_two_weeks': {
				const start = subDays(referenceDate, 13);
				intervals = eachDayOfInterval({ start, end: referenceDate });
				isSameFn = isSameDay;
				formatStr = 'MMM d';
				startFn = startOfDay;
				break;
			}

			case 'last_month': {
				const start = startOfMonth(subMonths(referenceDate, 1));
				const end = endOfMonth(subMonths(referenceDate, 1));
				intervals = eachDayOfInterval({ start, end });
				isSameFn = isSameDay;
				formatStr = 'MMM d';
				startFn = startOfDay;
				break;
			}

			case 'past_year': {
				const start = startOfMonth(subMonths(referenceDate, 11));
				const end = endOfMonth(referenceDate);
				intervals = eachMonthOfInterval({ start, end });
				isSameFn = isSameMonth;
				formatStr = 'MMM';
				startFn = startOfMonth;
				break;
			}

			default:
				intervals = eachMonthOfInterval({
					start: startOfYear(referenceDate),
					end: endOfYear(referenceDate)
				});
				isSameFn = isSameMonth;
				formatStr = 'MMM';
				startFn = startOfMonth;
		}

		return intervals.map((interval) => {
			const total = data
				.filter((row) => isSameFn(row.date, interval))
				.reduce((sum, r) => sum + r.count, 0);

			return {
				date: format(startFn(interval), formatStr),
				value: total
			};
		});
	}

	const hourly = groupTimeseriesByPeriod(series, 'hour');
	const weekly = groupTimeseriesByPeriod(series, 'day');
	const last14 = groupTimeseriesByPeriod(series, 'past_two_weeks');
	const lastMonth = groupTimeseriesByPeriod(series, 'last_month');
	const monthly = groupTimeseriesByPeriod(series, 'month');
	const pastYear = groupTimeseriesByPeriod(series, 'past_year');

	let filter = $state(pastYear);
	let filterLabel = $state('Past Year');
    let countForFilter = $derived.by(() => {
        return Array.isArray(filter)
			? filter.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
			: 0;
    });
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Card.Root>
				<Card.Header class="flex justify-between pb-2">
					<Card.Title class="text-sm font-medium">{title}</Card.Title>
				</Card.Header>

				<Card.Content>
					<div class="text-3xl font-bold">{total}</div>
				</Card.Content>

				<Card.Footer>
					<Button class="w-full" variant="outline" {...props}>
						Stats <ArrowUpRight />
					</Button>
				</Card.Footer>
			</Card.Root>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content class="w-full max-w-5xl">
		<Dialog.Title class="flex justify-between p-6 bg-secondary rounded-md">
			<div>
				<h2 class="text-xl font-semibold">{title}</h2>
				<p class="text-4xl font-bold">{countForFilter}</p>
				<p class="text-sm text-muted-foreground">{filterLabel}</p>
			</div>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button size="sm" variant="black" {...props}>
                        	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
									><path
										fill="currentColor"
										d="M15 19.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0L9.29 16.7a.99.99 0 0 1-.29-.83v-5.12L4.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L15 10.75zM7.04 5L11 10.06v5.52l2 2v-7.53L16.96 5z"
									/></svg
								>
                            Filter
                        </Button>
                    {/snippet}
				</DropdownMenu.Trigger>

				<DropdownMenu.Content>
                <DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => { filter = hourly; filterLabel="Last 24h"; }}>
						Last 24 Hours
					</DropdownMenu.Item>

					<DropdownMenu.Item onclick={() => { filter = weekly; filterLabel="Last 7 Days"; }}>
						Last 7 Days
					</DropdownMenu.Item>

					<DropdownMenu.Item onclick={() => { filter = last14; filterLabel="Last 2 Weeks"; }}>
						Last 2 Weeks
					</DropdownMenu.Item>

					<DropdownMenu.Item onclick={() => { filter = lastMonth; filterLabel="Last Month"; }}>
						Last Month
					</DropdownMenu.Item>

					<DropdownMenu.Item onclick={() => { filter = monthly; filterLabel="Last 12 Months"; }}>
						Last 12 Months
					</DropdownMenu.Item>

					<DropdownMenu.Item onclick={() => { filter = pastYear; filterLabel="Past Year"; }}>
						Past Year
					</DropdownMenu.Item>
                    </DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Dialog.Title>

		<div class="h-[300px] p-4 border rounded">
			<Chart
				data={filter}
				x="date"
				y="value"
				xScale={scaleBand().padding(0.4)}
				yDomain={[0, null]}
				padding={{ left: 16, bottom: 24 }}
				tooltip={{ mode: 'band' }}
			>
				<Svg>
					<Axis placement="left" grid rule />
					<Axis placement="bottom" rule />

					{#each filter as bar, i}
						<Bar
							{bar}
							tweened={{ duration: 400, easing: cubicInOut, delay: i * 20 }}
							radius={4}
							class="fill-primary"
						/>
					{/each}

					<Highlight area />
				</Svg>

				<Tooltip.Root let:data>
					<Tooltip.List>
						<Tooltip.Item label="value" value={data.value} />
					</Tooltip.List>
				</Tooltip.Root>
			</Chart>
		</div>
	</Dialog.Content>
</Dialog.Root>