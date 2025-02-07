<script lang="ts">
	import { enumBuilder, type OptionalSchema } from '$lib/custom/blocks/reader/super_schema';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$lib/components/ui/select';
	import type { clientData } from '$lib/types';
	import * as Form from '$lib/components/ui/form/index.js';
	import { items } from '$lib/custom/functions/helpers';

	type Surveyquestions = clientData['available_qns']; //Pick<clientData, "available_qns">["available_qns"]
	let {
		data,
		options,
		surveyqns,
		qs
	}: {
		data: SuperValidated<Infer<OptionalSchema>>;
		options: string[];
		surveyqns: Surveyquestions[];
		qs: Surveyquestions;
	} = $props();

	const optionalSchema = enumBuilder(options);
	const form = superForm(data, {
		validators: zodClient(optionalSchema),
		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;
			if (alertType === 'success') {
				toast.success(alertText);
			}
			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;

	// let question_context = {
	// 	get surveyqns() {
	// 		return surveyqns;
	// 	}
	// };
	let optionValues = $state(qs.options.map(() => ''));
	const triggerContent = (optionIndex: number) => {
		return (
			surveyqns
				.map((items) => ({
					label: items.question,
					value: items.question
				}))
				.find((f) => f.value === optionValues[optionIndex])?.label ?? 'Select an option'
		);
	};
	// let optionValues = $state(
	// 	question_context.surveyqns.map((question) =>
	// 		question.options ? question.options.map(() => '') : []
	// 	)
	// );
	// // let visible = $state(false);
	// const triggerContent = (questionIndex:number, optionIndex: number) => {
	// 	return (
	// 		surveyqns
	// 			.map((items) => ({
	// 				label: items.question,
	// 				value: items.question
	// 			}))
	// 			.find((f) => f.value === optionValues[questionIndex][optionIndex])?.label ??
	// 		'Select an option'
	// 	);
	// };
</script>

<form method="POST" action="?/branchOpt" class="grid gap-2" use:enhance>
	{#each qs.options as option, optionIndex}
		<Form.Field {form} name="type">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex max-w-sm gap-1">
						<p>If answer at Q{optionIndex + 1}</p>
						<span> = </span>
						<p>{option}</p>
					</div>
					<div class="flex max-w-sm gap-1">
						<p>Then go to</p>
						<Select.Root type="single" bind:value={$formData.type} name={props.name}>
							<Select.Trigger {...props}>
								{$formData.type ? $formData.type : 'Select an option'}
							</Select.Trigger>
							<Select.Content>
								{#each surveyqns as qns}
									{#if new Date(qns.created_at) > new Date(qs.created_at)}
										<Select.Item value={qns.question}>{qns.question}</Select.Item>
									{/if}
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	{/each}
</form>
