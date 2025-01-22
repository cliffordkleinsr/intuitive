<script lang="ts">
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { fileSchema } from './schema';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import FormDescription from '$lib/components/ui/form/form-description.svelte';

	let { data }: { data: PageData } = $props();
	const form = superForm(data.form, {
		validators: zodClient(fileSchema),
		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;

			if (alertType === 'success') {
				toast.success(alertText);
			}

			if (alertType === 'error') {
				toast.error(alertText);
			}

			if (alertType === 'info') {
				toast.info(alertText);
			}
			if (alertType === 'warning') {
				toast.warning(alertText);
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
	const file = fileProxy(formData, 'csv');
</script>

<div class="mx-auto flex max-w-xl flex-col gap-2 px-2 py-16">
	<form method="POST" enctype="multipart/form-data" use:enhance>
		<Form.Field {form} name="csv">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Upload data to modify</Form.Label>
					<input
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						{...props}
						type="file"
						accept=".csv, text/csv"
						bind:files={$file}
						hidden
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>Must be of type agent data</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		{#if $delayed}
			<Button class="flex w-full gap-2" disabled={$delayed} variant="black">
				<span
					class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
					role="status"
					aria-label="loading"
				></span>
				Loading...
			</Button>
		{:else}
			<Form.Button class="w-full" variant="black">Submit</Form.Button>
		{/if}
	</form>
	<div class="text-start">
		<SuperDebug data={$formData} />
	</div>
</div>
