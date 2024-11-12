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
	import BatteryFull from 'lucide-svelte/icons/battery-full';
	import BatteryLow from 'lucide-svelte/icons/battery-low';
	import BatteryMedium from 'lucide-svelte/icons/battery-medium';

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
		cur_id
	} = data;

	let cnt = current_ix + 1;
	const progress = Math.round((cnt / pool_size) * 100);
</script>

<Progress value={progress} />
<div class=" grid place-items-center py-64">
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
</div>
<div class="absolute bottom-10 right-10">
	<Button variant="ghost" href="/agent-console">Tired Take a Break 🥱</Button>
</div>
<div class="absolute bottom-12 left-10 flex gap-1 text-xs">
	{#if progress <= 10}
		<BatteryLow />
	{:else if progress <= 50}
		<BatteryMedium />
	{:else}
		<BatteryFull />
	{/if}
	<p class="py-1">{progress}%</p>
</div>

<div class="absolute inset-x-2 top-6">
	<p class="rounded-xl text-center text-sm font-semibold shadow-sm lg:shadow-none">
		{current_ix} / {pool_size}
	</p>
</div>
