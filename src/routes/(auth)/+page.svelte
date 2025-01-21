<script lang="ts">
	// SHADCN UI
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';

	// SUPER FORMS
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// ZOD SCHEMA
	import { loginSchema } from '$lib/SharedZod/schema';

	// sonner
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	// KitLoad<MiddleWare>
	let { data }: { data: PageData } = $props();
	const form = superForm(data.form, {
		validators: zodClient(loginSchema),
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

<div class="mb-56 w-full place-content-center py-28">
	<form method="post" use:enhance>
		<Card.Root class="mx-auto mb-16 max-w-sm lg:mx-auto lg:max-w-sm">
			<Card.Header>
				<Card.Title class="text-xl">Login</Card.Title>
				<Card.Description>Super user login</Card.Description>
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
						<Form.FieldErrors />
					</Form.Field>
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
					{#if $delayed}
						<Button class="flex gap-2" variant="black" disabled={$delayed}>
							<span
								class="inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white dark:text-black"
								role="status"
								aria-label="loading"
							></span>
							Loading...
						</Button>
					{:else}
						<Form.Button variant="black">Login</Form.Button>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</form>
</div>
