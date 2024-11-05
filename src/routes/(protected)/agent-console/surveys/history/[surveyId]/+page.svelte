<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	// shadcn
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	// lucide
	import Undo2 from 'lucide-svelte/icons/undo-2';
	import { capitalizeFirstLetter } from '$lib/custom/functions/helpers';
	import { PresetRanker, StarComponent } from '$lib/custom/blocks/composition';

	let { data }: { data: PageData } = $props();
	const { questions } = data;
</script>

<div class="m-4 flex flex-col gap-10">
	<h1 class="font-semi-bold ml-2 gap-1 text-start text-3xl">
		History <br />
		<span class="text-sm">Survey Id : <span class="text-xs">{$page.params.surveyId}</span></span>
		<Button class=" float-end" variant="destructive" href="/agent-console/surveys/history">
			<Undo2 class="size-4" /> Back</Button
		>
	</h1>
	<div class="grid gap-3">
		{#each questions as qns, ix}
			<Card.Root>
				<Card.Header class="space-y-4">
					<Card.Title
						><span class=" text-xl">{ix + 1} </span>: {capitalizeFirstLetter(
							qns.question
						)}</Card.Title
					>
					<Card.Description class="text-[9px] font-light">ID : {qns.id}</Card.Description>
					<Separator />
				</Card.Header>
				<Card.Content class="mr-9 gap-7 lg:flex">
					{#if qns.question_type === 'Multiple'}
						<div class="grid gap-2 lg:grid-cols-4">
							{#each qns.answer as ans}
								<div class="flex gap-2">
									<Checkbox
										disabled
										checked
										class="border-green-500 data-[state=checked]:bg-green-500"
									/>
									<Label
										for="option1"
										class="py-[3px] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{ans}
									</Label>
								</div>
							{/each}
						</div>
					{:else if qns.question_type === 'Rating'}
						<StarComponent checked={2} />
					{:else if qns.question_type === 'Ranking'}
						{@const rid = qns.rankIds.map((id) => parseInt(id))}
						<div class="grid w-full gap-3">
							<PresetRanker preselectedRanks={rid} options={qns.answer} />
						</div>
					{:else}
						<h1 class="text-lg font-semibold">
							Your answer : <span class="text-green-500">{qns.answer}</span>
						</h1>
					{/if}
				</Card.Content>
				<Card.Footer class="float-start flex flex-col gap-2 space-y-2"></Card.Footer>
			</Card.Root>
		{/each}
	</div>
	<p class="text-end text-sm italic lg:mr-24">your opinion matters</p>
</div>
