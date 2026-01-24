<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { feedbackSchema, type FeedbackSchema } from './schema';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';

	// KitLoad<MiddleWare>
	export let data: SuperValidated<Infer<FeedbackSchema>>;

	const form = superForm(data, {
		validators: zod4Client(feedbackSchema),
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

<Card.Root>
	<Card.Header>
		<Card.Title>We'd Love Your Feedback</Card.Title>
		<Card.Description
			>Help us improve by sharing your thoughts, suggestions, or bug reports.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<form class="space-y-4" method="POST" use:enhance>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
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
				<div>
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
			</div>
			<div>
				<Form.Field {form} name="feedback">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Your Feedback</Form.Label>
							<Textarea {...props} bind:value={$formData.feedback} />
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
				<Form.Button class="w-full" disabled={$delayed}>Submit</Form.Button>
			{/if}
		</form>
	</Card.Content>
	<Card.Footer>
		<!-- <SuperDebug data={$formData}/> -->
	</Card.Footer>
</Card.Root>
