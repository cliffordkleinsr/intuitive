<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import SuperDebug, {
		fileProxy,
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { fileSchema, type Fileschema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';

	import { Button } from '$lib/components/ui/button';

	let { data }: { data: SuperValidated<Infer<Fileschema>> } = $props();
	const form = superForm(data, {
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
		}
	});

	const { form: formData, enhance, message, delayed } = form;
	const file = fileProxy(formData, 'csv');
</script>

<form method="POST" enctype="multipart/form-data" use:enhance>
	<Form.Field {form} name="csv">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Upload your emails to share</Form.Label>
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
		<Form.FieldErrors />
	</Form.Field>

	{#if $delayed}
		<Button class="flex w-full gap-2" disabled={$delayed} variant="black">
			<span
				class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white dark:text-black"
				role="status"
				aria-label="loading"
			></span>
			Loading...
		</Button>
	{:else}
		<Form.Button class="w-full" variant="black">Submit</Form.Button>
	{/if}
</form>
<!-- <div class="text-start">
<SuperDebug data={$formData} />
</div> -->
