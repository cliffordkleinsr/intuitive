<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button/index.js';

	import { Badge } from '$lib/components/ui/badge/index.js';
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

	type TimeseriesPoint = {
		source: string;
		count: number;
		date: Date;
	};
	type Period = 'hour' | 'day' | 'month' | 'past_two_weeks' | 'last_month';

	function groupTimeseriesByPeriod(
		data: TimeseriesPoint[],
		type: Period = 'month',
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
				const start = subDays(referenceDate, 13); // 14 days including today
				const end = referenceDate;

				intervals = eachDayOfInterval({ start, end });
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
			case 'month':

			default:
				intervals = eachMonthOfInterval({
					start: startOfYear(referenceDate),
					end: endOfYear(referenceDate)
				});
				isSameFn = isSameMonth;
				formatStr = 'MMM';
				startFn = startOfMonth;
				break;
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

	let { series, label } = $props();

	const hour = groupTimeseriesByPeriod(series, 'hour');
	const week = groupTimeseriesByPeriod(series, 'day');
	const last14Days = groupTimeseriesByPeriod(series, 'past_two_weeks');
	const previousMonth = groupTimeseriesByPeriod(series, 'last_month');
	const monthly = groupTimeseriesByPeriod(series, 'month');

	let filter = $state(hour);
	let filterLabel = $state('Last 24 Hours');
	let countForFilter = $derived.by(() => {
		return Array.isArray(filter)
			? filter.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
			: 0;
	});
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Badge class="cursor-pointer" variant="default" {...props}>{label}</Badge>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-5xl">
		<Dialog.Title class="m-1 flex gap-2 rounded-md bg-secondary p-10">
			<div class="mr-auto">
				<h1 class="text-2xl font-semibold">Source Distribution Analytics</h1>
				<p class="mt-3 text-4xl font-semibold">{countForFilter}</p>
				<p class="text-sm text-muted-foreground">{filterLabel}</p>
			</div>
			<div class="ml-auto">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="black" {...props} size="sm">
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
							<DropdownMenu.GroupHeading>Choose a filter</DropdownMenu.GroupHeading>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									class="w-full text-start"
									onclick={() => {
										filter = hour;
										filterLabel = 'Last 24 Hours';
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z"
										/></svg
									>
									Last 24 Hours
								</Button>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									class="text-start"
									onclick={() => {
										filter = week;
										filterLabel = 'Last 7 Days';
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M12 12h5v5h-5zm7-9h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 2v2H5V5zM5 19V9h14v10z"
										/></svg
									>
									Last 7 Days
								</Button>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									class="text-start"
									onclick={() => {
										filter = last14Days;
										filterLabel = 'Last 2 Weeks';
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M12 12h5v5h-5zm7-9h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 2v2H5V5zM5 19V9h14v10z"
										/></svg
									>
									Last 2 Weeks
								</Button>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									class="text-start"
									onclick={() => {
										filter = previousMonth;
										filterLabel = 'Last Month';
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M12 12h5v5h-5zm7-9h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 2v2H5V5zM5 19V9h14v10z"
										/></svg
									>
									Last Month
								</Button>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									class="text-start"
									onclick={() => {
										filter = monthly;
										filterLabel = 'Last 12 Months';
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 2048 2048"
										><path
											fill="currentColor"
											d="M1664 512h256v1536H256V512h256V384h128v128h896V384h128zm128 128h-128v128h128zm-256 0H640v128h896zm-1024 0H384v128h128zM384 1920h1408V896H384zM256 384V256H128v1408H0V128h256V0h128v128h896V0h128v128h256v128h-256v128h-128V256H384v128zm384 1024v-128h128v128zm256 0v-128h128v128zm256 0v-128h128v128zm256 0v-128h128v128zm-768 256v-128h128v128zm256 0v-128h128v128zm256 0v-128h128v128zm-256-512v-128h128v128zm256 0v-128h128v128zm256 0v-128h128v128z"
										/></svg
									>
									Last 12 Months
								</Button>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</Dialog.Title>
		<div class="h-[300px] rounded border p-4">
			<Chart
				data={filter}
				x="date"
				xScale={scaleBand().padding(0.4)}
				y="value"
				yDomain={[0, null]}
				yNice={4}
				padding={{ left: 16, bottom: 24 }}
				tooltip={{ mode: 'band' }}
			>
				<Svg>
					<Axis placement="left" grid rule />
					<Axis placement="bottom" rule />
					{#if filter}
						{#each filter as bar, i}
							<Bar
								{bar}
								tweened={{
									duration: 500,
									easing: cubicInOut,
									delay: i * 30
								}}
								radius={4}
								rounded="edge"
								strokeWidth={1}
								class="fill-primary"
							/>
						{/each}
					{/if}
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
