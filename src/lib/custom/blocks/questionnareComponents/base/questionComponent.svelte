<script lang="ts">
	import { browser } from '$app/environment';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import CheckCheck from 'lucide-svelte/icons/check-check';
	import Target from 'lucide-svelte/icons/target';
	import Webcam from 'lucide-svelte/icons/webcam';
	import Star from 'lucide-svelte/icons/star';
	import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
	import * as Select from '$lib/components/ui/select';
	import ChartColumnIncreasing from 'lucide-svelte/icons/chart-bar-increasing';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';
	import {
		options,
		rankers,
		multiples,
		multiplesDisabled,
		multiplesOther,
		optionsDisabled,
		optionsOther,
		rankersDisabled,
		rankersOther
	} from './state';
	import type { Actions } from '@sveltejs/kit';

	let { form }: { form?: any | Actions | undefined } = $props();
	let isDesktop = $state(true);

	if (browser) {
		isDesktop = window.innerWidth >= 768;
	}
	let target = $state('agreement');
	let likert_key = $state([
		{ label: 'Agreement', value: 'agreement' },
		{ label: 'Frequency', value: 'frequency' },
		{ label: 'Appropriateness', value: 'appropriateness' },
		{ label: 'Satisfaction', value: 'satisfaction' },
		{ label: 'Reflective of me', value: 'reflective' },
		{ label: 'Level of difficulty', value: 'lod' },
		{ label: 'Priority', value: 'priority' },
		{ label: 'Quality', value: 'quality' },
		{ label: 'Importance', value: 'importance' },
		{ label: 'Likelyhood', value: 'likelyhood' }
	]);

	let selected_lks = { label: 'Select target likert scale', value: 'agreement' };

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

	// selects
	let value = $state('');
	const triggerContent = $derived(
		likert_key.find((f) => f.value === value)?.label ?? 'Select a likert scale'
	);
</script>

