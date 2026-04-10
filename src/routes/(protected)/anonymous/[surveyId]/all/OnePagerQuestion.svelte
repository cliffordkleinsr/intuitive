<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import * as Card from '$lib/components/ui/card';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import {
		enumBuilder,
		multipleSchema,
		openEndedSchema,
		rankBuilder,
		ratingSchema,
		type MultipleSchema,
		type OpenEndedSchema,
		type RateSchema
	} from '$lib/custom/blocks/reader/super_schema';
	import { LikertComposition, StarComponent } from '$lib/custom/blocks/question_composition';
	import CheckCheck from 'lucide-svelte/icons/check-check';

	let {
		question_data,
		index
	}: {
		question_data: {
			id: string;
			question: string;
			question_type: string;
			likert_key: string;
			options: string[];
			optionid: string[];
			openEndedForm: SuperValidated<Infer<OpenEndedSchema>>;
			optionalForm: SuperValidated<any>;
			rankForm: SuperValidated<any>;
			multiForm: SuperValidated<Infer<MultipleSchema>>;
			rateForm: SuperValidated<Infer<RateSchema>>;
		};
		index: number;
	} = $props();

	const { id, question, question_type, likert_key, options, optionid } = question_data;

	let answered = $state(false);

	function onUpdated({ form }: { form: { message?: { alertType: string; alertText: string } } }) {
		if (!form.message) return;
		const { alertType, alertText } = form.message;
		if (alertType === 'success') {
			toast.success(alertText);
			answered = true;
		}
		if (alertType === 'error') {
			toast.error(alertText);
		}
	}

	// Single / Likert
	const singleFormInst = superForm(question_data.openEndedForm, {
		id: id + '_single',
		validators: zod4Client(openEndedSchema),
		onUpdated
	});
	const { form: singleData, enhance: singleEnhance, delayed: singleDelayed } = singleFormInst;

	// Optional
	const safeOpts = (options ?? []).filter(Boolean) as string[];
	const optSchema = enumBuilder(safeOpts.length > 0 ? safeOpts : ['n/a']);
	const optFormInst = superForm(question_data.optionalForm, {
		id: id + '_optional',
		validators: zod4Client(optSchema),
		onUpdated
	});
	const { form: optData, enhance: optEnhance, delayed: optDelayed } = optFormInst;

	// Ranking
	const rnkSchema = rankBuilder(safeOpts.length > 0 ? safeOpts : ['n/a']);
	const rnkFormInst = superForm(question_data.rankForm, {
		id: id + '_rank',
		validators: zod4Client(rnkSchema),
		onUpdated
	});
	const { form: rnkData, enhance: rnkEnhance, delayed: rnkDelayed } = rnkFormInst;

	type RankValue = '1' | '2' | '3' | '4' | '5';
	const RANKS: RankValue[] = ['1', '2', '3', '4', '5'];
	let tempNulls: Record<string, boolean> = $state({});

	function isRankTaken(currentAspect: string, rank: RankValue) {
		return Object.entries($rnkData).some(
			([aspect, value]) => aspect !== currentAspect && !tempNulls[aspect] && value === rank
		);
	}

	function setRank(aspect: string, rank: RankValue) {
		if ($rnkData[aspect] === rank) {
			tempNulls[aspect] = true;
			$rnkData[aspect] = 'null';
			tempNulls[aspect] = false;
		} else {
			tempNulls[aspect] = false;
			$rnkData[aspect] = rank;
		}
	}

	// Multiple
	const multiFormInst = superForm(question_data.multiForm, {
		id: id + '_multi',
		dataType: 'json',
		validators: zod4Client(multipleSchema),
		onUpdated
	});
	const { form: multiData, enhance: multiEnhance, delayed: multiDelayed } = multiFormInst;
	const combined = (optionid ?? []).map((oid, i) => ({ id: oid, label: options[i] }));

	function addItem(oid: string, label: string) {
		$multiData.items = [...$multiData.items, { id: oid, label }];
	}
	function removeItem(oid: string) {
		$multiData.items = $multiData.items.filter((item) => item.id !== oid);
	}

	// Rating
	const rateFormInst = superForm(question_data.rateForm, {
		id: id + '_rate',
		validators: zod4Client(ratingSchema),
		onUpdated
	});
	const { form: rateData, enhance: rateEnhance, delayed: rateDelayed } = rateFormInst;
