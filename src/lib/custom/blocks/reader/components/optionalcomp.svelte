<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Button } from '$lib/components/ui/button';

	// lucide
	import CheckCheck from 'lucide-svelte/icons/check-check';
	// superforms
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { enumBuilder, type OptionalSchema } from '../super_schema';
	// sonner
	import { toast } from 'svelte-sonner';

	let {
		data,
		question,
		options,
		cur_id
	}: {
		data: SuperValidated<Infer<OptionalSchema>>;
		question: string;
		options: string[];
		cur_id: string;
	} = $props();
	// Create the schema with the options from props
	const optionalSchema = enumBuilder(options);
	const form = superForm(data, {
		id: cur_id,
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
</script>

<form method="POST" action="?/radioGroup" class="w-2/3 space-y-6" use:enhance>
	<Form.Fieldset {form} name="type" class="space-y-3">
		<Form.Legend>{question}</Form.Legend>
		<RadioGroup.Root bind:value={$formData.type} class="flex flex-col space-y-1" name="type">
			{#each options as option}
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
	{#if $delayed}
		<Button class="flex w-full gap-2" variant="outline">
			<span
				class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
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
