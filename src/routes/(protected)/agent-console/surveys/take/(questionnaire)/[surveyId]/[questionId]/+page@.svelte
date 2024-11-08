<script lang="ts">
	import type { Actions, PageData } from './$types';
	// shadcn
	import { Progress } from '$lib/components/ui/progress';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Badge } from '$lib/components/ui/badge';
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	// lucide
	import CheckCheck from 'lucide-svelte/icons/check-check';
	import { LikertComponent, Ranker, StarComponent } from '$lib/custom/blocks/composition';
	import { beforeNavigate } from '$app/navigation';

	let { data, form }: { data: PageData; form: any | Actions | undefined } = $props();

	const { questions: qns, question_cnt, count } = data;
	// Percentages
	let cnt = $state(count + 1);
	const perc = $derived(Math.round((cnt / question_cnt) * 100));

	// checkbox Items
	let items: any[] = $state([]);

	function addItem(id: string) {
		items.push(id);
	}
	function removeItem(id: string) {
		items = items.filter((i) => i !== id);
	}
</script>

<Progress value={perc} />
{#if qns.question_type === 'Single'}
	<form
		action="?/defaultAns"
		method="post"
		class="m-5 mx-auto mt-20 flex max-w-sm flex-col gap-5 lg:max-w-lg"
	>
		<Label for="answer">{qns.question}</Label>
		<Textarea name="answer" />
		{#if form?.errors?.answer}
			<p class=" text-sm text-destructive">{form?.errors?.answer}</p>
		{/if}
		<Badge class="max-w-44 bg-green-300 text-white" variant="outline">PLEASE WRITE IN THE BOX</Badge
		>
		<Form.Button class="mt-16 gap-4" variant="outline">
			<CheckCheck class="text-green-400" /> Submit</Form.Button
		>
	</form>
{:else if qns.question_type === 'Optional'}
	<form
		action="?/defaultAns"
		method="post"
		class="m-5 mx-auto mt-20 flex max-w-sm flex-col gap-5 lg:max-w-lg"
	>
		<Label for="question">{qns.question}</Label>
		<RadioGroup.Root name="answer">
			{#each qns.options as opt, i}
				{@const id = qns.optionid[i]}
				{#if opt !== null}
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value={opt} />
						<Label for={opt}>{opt}</Label>
					</div>
				{/if}
			{/each}
			<!-- <RadioGroup.Input name="answer" /> -->
			{#if form?.warnings?.message}
				<p class=" text-sm text-destructive">{form?.warnings?.message}</p>
			{/if}
		</RadioGroup.Root>
		<Form.Button class="mt-16 gap-4" variant="outline">
			<CheckCheck class="text-green-400" /> Submit
		</Form.Button>
	</form>
{:else if qns.question_type === 'Likert'}
	<form
		action="?/defaultAns"
		method="post"
		class="m-5 mx-auto mt-20 flex max-w-sm flex-col gap-5 lg:max-w-lg"
	>
		<Label for="question">{qns.question}</Label>
		<RadioGroup.Root name="answer">
			<LikertComponent likert_key={qns.likert_key as string} disabled={false} />
			<!-- {#if form?.errors?.answer}
                <p class=" text-destructive text-sm">{form?.errors?.answer}</p>
            {/if} -->
			{#if form?.warnings?.message}
				<p class=" text-sm text-destructive">{form?.warnings?.message}</p>
			{/if}
		</RadioGroup.Root>
		<Form.Button class="mt-16 gap-4" variant="outline">
			<CheckCheck class="text-green-400" /> Submit</Form.Button
		>
	</form>
{:else if qns.question_type === 'Rating'}
	<form
		action="?/addRatAns"
		method="post"
		class="m-5 mx-auto mt-20 flex max-w-sm flex-col gap-5 lg:max-w-lg"
	>
		<Label for="question">{qns.question}</Label>
		<StarComponent disabled={false} />
		{#if form?.errors?.answer}
			<p class=" text-sm text-destructive">{form?.errors?.answer}</p>
		{/if}
		<Form.Button class="mt-16 gap-4" variant="outline">
			<CheckCheck class="text-green-400" /> Submit</Form.Button
		>
	</form>
{:else if qns.question_type === 'Ranking'}
	<form
		action="?/addRankAns"
		method="post"
		class="m-5 mx-auto mt-20 flex max-w-sm flex-col gap-5 lg:max-w-lg"
	>
		<Label for="question">{qns.question}</Label>
		<p class="text-muted-foreground">
			(With 1 being the most important and 5 being the least important)
		</p>
		<Ranker options={qns.options} />
		{#if form?.errors?.id}
			<p class=" text-sm text-destructive">{form?.errors?.id[0]}</p>
		{/if}
		<Form.Button class="mt-16 gap-4" variant="outline">
			<CheckCheck class="text-green-400" /> Submit</Form.Button
		>
	</form>
{:else}
	<form
		action="?/addCheckAns"
		method="post"
		class="m-5 mx-auto mt-20 flex max-w-sm flex-col gap-5 lg:max-w-lg"
	>
		<Label for="question">{qns.question}</Label>
		{#each qns.options as opt, i}
			{@const id = qns.optionid[i]}
			{#if opt !== null}
				<div class="flex gap-2">
					<Checkbox
						onCheckedChange={(v) => {
							if (v) {
								addItem(opt);
							} else {
								removeItem(opt);
							}
						}}
					/>
					<Label
						for="option1"
						class="py-[3px] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						{opt}
					</Label>
					<Input value={id} name="optionId" class="hidden" />
					<input type="checkbox" bind:group={items} name="answer" value={opt} hidden />
				</div>
			{/if}
		{/each}
		{#if form?.warnings?.message}
			<p class=" text-sm text-destructive">{form?.warnings?.message}</p>
		{/if}
		<!-- {#if form?.errors?.answer}
            <p class=" text-destructive text-sm">{form?.errors?.answer}</p>
        {/if} -->
		<Form.Button class="mt-16 gap-4" variant="outline">
			<CheckCheck class="text-green-400" /> Submit</Form.Button
		>
	</form>
{/if}
