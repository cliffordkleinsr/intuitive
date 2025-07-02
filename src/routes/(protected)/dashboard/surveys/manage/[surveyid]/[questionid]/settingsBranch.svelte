<script lang="ts">
	import {
		buildSelectSchema,
		type BuildSelectSchema
	} from '$lib/custom/blocks/reader/super_schema';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$lib/components/ui/select';
	import type { clientData } from '$lib/types';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Button } from '$lib/components/ui/button';

	type Surveyquestions = clientData['available_qns']; //Pick<clientData, "available_qns">["available_qns"]
	let {
		data,
		surveyqns,
		qs
	}: {
		data: SuperValidated<Infer<BuildSelectSchema>>;
		surveyqns: Surveyquestions[];
		qs: Surveyquestions;
	} = $props();
	// let optionValues = $state(qs.options.map(() => ''));
	// const triggerContent = (optionIndex: number) => {
	// 	return (
	// 		surveyqns
	// 			.map((items) => ({
	// 				label: items.question,
	// 				value: items.question
	// 			}))
	// 			.find((f) => f.value === optionValues[optionIndex])?.label ?? 'Select an option'
	// 	);
	// };
	const selectSchema = buildSelectSchema(qs.options.length);
	const form = superForm(data, {
		validators: zodClient(selectSchema),
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
	const triggerContent = (optionIndex: number) => {
		return (
			surveyqns
				.map((items) => ({
					label: items.question,
					value: items.id
				}))
				.find((f) => f.value === $formData[`option${optionIndex}`])?.label ?? 'Select an option' // Access from formData
		);
	};
</script>

<form method="POST" class="grid gap-2" use:enhance>
	{#each qs.options as option, optionIndex}
		{@const name = `option${optionIndex}`}
		<Form.Field {form} {name}>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex max-w-sm gap-1">
						<p>If answer at Q{optionIndex + 1}</p>
						<span> = </span>
						<p>{option}</p>
					</div>
					<div class="grid max-w-md gap-1">
						<p>Then go to</p>
						<Select.Root type="single" bind:value={$formData[props.name]} name={props.name}>
							<Select.Trigger {...props}>
								{triggerContent(optionIndex)}
							</Select.Trigger>
							<Select.Content>
								{#each surveyqns as qns}
									{#if new Date(qns.created_at) > new Date(qs.created_at)}
										<Select.Item value={qns.id}>
											{qns.question}
										</Select.Item>
									{/if}
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors>
				{#snippet children({ errors, errorProps })}
					{#each errors as err}
						<span style="color: red;" {...errorProps}>{err}</span>
					{/each}
				{/snippet}
			</Form.FieldErrors>
		</Form.Field>
	{/each}
	{#if $delayed}
		<Button class="flex gap-2" disabled={$delayed}>
			<span
				class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
				role="status"
				aria-label="loading"
			></span>
			Loading...
		</Button>
	{:else}
		<Form.Button>Save</Form.Button>
	{/if}
	<!-- <SuperDebug data={$formData}/> -->
</form>
