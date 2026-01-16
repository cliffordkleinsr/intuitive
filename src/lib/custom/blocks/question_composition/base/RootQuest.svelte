<script lang="ts">
	// shadcn
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	// root
	import Portal from '../../Portals/Portal.svelte';
	// lucide
	import Webcam from 'lucide-svelte/icons/webcam';
	import CheckCheck from 'lucide-svelte/icons/check-check';
	import Target from 'lucide-svelte/icons/target';
	import Star from 'lucide-svelte/icons/star';
	import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
	import ChartBar from 'lucide-svelte/icons/chart-bar';
	// primitives
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import type { Actions } from '@sveltejs/kit';
	// state management
	import { multiples, selection, rankers } from './state.svelte';

	let { form }: { form?: any | Actions | undefined } = $props();

	let singleprops = {
		title: 'Open ended Question',
		description: 'Enter Question (This question will have a single input option)',
		disabled: true
	};
	let multiprops = {
		title: 'Multiple Selection Question',
		description: 'Enter Question (This question can have multiple answers which can be ticked)',
		disabled: true
	};

	let optiprops = {
		title: 'Single Selection Question',
		description:
			'Enter Question (This question will have one optional answer with multiple selections)',
		disabled: true
	};
	let ratingprops = {
		title: 'Rating Question',
		description: 'Enter Question (This question will have 5 stars to choose from)',
		disabled: true
	};
	let likertprops = {
		title: 'Likert Question',
		description: 'Enter Question (This question will have one optinionative selection)',
		disabled: true
	};
	let rankprops = {
		title: 'Ranking Question',
		description: 'Enter Question (This question will have a rank of 1 to 5)',
		disabled: true
	};

	let singledialog = $state(false);
	let multidialog = $state(false);
	let optidialog = $state(false);
	let stardialog = $state(false);
	let likertdialog = $state(false);
	let rankdialog = $state(false);
	let sing_loading = $state(false);
	let multi_loading = $state(false);
	let opti_loading = $state(false);
	let starloading = $state(false);
	let likertloading = $state(false);
	let rank_loading = $state(false);

	let likert_key = [
		{ label: 'Agreement', value: 'agreement' },
		{ label: 'Frequency', value: 'frequency' },
		{ label: 'Appropriateness', value: 'appropriateness' },
		{ label: 'Satisfaction', value: 'satisfaction' },
		{ label: 'Reflective of me', value: 'reflective' },
		{ label: 'Level of difficulty', value: 'lod' },
		{ label: 'Priority', value: 'priority' },
		{ label: 'Quality', value: 'quality' },
		{ label: 'Importance', value: 'importance' },
		{ label: 'Likelihood', value: 'likelyhood' }
	];

	let value = $state('');
	const triggerContent = $derived(
		likert_key.find((f) => f.value === value)?.label ?? 'Select a likert key'
	);
</script>

