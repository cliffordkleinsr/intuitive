<script lang="ts">
	// shadcn
	import { Switch } from '$lib/components/ui/switch';
	import * as Select from '$lib/components/ui/select';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	// lucide
	import Flame from 'lucide-svelte/icons/flame';

	import DaterangePicker from '../rangepicker/daterangePicker.svelte';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import type { DateRange } from 'bits-ui';
	import { CalendarDate } from '@internationalized/date';
	interface Live {
		form?: any | undefined;
		user?: string | undefined;
		age?: boolean | undefined;
		gender?: boolean | undefined;
		default_text?: string | undefined;
		target: number;
	}
	let {
		form,
		user = 'ADMIN',
		age = true,
		gender = true,
		default_text = 'Go Live',
		target = 10
	}: Live = $props();

	const agents = [
		{ value: '10', label: '10' },
		{ value: '20', label: '20' },
		{ value: '30', label: '30' },
		{ value: '40', label: '40' },
		{ value: '50', label: '50' }
	];

	let value = $state('');

	const triggerContent = $derived(
		agents.find((f) => f.value === value)?.label ?? 'Select Target Agent'
	);

	const ages = [
		{ label: '20 - 30', value: '20-30' },
		{ label: '30 - 50', value: '30-50' },
		{ label: '50 - 70', value: '50-70' },
		{ label: 'All', value: '0-100' }
	];

	let value2 = $state('');
	const triggerAges = $derived(ages.find((f) => f.value === value2)?.label ?? 'Select Age');

	const genders = [
		{ label: 'Both', value: 'any' },
		{ label: 'Male', value: 'male' },
		{ label: 'Female', value: 'female' }
	];

	let value3 = $state('');

	const triggerGenders = $derived(
		genders.find((f) => f.value === value3)?.label ?? 'Select Gender'
	);

	let checked = $state(false);
	let dialog = $state(false);
	let loading = $state(false);
	let sh_loading = $state(false);

	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() + 1;
	let yyyy = today.getFullYear();
	let datevalue: DateRange = $state({
		start: new CalendarDate(yyyy, mm, dd),
		end: new CalendarDate(yyyy, mm, dd).add({ days: 10 })
	});
</script>

<div class="flex gap-2">
	<Switch id="share" bind:checked />
	<p class="text-sm">Share to your demographics</p>
</div>
<DaterangePicker value={datevalue} />

<div class="flex max-w-xs gap-2">
	{#if !checked}
		{#if user === 'ADMIN'}
			<Select.Root type="single" name="agents" bind:value>
				<Select.Trigger class="w-[180px]">
					{triggerContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.GroupHeading>Agents</Select.GroupHeading>
						{#each agents as fruit}
							<Select.Item value={fruit.value} label={fruit.label}>{fruit.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{/if}
		{#if age}
			<Select.Root type="single" name="ages" bind:value={value2}>
				<Select.Trigger class="w-[180px]">
					{triggerAges}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.GroupHeading>Agents</Select.GroupHeading>
						{#each ages as age}
							<Select.Item value={age.value} label={age.label}>
								{age.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{/if}
		{#if gender}
			<Select.Root type="single" name="ages" bind:value={value3}>
				<Select.Trigger class="w-[180px]">
					{triggerGenders}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.GroupHeading>Agents</Select.GroupHeading>
						{#each genders as gen}
							<Select.Item value={gen.value} label={gen.label}>
								{gen.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{/if}
	{/if}
</div>
<AlertDialog.Root bind:open={dialog}>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="w-full max-w-xs">
				<Flame class="mr-2 size-4" />{default_text}
			</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently mark your survey as live and cannot be
				further edited. {checked
					? ''
					: 'Kindly confirm you have added the correct date range, gender and age for your survey before proceeding.'}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			{#if checked}
				<form
					action="?/shareLive"
					method="post"
					use:enhance={() => {
						sh_loading = true;
						return async ({ result, update }) => {
							if (result.type === 'redirect') {
								dialog = false;
								await invalidateAll();
								goto(result.location);
								sh_loading = false;
								toast.success('Marked as live');
							} else {
								sh_loading = false;
								await update();
							}
						};
					}}
				>
					<Input value={datevalue.start} name="from" class="hidden" />
					<Input value={datevalue.end} name="to" class="hidden" />
					<Button variant="secondary" class="w-full" type="submit" disabled={sh_loading}>
						{#if sh_loading}
							<div class="flex gap-2">
								<span
									class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent"
									role="status"
									aria-label="loading"
								></span>
								Loading...
							</div>
						{:else}
							Share the survey
						{/if}
					</Button>
				</form>
			{:else}
				<form
					action="?/goLive"
					method="post"
					use:enhance={() => {
						loading = true;
						return async ({ result, update }) => {
							switch (true) {
								case result.type === 'failure':
									loading = false;
									await update();
									break;
								case result.type === 'success':
									loading = true;
									await update();
									break;
								case result.type === 'redirect':
									loading = true;
									await update();
									break;
								default:
									break;
							}
						};
					}}
				>
					<Input value={datevalue.start} name="from" class="hidden" />
					<Input value={datevalue.end} name="to" class="hidden" />
					<Input value={target} name="target" class="hidden" />
					<Input value={value2} name="target_age_group" class="hidden" />
					<Input value={value3} name="target_gender" class="hidden" />
					<Button type="submit" disabled={loading} class="w-full">
						{#if loading}
							<div class="flex gap-2">
								<span
									class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
									role="status"
									aria-label="loading"
								></span>
								Loading...
							</div>
						{:else}
							Use Our Database
						{/if}
					</Button>
					{#if form?.errors?.message}
						<p class="text-center text-sm text-destructive">{form?.errors?.message}</p>
					{/if}
				</form>
			{/if}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
