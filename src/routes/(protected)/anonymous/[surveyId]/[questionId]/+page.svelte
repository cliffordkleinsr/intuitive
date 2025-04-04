<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';
	import {
		LikertComponent,
		MultiComponent,
		OptionalComponent,
		RankComponent,
		RateComponent,
		SingleComponent
	} from '$lib/custom/blocks/reader';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import type { PageData } from './$types';
	import { Textarea } from '$lib/components/ui/textarea';
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { Label } from '$lib/components/ui/label';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();
	const {
		// schemas
		openEndedForm,
		optionalForm,
		rankForm,
		multiForm,
		rateForm,
		// relevant data
		cache: {
			pool_questions: { question, question_type, likert_key, options, optionid },
			current_ix,
			pool_size
		},
		cur_id,
		branch_for
	} = data;

	let cnt = current_ix + 1;
	let tooltip = $state(false);
	const progress = Math.round((cnt / pool_size) * 100);
</script>

<Progress value={progress} />
<div class=" grid place-items-center py-40 lg:py-64">
	{#if question_type === 'Single'}
		<SingleComponent data={openEndedForm} {question} {cur_id} />
	{/if}
	{#if question_type === 'Optional'}
		<!-- tbd -->
		<OptionalComponent data={optionalForm} {question} {cur_id} {options} />
	{/if}

	{#if question_type === 'Likert'}
		<!-- tbd -->
		<LikertComponent data={openEndedForm} {question} {cur_id} {likert_key} />
	{/if}

	{#if question_type === 'Rating'}
		<!-- tbd -->
		<RateComponent data={rateForm} {question} {cur_id} />
	{/if}

	{#if question_type === 'Ranking'}
		<RankComponent data={rankForm} {question} {cur_id} {options} />
	{/if}

	{#if question_type === 'Multiple'}
		<MultiComponent data={multiForm} {question} {cur_id} {optionid} {options} />
	{/if}

	{#if branch_for}
		<div class="py-1">
			<Button variant="secondary" onclick={() => (tooltip = !tooltip)}>?</Button>
		</div>
		{#if tooltip}
			<div
				class="w-full max-w-md"
				transition:fade={{ delay: 100, duration: 400, easing: cubicInOut }}
			>
				<Label for="email">This Question Maps to:</Label>

				<Textarea value={branch_for.question} disabled />
			</div>
		{/if}
	{/if}
</div>
<div class="grid place-items-center py-1">
	<Button variant="outline" href="/anonymous/{page.params.surveyId}">Go back</Button>
</div>

<div class="absolute inset-x-2 top-6">
	<p class="rounded-xl text-center text-sm font-semibold shadow-sm lg:shadow-none">
		{current_ix} / {pool_size}
	</p>
</div>
