<script lang="ts">
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { emailSchema } from './schema';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(emailSchema),
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

<form method="post" class="h-[85vh] py-32" use:enhance>
	<Card.Root class="mx-auto max-w-md">
		<Card.Header>
			<Card.Title>Reset Password</Card.Title>
			<Card.Description>Reset your password if you have forgotten it</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-2">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} type="email" bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.Description>Email to recieve the reset request.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</Card.Content>
		<Card.Footer>
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
				<Form.Button class="w-full">Reset</Form.Button>
			{/if}
		</Card.Footer>
	</Card.Root>
</form>