<!-- Single Question -->
{#if isDesktop}
	<Dialog.Root bind:open={singledialog}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
			<div class="flex gap-2 text-xs">
				<Webcam class="size-4" /> Add an open ended question
			</div>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header class="space-y-3">
				<Dialog.Title>Open ended Question</Dialog.Title>
				<Dialog.Description>
					Enter Question (This question will have a single answer option)
				</Dialog.Description>
			</Dialog.Header>
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
				<Button type="submit" class="max-w-sm" disabled={sing_loading}>
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
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={singledialog}>
		<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>
			<div class="flex gap-2">
				<Webcam class="size-4" /> Add an open ended question
			</div>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="space-y-3 text-left">
				<Drawer.Title>Open ended Question</Drawer.Title>
				<Drawer.Description>
					Enter Question (This question will have a single answer option)
				</Drawer.Description>
			</Drawer.Header>
			<form
				action="?/addSingleQns"
				method="post"
				class="grid items-start gap-4 px-4"
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
				<Button type="submit" class="max-w-sm" disabled={sing_loading}>
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
			<Drawer.Footer class="pt-2">
				<Drawer.Close>
					<Button variant="outline">Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
<!-- Multiple Selection -->
{#if isDesktop}
	<Dialog.Root bind:open={multidialog}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
			<div class="flex gap-2 text-xs">
				<CheckCheck class="size-4" />Add multiple selection question
			</div>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header class="space-y-3">
				<Dialog.Title>Multiple Selection Question</Dialog.Title>
				<Dialog.Description>
					Enter Question (This question can have multiple answers which can be ticked)
				</Dialog.Description>
			</Dialog.Header>
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
					{#each $multiples as v}
						<Label for="option">Enter Option</Label>
						<Input type="text" bind:value={v.option} name="option" />
					{/each}
				</div>
				{#if form?.errors?.option}
					<p class=" text-sm text-destructive">{form?.errors?.option}</p>
				{/if}
				<Button variant="secondary" onclick={multiples.add} disabled={$multiplesDisabled}
					>Add Option</Button
				>
				<Button variant="secondary" onclick={multiples.remove} disabled={$multiplesOther}
					>Remove Option</Button
				>
				<Button type="submit" class="max-w-sm" disabled={multi_loading}>
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
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={multidialog}>
		<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>
			<div class="flex gap-2">
				<CheckCheck class="size-4" />Add multiple selection question
			</div>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="space-y-3 text-left">
				<Drawer.Title>Multiple Selection Question</Drawer.Title>
				<Drawer.Description>
					Enter Question (This question can have multiple answers which can be ticked)
				</Drawer.Description>
			</Drawer.Header>
			<form
				action="?/addMultiQns"
				method="post"
				class="grid items-start gap-4 px-4"
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
					{#each $multiples as v}
						<Label for="option">Enter Option</Label>
						<Input type="text" bind:value={v.option} name="option" />
					{/each}
				</div>
				{#if form?.errors?.option}
					<p class="text-sm text-destructive">{form?.errors?.option}</p>
				{/if}
				<Button variant="secondary" onclick={multiples.add} disabled={$multiplesDisabled}
					>Add Option</Button
				>
				<Button variant="secondary" onclick={multiples.remove} disabled={$multiplesOther}
					>Remove Option</Button
				>
				<Button type="submit" class="max-w-sm" disabled={multi_loading}>
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
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
<!-- single selection -->
{#if isDesktop}
	<Dialog.Root bind:open={optidialog}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
			<div class="flex gap-2 text-xs">
				<Target class="size-4" /> Add a single selection question
			</div>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header class="space-y-3">
				<Dialog.Title>Single Selection Question</Dialog.Title>
				<Dialog.Description>
					Enter Question (This question will have one optional answer with multiple selections)
				</Dialog.Description>
			</Dialog.Header>
			<form
				action="?/addOptQns"
				method="post"
				class="grid items-start gap-4"
				use:enhance={() => {
					opti_loading = true;
					return async ({ result, update }) => {
						if (result.type === 'redirect') {
							optidialog = false;
							options.reset();
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
					{#each $options as v}
						<Label for="option">Enter Option</Label>
						<Input type="text" bind:value={v.option} name="radio_option" />
					{/each}
				</div>
				{#if form?.errors?.radio_option}
					<p class="text-sm text-destructive">{form?.errors?.radio_option}</p>
				{/if}
				<Button variant="secondary" onclick={options.add} disabled={$optionsDisabled}
					>Add Option</Button
				>
				<Button variant="secondary" onclick={options.remove} disabled={$optionsOther}
					>Remove Option</Button
				>
				<Button type="submit" class="max-w-sm" disabled={opti_loading}>
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
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={optidialog}>
		<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>
			<div class="flex gap-2">
				<Target class="size-4" /> Add a single selection question
			</div>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="space-y-3 text-left">
				<Drawer.Title>Single Selection Question</Drawer.Title>
				<Drawer.Description>
					Enter Question (This question will have one optional answer with multiple selections)
				</Drawer.Description>
			</Drawer.Header>
			<form
				action="?/addOptQns"
				method="post"
				class="grid items-start gap-4 px-4"
				use:enhance={() => {
					opti_loading = true;
					return async ({ result, update }) => {
						if (result.type === 'redirect') {
							optidialog = false;
							options.reset();
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
					{#each $options as v}
						<Label for="option">Enter Option</Label>
						<Input type="text" bind:value={v.option} name="radio_option" />
					{/each}
				</div>
				{#if form?.errors?.radio_option}
					<p class="text-sm text-destructive">{form?.errors?.radio_option}</p>
				{/if}
				<Button variant="secondary" onclick={options.add} disabled={$optionsDisabled}
					>Add Option</Button
				>
				<Button variant="secondary" onclick={options.remove} disabled={$optionsOther}
					>Remove Option</Button
				>
				<Button type="submit" class="max-w-sm" disabled={opti_loading}>
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
			<Drawer.Footer class="pt-2">
				<Drawer.Close>
					<Button variant="outline">Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
<!-- Rating -->
{#if isDesktop}
	<Dialog.Root bind:open={stardialog}>
		<Dialog.Trigger>
			<Button variant="outline" class="flex gap-2 text-center text-xs"
				><Star class="size-4" /> Add a rating question</Button
			>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header class="space-y-3">
				<Dialog.Title>Rating Question</Dialog.Title>
				<Dialog.Description>
					Enter Question (This question will have 5 stars to choose from)
				</Dialog.Description>
			</Dialog.Header>
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
				<Button type="submit" class="max-w-sm" disabled={starloading}>
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
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={stardialog}>
		<Drawer.Trigger>
			<Button variant="outline" class="flex gap-2">
				<Star class="size-4" /> Add rating question</Button
			>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="space-y-3 text-left">
				<Drawer.Title>Rating Question</Drawer.Title>
				<Drawer.Description>
					Enter Question (This question will have 5 stars to choose from)
				</Drawer.Description>
			</Drawer.Header>
			<form
				action="?/addStarQns"
				method="post"
				class="grid items-start gap-4 px-4"
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
				<Button type="submit" class="max-w-sm" disabled={starloading}>
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
			<Drawer.Footer class="pt-2">
				<Drawer.Close>
					<Button variant="outline">Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
<!-- Likert -->
{#if isDesktop}
	<Dialog.Root bind:open={likertdialog}>
		<Dialog.Trigger>
			<Button variant="outline" class="flex gap-2 text-xs">
				<SlidersHorizontal class="size-4" /> Add a likert question</Button
			>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header class="space-y-3">
				<Dialog.Title>Likert Question</Dialog.Title>
				<Dialog.Description>
					Enter Question (This question will have one optinionative selection)
				</Dialog.Description>
			</Dialog.Header>
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
					<Select.Root type="single" name="likerts" bind:value>
						<Select.Trigger>
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							{#each likert_key as lks}
								<Select.Item value={lks.value}>{lks.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<Input value={target} name="target" class="hidden" />
				</div>
				<Button type="submit" class="max-w-sm" disabled={likertloading}>
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
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={likertdialog}>
		<Drawer.Trigger>
			<Button variant="outline" class="flex gap-2">
				<SlidersHorizontal class="size-4" /> Add a likert question</Button
			>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="space-y-3 text-left">
				<Drawer.Title>Likert Question</Drawer.Title>
				<Drawer.Description>
					Enter Question (This question will have one optinionative selection)
				</Drawer.Description>
			</Drawer.Header>
			<form
				action="?/addLikQns"
				method="post"
				class="grid items-start gap-4 px-4"
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
					<Select.Root type="single" name="likerts" bind:value>
						<Select.Trigger>
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							{#each likert_key as lks}
								<Select.Item value={lks.value}>{lks.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<Input value={target} name="target" class="hidden" />
				</div>
				<Button type="submit" class="max-w-sm" disabled={likertloading}>
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
			<Drawer.Footer class="pt-2">
				<Drawer.Close>
					<Button variant="outline">Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
<!-- Rankers -->
{#if isDesktop}
	<Dialog.Root bind:open={rankdialog}>
		<Dialog.Trigger>
			<Button variant="outline" class="flex gap-2 text-xs">
				<ChartColumnIncreasing class="size-4" /> Add a ranking question</Button
			>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header class="space-y-3">
				<Dialog.Title>Ranking Question</Dialog.Title>
				<Dialog.Description>
					Enter Question (This question will have a rank of 1 to 5)
				</Dialog.Description>
			</Dialog.Header>
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
					{#each $rankers as v}
						<Label for="option">Enter Option</Label>
						<Input type="text" bind:value={v.option} name="rnk_option" />
					{/each}
				</div>
				{#if form?.errors?.rnk_option}
					<p class=" text-sm text-destructive">{form?.errors?.rnk_option}</p>
				{/if}
				<Button variant="secondary" onclick={rankers.add} disabled={$rankersDisabled}
					>Add Option</Button
				>
				<Button variant="secondary" onclick={rankers.remove} disabled={$optionsOther}
					>Remove Option</Button
				>
				<Button type="submit" class="max-w-sm" disabled={rank_loading}>
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
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={rankdialog}>
		<Drawer.Trigger>
			<Button variant="outline" class="flex gap-2">
				<ChartColumnIncreasing class="size-4" /> Add a ranking question</Button
			>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="space-y-3 text-left">
				<Drawer.Title>Ranking Question</Drawer.Title>
				<Drawer.Description>
					Enter Question (This question will have a rank of 1 to 5)
				</Drawer.Description>
			</Drawer.Header>
			<form
				action="?/addRnkQns"
				method="post"
				class="grid items-start gap-4 px-4"
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
					<Input type="text" name="question" />
					{#if form?.errors?.question}
						<p class=" text-sm text-destructive">{form?.errors?.question}</p>
					{/if}
					{#each $rankers as v}
						<Label for="option">Enter Option</Label>
						<Input type="text" bind:value={v.option} name="option" />
					{/each}
				</div>
				{#if form?.errors?.option}
					<p class=" text-sm text-destructive">{form?.errors?.option}</p>
				{/if}
				<Button variant="secondary" onclick={rankers.add} disabled={$rankersDisabled}
					>Add Option</Button
				>
				<Button variant="secondary" onclick={rankers.remove} disabled={$rankersOther}
					>Remove Option</Button
				>
				<Button type="submit" class="max-w-sm" disabled={rank_loading}>
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
			<Drawer.Footer class="pt-2">
				<Drawer.Close>
					<Button variant="outline">Cancel</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
