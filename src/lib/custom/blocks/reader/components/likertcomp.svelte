<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Button } from '$lib/components/ui/button';

	// lucide
	import CheckCheck from 'lucide-svelte/icons/check-check';
	// superforms
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		enumBuilder,
		openEndedSchema,
		type OpenEndedSchema,
		type OptionalSchema
	} from '../super_schema';
	// sonner
	import { toast } from 'svelte-sonner';
	import { LikertComposition } from '../../composition';

	let {
		data,
		question,
		likert_key,
		cur_id
	}: {
		data: SuperValidated<Infer<OpenEndedSchema>>;
		question: string;
		likert_key: string;
		cur_id: string;
	} = $props();
	// Create the schema with the options from props
	// const optionalSchema = enumBuilder(options);
	const form = superForm(data, {
		id: cur_id,
		validators: zodClient(openEndedSchema),
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
</script>

<form method="POST" action="?/singleform" class="w-2/3 space-y-6 lg:w-1/4" use:enhance>
	<Form.Fieldset {form} name="answer" class="space-y-3">
		<Form.Legend>{question}</Form.Legend>
		<RadioGroup.Root bind:value={$formData.answer} class="flex flex-col space-y-1" name="answer">
			<Form.Control>
				{#snippet children({ props })}
					<LikertComposition {likert_key} disabled={false} {...props} />
				{/snippet}
			</Form.Control>
		</RadioGroup.Root>
		<Form.FieldErrors />
	</Form.Fieldset>
	{#if $delayed}
		<Button class="flex w-full gap-2" variant="outline">
			<span
				class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent dark:text-white"
				role="status"
				aria-label="loading"
			></span>
			Loading...
		</Button>
	{:else}
		<Form.Button variant="outline" class="w-full">
			<CheckCheck />
			Submit
		</Form.Button>
	{/if}
	<!-- <SuperDebug data={$formData} /> -->
</form>