<!-- Single Question -->
<Portal {...singleprops} d>
	{#snippet trigger()}
		<Webcam />
		Add an open ended question
	{/snippet}
	<form
		action="?/addSingleQns"
		method="post"
		class="grid items-start gap-4"
		use:enhance={() => {
			sing_loading = true;
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					singledialog = false;
					await invalidateAll();
					goto(result.location);
					sing_loading = false;
					toast.success('Created Successfully');
				} else {
					sing_loading = false;
					await update();
				}
			};
		}}
	>
		<div class="grid gap-2">
			<Label for="question">Question</Label>
			<Input type="text" name="single_question" />
		</div>
		{#if form?.errors?.single_question}
			<p class=" text-sm text-destructive">{form?.errors?.single_question}</p>
		{/if}
		<Button type="submit" class="" disabled={sing_loading}>
			{#if sing_loading}
				<div class="flex gap-2">
					<span
						class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
						role="status"
						aria-label="loading"
					></span>
					Loading...
				</div>
			{:else}
				Save changes
			{/if}
		</Button>
	</form>
</Portal>
<!-- Multi selection -->
<Portal {...multiprops} class="">
	{#snippet trigger()}
		<CheckCheck />
		Add multiple selection question
	{/snippet}
	<form
		action="?/addMultiQns"
		method="post"
		class="grid items-start gap-4"
		use:enhance={() => {
			multi_loading = true;
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					multidialog = false;
					multiples.reset();
					await invalidateAll();
					goto(result.location);
					multi_loading = false;
					toast.success('Created Successfully');
				} else {
					multi_loading = false;
					await update();
				}
			};
		}}
	>
		<div class="grid gap-2">
			<Label for="question">Question</Label>
			<Input type="text" name="question" />
			{#if form?.errors?.question}
				<p class=" text-sm text-destructive">{form?.errors?.question}</p>
			{/if}
			{#each multiples.options as v}
				<Label for="option">Enter Option</Label>
				<Input type="text" bind:value={v.option} name="option" />
			{/each}
		</div>
		{#if form?.errors?.option}
			<p class=" text-sm text-destructive">{form?.errors?.option}</p>
		{/if}
		<Button variant="secondary" onclick={() => multiples.add()} disabled={multiples.disabled}
			>Add Option</Button
		>
		<Button variant="secondary" onclick={() => multiples.remove()} disabled={multiples.other}
			>Remove Option</Button
		>
		<Button type="submit" disabled={multi_loading}>
			{#if multi_loading}
				<div class="flex gap-2">
					<span
						class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
						role="status"
						aria-label="loading"
					></span>
					Loading...
				</div>
			{:else}
				Save changes
			{/if}
		</Button>
	</form>
</Portal>
<!-- optional selection -->
<Portal {...optiprops} class="">
	{#snippet trigger()}
		<Target />
		Add a single selection question
	{/snippet}
	<form
		action="?/addOptQns"
		method="post"
		class="grid items-start gap-4"
		use:enhance={() => {
			opti_loading = true;
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					optidialog = false;
					selection.reset();
					await invalidateAll();
					goto(result.location);
					opti_loading = false;
					toast.success('Created Successfully');
				} else {
					opti_loading = false;
					await update();
				}
			};
		}}
	>
		<div class="grid gap-2">
			<Label for="question">Question</Label>
			<Input type="text" name="radio_question" />
			{#if form?.errors?.radio_question}
				<p class=" text-sm text-destructive">{form?.errors?.radio_question}</p>
			{/if}
			{#each selection.options as v}
				<Label for="option">Enter Option</Label>
				<Input type="text" bind:value={v.option} name="radio_option" />
			{/each}
		</div>
		{#if form?.errors?.radio_option}
			<p class="text-sm text-destructive">{form?.errors?.radio_option}</p>
		{/if}
		<Button variant="secondary" onclick={() => selection.add()} disabled={selection.disabled}
			>Add Option</Button
		>
		<Button variant="secondary" onclick={() => selection.remove()} disabled={selection.other}
			>Remove Option</Button
		>
		<Button type="submit" disabled={opti_loading}>
			{#if opti_loading}
				<div class="flex gap-2">
					<span
						class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
						role="status"
						aria-label="loading"
					></span>
					Loading...
				</div>
			{:else}
				Save changes
			{/if}
		</Button>
	</form>
</Portal>
<!-- Rating -->
<Portal {...ratingprops} class="">
	{#snippet trigger()}
		<Star />
		Add a rating question
	{/snippet}
	<form
		action="?/addStarQns"
		method="post"
		class="grid items-start gap-4"
		use:enhance={() => {
			starloading = true;
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					stardialog = false;
					await invalidateAll();
					goto(result.location);
					starloading = false;
					toast.success('Created Successfully');
				} else {
					starloading = false;
					await update();
				}
			};
		}}
	>
		<div class="grid gap-2">
			<Label for="question">Question</Label>
			<Input type="text" name="rating_question" />
		</div>
		{#if form?.errors?.rating_question}
			<p class=" text-sm text-destructive">{form?.errors?.rating_question}</p>
		{/if}
		<Button type="submit" class="" disabled={starloading}>
			{#if starloading}
				<div class="flex gap-2">
					<span
						class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
						role="status"
						aria-label="loading"
					></span>
					Loading...
				</div>
			{:else}
				Save changes
			{/if}
		</Button>
	</form>
</Portal>
<!-- Likert -->
<Portal {...likertprops} class="">
	{#snippet trigger()}
		<SlidersHorizontal />
		Add a likert question
	{/snippet}
	<form
		action="?/addLikQns"
		method="post"
		class="grid items-start gap-4"
		use:enhance={() => {
			likertloading = true;
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					likertdialog = false;
					await invalidateAll();
					goto(result.location);
					likertloading = false;
					toast.success('Created Successfully');
				} else {
					likertloading = false;
					await update();
				}
			};
		}}
	>
		<div class="grid gap-2">
			<Label for="question">Question</Label>
			<Input type="text" name="question" />
			{#if form?.errors?.question}
				<p class=" text-sm text-destructive">{form?.errors?.question}</p>
			{/if}
			<Select.Root type="single" name="target" bind:value>
				<Select.Trigger>
					{triggerContent}
				</Select.Trigger>
				<Select.Content>
					{#each likert_key as lks}
						<Select.Item value={lks.value}>{lks.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<Button type="submit" class="" disabled={likertloading}>
			{#if likertloading}
				<div class="flex gap-2">
					<span
						class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
						role="status"
						aria-label="loading"
					></span>
					Loading...
				</div>
			{:else}
				Save changes
			{/if}
		</Button>
	</form>
</Portal>
<!-- Rankers -->
<Portal {...rankprops} class="">
	{#snippet trigger()}
		<ChartBar />
		Add a ranking question
	{/snippet}
	<form
		action="?/addRnkQns"
		method="post"
		class="grid items-start gap-4"
		use:enhance={() => {
			rank_loading = true;
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					rankdialog = false;
					rankers.reset();
					await invalidateAll();
					goto(result.location);
					rank_loading = false;
					toast.success('Created Successfully');
				} else {
					rank_loading = false;
					await update();
				}
			};
		}}
	>
		<div class="grid gap-2">
			<Label for="question">Question</Label>
			<Input type="text" name="rnk_question" />
			{#if form?.errors?.rnk_question}
				<p class=" text-sm text-destructive">{form?.errors?.rnk_question}</p>
			{/if}
			{#each rankers.options as v}
				<Label for="option">Enter Option</Label>
				<Input type="text" bind:value={v.option} name="rnk_option" />
			{/each}
		</div>
		{#if form?.errors?.rnk_option}
			<p class=" text-sm text-destructive">{form?.errors?.rnk_option}</p>
		{/if}
		<Button variant="secondary" onclick={() => rankers.add()} disabled={rankers.disabled}
			>Add Option</Button
		>
		<Button variant="secondary" onclick={() => rankers.remove()} disabled={rankers.other}
			>Remove Option</Button
		>
		<Button type="submit" class="" disabled={rank_loading}>
			{#if rank_loading}
				<div class="flex gap-2">
					<span
						class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
						role="status"
						aria-label="loading"
					></span>
					Loading...
				</div>
			{:else}
				Save changes
			{/if}
		</Button>
	</form>
</Portal>
