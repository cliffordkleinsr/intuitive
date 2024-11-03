<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { subjectSchema, type SubjectSchema } from './schema';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';

	// KitLoad<MiddleWare>
	export let data: SuperValidated<Infer<SubjectSchema>>;

	const form = superForm(data, {
		validators: zodClient(subjectSchema),
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

<!-- <SuperDebug data={$formData}/> -->
<form class="grid gap-4" method="POST" use:enhance>
	<div class="grid gap-2">
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input {...props} type="text" bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="grid gap-2">
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} type="email" bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="grid gap-2">
		<Form.Field {form} name="subject">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Label</Form.Label>
					<Textarea {...props} bind:value={$formData.subject} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	{#if $delayed}
		<Button class="flex gap-2">
			<span
				class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
				role="status"
				aria-label="loading"
			></span>
			Loading...
		</Button>
	{:else}
		<Form.Button disabled={$delayed}>Submit</Form.Button>
	{/if}
</form>
