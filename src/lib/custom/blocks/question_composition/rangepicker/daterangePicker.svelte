<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import type { DateRange } from 'bits-ui';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import * as Popover from '$lib/components/ui/popover';
	import { df } from '$lib/custom/functions/helpers';

	let { value }: any | DateRange = $props();

	let startValue: DateValue | undefined = $state(undefined);
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({ variant: 'outline' }),
			!value && 'text-muted-foreground',
			'max-w-xs'
		)}
	>
		<CalendarIcon class="mr-2 size-4" />
		{#if value && value.start}
			{#if value.end}
				{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
					value.end.toDate(getLocalTimeZone())
				)}
			{:else}
				{df.format(value.start.toDate(getLocalTimeZone()))}
			{/if}
		{:else if startValue}
			{df.format(startValue.toDate(getLocalTimeZone()))}
		{:else}
			Pick a date
		{/if}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<RangeCalendar
			bind:value
			onStartValueChange={(v) => {
				startValue = v;
			}}
			maxValue={startValue?.add({ weeks: 3 })}
			numberOfMonths={1}
		/>
	</Popover.Content>
</Popover.Root>
