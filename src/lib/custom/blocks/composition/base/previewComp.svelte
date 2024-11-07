<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	// lucide
	import Target from 'lucide-svelte/icons/target';
	import CheckCheck from 'lucide-svelte/icons/check-check';
	import Star from 'lucide-svelte/icons/star';
	import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
	import ChartColumnIncreasing from 'lucide-svelte/icons/chart-column-increasing';
	import Webcam from 'lucide-svelte/icons/webcam';
	// custom blocks
	import LikertComponent from '../likertcomponent/LikertComponent.svelte';
	import StarComponent from '../rating/StarComponent.svelte';
	import type { Snippet } from 'svelte';

	interface Quest {
		id: string;
		question_type: string;
		question: string | any;
		options: string[];
		optionid: string[];
		likert_key: string;
	}
	let {
		index,
		qs,
		edits,
		deletes
	}: { index: number; qs: Quest; edits: Snippet; deletes: Snippet } = $props();
</script>

<div class="m-2 grid gap-2">
	<div class="flex gap-2">
		<p class=" font-semibold">{index + 1}.</p>
		<div class="py-1">
			{#if qs.question_type === 'Optional'}
				<Target class="size-4" />
			{:else if qs.question_type === 'Multiple'}
				<CheckCheck class="size-4" />
			{:else if qs.question_type === 'Rating'}
				<Star class="size-4" />
			{:else if qs.question_type === 'Likert'}
				<SlidersHorizontal class="size-4" />
			{:else if qs.question_type === 'Ranking'}
				<ChartColumnIncreasing class="size-4" />
			{:else}
				<Webcam class="size-4" />
			{/if}
		</div>
	</div>

	<h1 class="text-md max-w-xl">{qs.question}</h1>
	{#if qs.question_type === 'Optional'}
		<RadioGroup.Root value="option-one" class="grid grid-cols-2">
			{#each qs.options as option, id}
				{#if option != null}
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value={option} disabled />
						<Label for={option} class="text-muted-foreground">{option}</Label>
					</div>
				{/if}
			{/each}
		</RadioGroup.Root>
	{:else if qs.question_type === 'Multiple'}
		<div class="grid grid-cols-2 gap-2">
			{#each qs.options as option, id}
				{#if option != null}
					<div class="flex gap-2">
						<Checkbox disabled />
						<Label
							for="option1"
							class="py-[3px] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{option}
						</Label>
					</div>
				{/if}
			{/each}
		</div>
	{:else if qs.question_type === 'Rating'}
		<StarComponent />
	{:else if qs.question_type === 'Likert'}
		<RadioGroup.Root value="option-one" class="grid grid-cols-2">
			<LikertComponent likert_key={qs.likert_key} disabled={true} />
		</RadioGroup.Root>
	{:else if qs.question_type === 'Ranking'}
		<ScrollArea class="h-48  max-w-lg rounded-md border " orientation="both">
			<div class="mx-auto ml-3 grid gap-3">
				{#each qs.options as option, id}
					<p class="text-muted-foreground">{option}</p>
					<div class="grid max-w-lg grid-cols-5 gap-1">
						{#each [1, 2, 3, 4, 5] as rank}
							<div class="flex flex-col gap-2">
								<Button variant="secondary" size="icon" disabled>
									{rank}
								</Button>
								{#if rank === 1}
									<p class="ml-2 text-xs text-muted-foreground">High</p>
								{:else if rank === 5}
									<p class="ml-2 text-xs text-muted-foreground">Low</p>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
				<p class="text-muted-foreground">
					(1 being the most important, 5 being the least important)
				</p>
			</div>
		</ScrollArea>
	{:else}
		<Input class="max-w-md" disabled />
	{/if}
	<div class="float-end gap-10">
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline">Edit</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Edit your Question</AlertDialog.Title>
					<AlertDialog.Description>This action will edit your survey.</AlertDialog.Description>
				</AlertDialog.Header>
				{@render edits()}
			</AlertDialog.Content>
		</AlertDialog.Root>
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="destructive">Delete</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone. This will permanently delete your survey and remove your
						data from our servers.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					{@render deletes()}
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</div>
</div>
