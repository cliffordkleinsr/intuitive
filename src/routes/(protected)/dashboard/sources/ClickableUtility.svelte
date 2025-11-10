<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import {
		isSameDay,
		isSameMonth,
		eachHourOfInterval,
		endOfDay,
		isSameHour,
		startOfDay,
		startOfHour,
		format,
		eachDayOfInterval,
		endOfWeek,
		startOfWeek,
		startOfMonth,
		eachMonthOfInterval,
		startOfYear,
		endOfYear
	} from 'date-fns';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Axis, Bar, Chart, Svg, Tooltip, Highlight } from 'layerchart';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { scaleBand } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';

	type Source = {
		recordedAt: Date;
		id: string;
		userId: string | null;
		personaId: string;
		utmSource: string | null;
		utmMedium: string | null;
		utmCampaign: string | null;
		unTracked: boolean;
		userAgent: string | null;
		ipAddress: string | null;
		referrer: string | null;
	};
	type Utlity = {
		variable: Source[];
		count: number;
		children: Snippet;
	};
	let { variable, count, children }: Utlity = $props();
	const now = new Date();

	/**
	 * Generic function to group data by a given time unit
	 * @param {Array} sources - The list of data with `recordedAt` timestamps
	 * @param {'hour'|'day'|'month'} type - The grouping type
	 * @param {Date} [referenceDate=new Date()] - The reference date (optional)
	 */
	export function groupVisitsByTime(sources: Source[], type = 'month', referenceDate = new Date()) {
		let intervals, isSameFn, formatStr, startFn, endFn;

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

		return intervals.map((time) => ({
			date: format(startFn(time), formatStr),
			value: sources.filter((v) => isSameFn(v.recordedAt, time)).length
		}));
	}
	const visits_by_hour = groupVisitsByTime(variable, 'hour', now);
	const visits_by_week = groupVisitsByTime(variable, 'day', now);
	const visits_by_month = groupVisitsByTime(variable, 'month', now);

	let filter = $state(visits_by_month);
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Card.Root {...props} class="cursor-pointer">
				<Card.Header>
					<Card.Title>{count}</Card.Title>
				</Card.Header>
				<Card.Content>{@render children?.()}</Card.Content>
			</Card.Root>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-5xl">
		<Dialog.Title class="m-1 flex gap-2 rounded-md bg-secondary p-10">
			<div class="ml-auto">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="black" {...props} size="sm">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
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
									onclick={() => (filter = visits_by_hour)}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z"
										/></svg
									>
									Today
								</Button>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									class="text-start"
									onclick={() => (filter = visits_by_week)}
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
									onclick={() => (filter = visits_by_month)}
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
									Last Year
								</Button>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</Dialog.Title>
		<div class="h-[450px] rounded border p-4">
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
