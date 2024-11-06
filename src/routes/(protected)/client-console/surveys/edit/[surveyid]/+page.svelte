<script lang="ts">
	import type { PageData } from './$types';

	// shadcn
	import * as Card from '$lib/components/ui/card';
	// lucide
	import { QuestionType } from '$lib/custom/blocks/index';
	import { capitalizeFirstLetter } from '$lib/custom/functions/helpers';
	import RootQuest from '$lib/custom/blocks/composition/base/RootQuest.svelte';
	import Portal from '$lib/custom/blocks/composition/base/Portal.svelte';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';

	interface Lotto {
		data: PageData;
		form: any;
	}
	let { form, data }: Lotto = $props();

	let portProps = {
		title: 'Question List',
		description: ''
	};
	let {
		surveydata,
		surveyqns,
		features: { maxqns }
	} = $derived(data);
</script>

<div class="m-3">
	<div class="mx-auto grid max-w-screen-md gap-4">
		<!-- Survey Title -->
		<h1 class="text-lg font-semibold">
			Title: {capitalizeFirstLetter(surveydata.title.toLocaleLowerCase())}
		</h1>
		{#if surveydata.desc}
			<p><span class="font-semibold">Description:</span> {surveydata.desc}</p>
		{/if}
		<!-- Survey Questionnaire -->
		<Card.Root class="space-y-3">
			<Card.Header>
				<Card.Title>Survey questions</Card.Title>
				<Card.Description>
					Add questions and select the type of answer to be given.
				</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-3 lg:grid-cols-2">
				{#if surveyqns.length === maxqns}
					<div
						class="rounded-lg border border-yellow-200 bg-yellow-100 p-4 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-800/10 dark:text-yellow-500"
						role="alert"
					>
						<span class="font-bold">Warning</span> alert! You have exceeded the maximum available questions
						for your plan
					</div>
				{:else}
					<RootQuest {form} />
				{/if}
			</Card.Content>
		</Card.Root>
		<!-- Types of Questions  -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Types of questions</Card.Title>
				<Card.Description
					>Description on the types of questions that can be generated</Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
				<QuestionType />
			</Card.Content>
		</Card.Root>
		<Portal {...portProps}>
			{#snippet trigger()}
				Preview Questions
				<ArrowUpRight />
			{/snippet}
		</Portal>
	</div>
</div>
