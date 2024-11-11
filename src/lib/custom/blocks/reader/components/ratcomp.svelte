<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { ratingSchema, type RateSchema } from '../super_schema';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';

	// lucide
	import CheckCheck from 'lucide-svelte/icons/check-check';
	import { StarComponent } from '../../composition';
	import Input from '$lib/components/ui/input/input.svelte';

	let {
		data,
		question,
		cur_id
	}: { data: SuperValidated<Infer<RateSchema>>; question: string; cur_id: string } = $props();

	const form = superForm(data, {
		id: cur_id,
		validators: zodClient(ratingSchema),
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

<form action="?/rateform" method="POST" class="w-2/3 space-y-6 lg:w-1/4" use:enhance>
	<Form.Field {form} name="answer">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{question}</Form.Label>
				<StarComponent disabled={false} {...props} bind:value={$formData.answer} />
			{/snippet}
		</Form.Control>
		<Form.Description>Please select atleast one rating.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
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
