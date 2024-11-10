<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';
	import {
		LikertComponent,
		OptionalComponent,
		RankComponent,
		SingleComponent
	} from '$lib/custom/blocks/reader';
	import { Button } from '$lib/components/ui/button';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const {
		// schemas
		openEndedForm,
		optionalForm,
		rankForm,
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
<div class="m-5 mx-auto max-w-screen-md place-items-center py-56">
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
	{/if}

	{#if question_type === 'Ranking'}
		<!-- tbd -->
		<RankComponent data={rankForm} {question} {cur_id} {options} />
	{/if}

	{#if question_type === 'Multiple'}
		<!-- tbd -->
	{/if}
</div>
<div class="absolute bottom-10 right-10">
	<Button variant="ghost" href="/agent-console">Tired Take a Break 🥱</Button>
</div>
