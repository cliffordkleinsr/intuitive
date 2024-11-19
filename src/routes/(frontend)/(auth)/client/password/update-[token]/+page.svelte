<script lang="ts">
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { resetpasSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(resetpasSchema),
		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;
			if (alertType === 'success') {
				toast.error(alertText);
			}
			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;
</script>

<form method="post" class="m-5 h-screen" use:enhance>
	<div class="mx-auto max-w-md py-28">
		<div class="grid gap-2">
			<h1 class="text-xl">Change Your Password</h1>
			<p class="mb-3 text-sm text-muted-foreground">Reset your password if you've forgotten it</p>
		</div>
		<div class="grid gap-2">
			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input {...props} type="password" bind:value={$formData.password} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<div class="grid gap-2">
			<Form.Field {form} name="passwordConfirm">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirm Password</Form.Label>
						<Input {...props} type="password" bind:value={$formData.passwordConfirm} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		{#if $delayed}
			<Button class="flex w-full gap-2">
				<span
					class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
					role="status"
					aria-label="loading"
				></span>
				Loading...
			</Button>
		{:else}
			<Form.Button class="w-full">Update Password</Form.Button>
		{/if}
	</div>
</form>
