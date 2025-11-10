<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { PageData } from '../$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { schema, type LiveSchema } from './schema';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';

	// Components
	import Button from '$lib/components/ui/button/button.svelte';
	let {
		data
	}: {
		data: SuperValidated<Infer<LiveSchema>>;
	} = $props();

	const form = superForm(data, {
		validators: zodClient(schema),
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

<form method="post" action="?/goLive" use:enhance class="px-5 md:px-1">
	{#if $delayed}
		<Button class="flex w-full gap-2" disabled={$delayed} variant="outline">
			<span
				class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
				role="status"
				aria-label="loading"
			></span>
			Loading...
		</Button>
	{:else}
		<Form.Button class="w-full" variant="default">Go Live</Form.Button>
	{/if}
</form>