</script>

<Card.Root class={answered ? 'border-green-500' : ''}>
	<Card.Header class="pb-2">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outline" class="font-mono">{index}</Badge>
			<Badge variant="secondary">{question_type}</Badge>
			{#if answered}
				<Badge class="bg-green-500 text-white">Answered</Badge>
			{/if}
		</div>
	</Card.Header>
	<Card.Content>
		{#if question_type === 'Single'}
			<form
				action="?/singleform&questionId={id}"
				method="POST"
				class="space-y-4"
				use:singleEnhance
			>
				<Form.Field form={singleFormInst} name="answer">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-base">{question}</Form.Label>
							<Textarea {...props} bind:value={$singleData.answer} disabled={answered} />
						{/snippet}
					</Form.Control>
					<Form.Description>Please write your answer in the text box.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				{#if $singleDelayed}
					<Button class="flex w-full gap-2" variant="outline" disabled>
						<span
							class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent"
							role="status"
							aria-label="loading"
						></span>
						Saving...
					</Button>
				{:else}
					<Form.Button variant="outline" class="w-full" disabled={answered}>
						<CheckCheck />
						{answered ? 'Saved' : 'Save'}
					</Form.Button>
				{/if}
			</form>
		{/if}

		{#if question_type === 'Optional'}
			<form
				method="POST"
				action="?/radioGroup&questionId={id}"
				class="space-y-4"
				use:optEnhance
			>
				<Form.Fieldset form={optFormInst} name="type" class="space-y-3">
					<Form.Legend class="text-base">{question}</Form.Legend>
					<RadioGroup.Root
						bind:value={$optData.type}
						class="flex flex-col space-y-1"
						name="type"
						disabled={answered}
					>
						{#each safeOpts as option}
							<div class="flex items-center space-x-3 space-y-0">
								<Form.Control>
									{#snippet children({ props })}
										<RadioGroup.Item value={option} {...props} />
										<Form.Label class="font-normal">{option}</Form.Label>
									{/snippet}
								</Form.Control>
							</div>
						{/each}
					</RadioGroup.Root>
					<Form.FieldErrors />
				</Form.Fieldset>
				{#if $optDelayed}
					<Button class="flex w-full gap-2" variant="outline" disabled>
						<span
							class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent"
							role="status"
							aria-label="loading"
						></span>
						Saving...
					</Button>
				{:else}
					<Form.Button variant="outline" class="w-full" disabled={answered}>
						<CheckCheck />
						{answered ? 'Saved' : 'Save'}
					</Form.Button>
				{/if}
			</form>
		{/if}

		{#if question_type === 'Likert'}
			<form
				method="POST"
				action="?/singleform&questionId={id}"
				class="space-y-4"
				use:singleEnhance
			>
				<Form.Fieldset form={singleFormInst} name="answer" class="space-y-3">
					<Form.Legend class="text-base">{question}</Form.Legend>
					<RadioGroup.Root
						bind:value={$singleData.answer}
						class="flex flex-col space-y-1"
						name="answer"
						disabled={answered}
					>
						<Form.Control>
							{#snippet children({ props })}
								<LikertComposition {likert_key} disabled={answered} {...props} />
							{/snippet}
						</Form.Control>
					</RadioGroup.Root>
					<Form.FieldErrors />
				</Form.Fieldset>
				{#if $singleDelayed}
					<Button class="flex w-full gap-2" variant="outline" disabled>
						<span
							class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent"
							role="status"
							aria-label="loading"
						></span>
						Saving...
					</Button>
				{:else}
					<Form.Button variant="outline" class="w-full" disabled={answered}>
						<CheckCheck />
						{answered ? 'Saved' : 'Save'}
					</Form.Button>
				{/if}
			</form>
		{/if}

		{#if question_type === 'Rating'}
			<form
				action="?/rateform&questionId={id}"
				method="POST"
				class="space-y-4"
				use:rateEnhance
			>
				<Form.Field form={rateFormInst} name="answer">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-lg">{question}</Form.Label>
							<StarComponent disabled={answered} {...props} bind:value={$rateData.answer} />
						{/snippet}
					</Form.Control>
					<Form.Description>Please select at least one rating.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				{#if $rateDelayed}
					<Button class="flex w-full gap-2" variant="outline" disabled>
						<span
							class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent"
							role="status"
							aria-label="loading"
						></span>
						Saving...
					</Button>
				{:else}
					<Form.Button variant="outline" class="w-full" disabled={answered}>
						<CheckCheck />
						{answered ? 'Saved' : 'Save'}
					</Form.Button>
				{/if}
			</form>
		{/if}

		{#if question_type === 'Ranking'}
			<form
				action="?/rankform&questionId={id}"
				method="POST"
				class="space-y-4"
				use:rnkEnhance
			>
				<Card.Root class="border-0 shadow-none">
					<Card.Header class="px-0 pt-0">
						<Card.Title class="text-base font-medium">{question}</Card.Title>
						<Card.Description
							>Rate the following on a scale of 1 (high) to 5 (low)</Card.Description
						>
					</Card.Header>
					<Card.Content class="px-0">
						{#each safeOpts as aspect}
							<Form.Field form={rnkFormInst} name={aspect}>
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>{aspect}</Form.Label>
										<div class="grid grid-cols-5 gap-1 lg:max-w-lg">
											{#each RANKS as rank}
												{@const isSelected = !tempNulls[aspect] && $rnkData[aspect] === rank}
												{@const isDisabled =
													answered || (!isSelected && isRankTaken(aspect, rank))}
												<Button
													{...props}
													type="button"
													variant={isSelected ? 'default' : 'secondary'}
													size="icon"
													disabled={isDisabled}
													class={isSelected ? 'bg-primary text-primary-foreground' : ''}
													onclick={() => setRank(aspect, rank)}
												>
													{rank}
												</Button>
												<Input {...props} bind:value={$rnkData[aspect]} class="hidden" />
											{/each}
										</div>
										<Form.FieldErrors />
									{/snippet}
								</Form.Control>
							</Form.Field>
						{/each}
					</Card.Content>
					<Card.Footer class="px-0">
						{#if $rnkDelayed}
							<Button class="flex w-full gap-2" variant="outline" disabled>
								<span
									class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent"
									role="status"
									aria-label="loading"
								></span>
								Saving...
							</Button>
						{:else}
							<Form.Button variant="outline" class="w-full" disabled={answered}>
								<CheckCheck />
								{answered ? 'Saved' : 'Save'}
							</Form.Button>
						{/if}
					</Card.Footer>
				</Card.Root>
			</form>
		{/if}

		{#if question_type === 'Multiple'}
			<form
				action="?/checkboxMultiple&questionId={id}"
				method="POST"
				class="space-y-4"
				use:multiEnhance
			>
				<Form.Fieldset form={multiFormInst} name="items" class="space-y-0">
					<div class="mb-4">
						<Form.Legend class="py-1 text-base">{question}</Form.Legend>
						<Form.Description>Select all that apply.</Form.Description>
					</div>
					<div class="space-y-2">
						{#each combined as item}
							{@const checked = $multiData.items.some((i) => i.id === item.id)}
							<div class="flex flex-row items-start space-x-3">
								<Form.Control>
									{#snippet children({ props })}
										<Checkbox
											{...props}
											{checked}
											value={item.id}
											disabled={answered}
											onCheckedChange={(v) => {
												if (v) addItem(item.id, item.label);
												else removeItem(item.id);
											}}
										/>
										<Form.Label class="font-normal">{item.label}</Form.Label>
									{/snippet}
								</Form.Control>
							</div>
						{/each}
						<Form.FieldErrors />
					</div>
				</Form.Fieldset>
				{#if $multiDelayed}
					<Button class="flex w-full gap-2" variant="outline" disabled>
						<span
							class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent"
							role="status"
							aria-label="loading"
						></span>
						Saving...
					</Button>
				{:else}
					<Form.Button variant="outline" class="w-full" disabled={answered}>
						<CheckCheck />
						{answered ? 'Saved' : 'Save'}
					</Form.Button>
				{/if}
			</form>
		{/if}
	</Card.Content>
</Card.Root>
